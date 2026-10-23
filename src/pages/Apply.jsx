import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { submitApplication } from '../api/applications';

// ─── Domain options (contract keys & labels) ─────────────────────────────────
const DOMAINS = [
  { key: 'technology',  label: 'Technology',  helper: null },
  { key: 'photography', label: 'Photography', helper: null },
  { key: 'design',      label: 'Design',      helper: null },
  { key: 'marketing',   label: 'Marketing',   helper: 'Outreach, PR, Events' },
  { key: 'social-media',label: 'Social Media',helper: null },
];

const MAX_RESUME_MB = 5;
const MAX_NAME_LEN  = 100;
const MIN_NAME_LEN  = 2;
const MIN_USN_LEN   = 5;
const MAX_USN_LEN   = 20;

// ─── Validation helpers ───────────────────────────────────────────────────────
export function normalizeMobile(raw) {
  let d = raw.replace(/[\s\-+]/g, '');
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
  else if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  return d;
}

function validateField(name, value, _allValues) {
  switch (name) {
    case 'name': {
      const v = value.trim();
      if (!v) return 'Name is required.';
      if (v.length < MIN_NAME_LEN) return `Name must be at least ${MIN_NAME_LEN} characters.`;
      if (v.length > MAX_NAME_LEN) return `Name must be at most ${MAX_NAME_LEN} characters.`;
      if (!/^[\p{L}\s.\-']+$/u.test(v)) return 'Only letters, spaces, dots, hyphens and apostrophes are allowed.';
      return '';
    }
    case 'usn': {
      const v = value.trim().toUpperCase();
      if (!v) return 'USN / application number is required.';
      if (v.length < MIN_USN_LEN) return `USN / application number must be at least ${MIN_USN_LEN} characters.`;
      if (v.length > MAX_USN_LEN) return `USN / application number must be at most ${MAX_USN_LEN} characters.`;
      if (!/^[A-Z0-9]+$/.test(v)) return 'USN / application number must contain only letters and digits.';
      return '';
    }
    case 'college_email': {
      const v = value.trim();
      if (!v) return ''; // optional
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address.';
      return '';
    }
    case 'personal_email': {
      const v = value.trim();
      if (!v) return 'Personal email is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address.';
      return '';
    }
    case 'mobile': {
      if (!value.trim()) return 'Mobile number is required.';
      if (!/^[6-9]\d{9}$/.test(normalizeMobile(value))) return 'Enter a valid 10-digit Indian mobile number.';
      return '';
    }
    case 'resume': {
      if (!value) return 'Please upload your resume (PDF).';
      if (value.type !== 'application/pdf' && !value.name.toLowerCase().endsWith('.pdf'))
        return 'Resume must be a PDF file.';
      if (value.size > MAX_RESUME_MB * 1024 * 1024)
        return `Resume must be ${MAX_RESUME_MB} MB or less.`;
      if (value.size === 0) return 'The uploaded file appears to be empty.';
      return '';
    }
    case 'domains': {
      if (!Array.isArray(value) || value.length === 0)
        return 'Select at least one domain.';
      return '';
    }
    default:
      return '';
  }
}

// ─── Initial state ────────────────────────────────────────────────────────────
const INITIAL_VALUES = {
  name: '',
  usn: '',
  college_email: '',
  personal_email: '',
  mobile: '',
  resume: null,
  domains: [],
};
const INITIAL_ERRORS   = Object.fromEntries(Object.keys(INITIAL_VALUES).map((k) => [k, '']));
const INITIAL_TOUCHED  = Object.fromEntries(Object.keys(INITIAL_VALUES).map((k) => [k, false]));

// ─── Sub-components ───────────────────────────────────────────────────────────
function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs text-red-400 leading-snug">
      {message}
    </p>
  );
}

function Label({ htmlFor, children, optional }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-text mb-1.5">
      {children}
      {optional && (
        <span className="ml-1.5 text-xs font-normal text-text-dim">(optional)</span>
      )}
    </label>
  );
}

function inputCls(hasError) {
  return [
    'w-full px-4 py-2.5 rounded-lg border bg-surface text-text text-sm placeholder:text-text-dim',
    'focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-150',
    hasError
      ? 'border-red-500/70 focus:ring-red-500/40'
      : 'border-border hover:border-white/20 focus:border-primary',
  ].join(' ');
}

// ─── Success screen ───────────────────────────────────────────────────────────
function SuccessScreen({ email }) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center py-16 px-4"
      role="status"
      aria-live="polite"
    >
      {/* Checkmark icon */}
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          className="w-8 h-8 text-emerald-400">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
        You&apos;re registered!
      </h2>
      <p className="text-text-muted text-sm sm:text-base max-w-md leading-relaxed mb-2">
        Thanks for registering. We&apos;ll update you when the next auditions are announced.
      </p>
      <p className="text-xs text-text-dim max-w-sm">
        A confirmation email has been sent to{' '}
        <span className="text-primary-light font-medium">{email}</span>.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-surface/80 hover:bg-surface hover:border-white/20 text-text-muted hover:text-white text-sm font-medium transition-all duration-150"
      >
        ← Back to Home
      </Link>
    </div>
  );
}

// ─── Global error banner ──────────────────────────────────────────────────────
function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-3 px-4 py-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 text-sm leading-snug"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        className="w-4 h-4 shrink-0 mt-0.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
      </svg>
      <span className="flex-1">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss error"
        className="shrink-0 text-red-400/60 hover:text-red-300 transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Apply() {
  const [values,  setValues]  = useState(INITIAL_VALUES);
  const [errors,  setErrors]  = useState(INITIAL_ERRORS);
  const [touched, setTouched] = useState(INITIAL_TOUCHED);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [successEmail, setSuccessEmail] = useState('');

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleChange = useCallback((name, rawValue) => {
    setValues((prev) => ({ ...prev, [name]: rawValue }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, rawValue, values) }));
    }
    setGlobalError('');
  }, [touched, values]);

  const handleBlur = useCallback((name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, values[name], values) }));
  }, [values]);

  const handleResumeChange = useCallback((file) => {
    setTouched((prev) => ({ ...prev, resume: true }));
    setValues((prev) => ({ ...prev, resume: file }));
    setErrors((prev) => ({ ...prev, resume: validateField('resume', file, values) }));
    setGlobalError('');
  }, [values]);

  const toggleDomain = useCallback((key) => {
    setTouched((prev) => ({ ...prev, domains: true }));
    setValues((prev) => {
      const next = prev.domains.includes(key)
        ? prev.domains.filter((d) => d !== key)
        : [...prev.domains, key];
      setErrors((e) => ({ ...e, domains: validateField('domains', next, prev) }));
      return { ...prev, domains: next };
    });
  }, []);

  const validateAll = useCallback(() => {
    const allTouched = Object.fromEntries(Object.keys(INITIAL_TOUCHED).map((k) => [k, true]));
    setTouched(allTouched);
    const newErrors = Object.fromEntries(
      Object.keys(INITIAL_VALUES).map((k) => [k, validateField(k, values[k], values)])
    );
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  }, [values]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setGlobalError('');

    if (!validateAll()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name',           values.name.trim());
      formData.append('usn',            values.usn.trim().toUpperCase());
      formData.append('personal_email', values.personal_email.trim().toLowerCase());
      formData.append('mobile',         normalizeMobile(values.mobile));
      if (values.college_email.trim()) {
        formData.append('college_email', values.college_email.trim().toLowerCase());
      }
      values.domains.forEach((d) => formData.append('domains', d));
      formData.append('resume', values.resume);

      const { status, body } = await submitApplication(formData);

      if (status === 201) {
        setSuccessEmail(values.personal_email.trim().toLowerCase());
        setSubmitted(true);
        return;
      }

      if (status === 422 && body?.fields) {
        // Map API field errors back to form state
        const apiErrors = { ...INITIAL_ERRORS };
        Object.entries(body.fields).forEach(([field, msg]) => {
          if (field in apiErrors) apiErrors[field] = msg;
        });
        setErrors(apiErrors);
        setGlobalError('Please fix the highlighted fields and try again.');
        return;
      }

      if (status === 409) {
        setGlobalError('You have already applied. Each student can submit one application.');
        return;
      }
      if (status === 413) {
        setErrors((prev) => ({ ...prev, resume: 'Resume must be 5 MB or less.' }));
        return;
      }
      if (status === 415) {
        setErrors((prev) => ({ ...prev, resume: 'Resume must be a PDF file.' }));
        return;
      }
      if (status === 429) {
        setGlobalError('Too many requests. Please wait a moment and try again.');
        return;
      }

      // 500 / network / anything else
      setGlobalError('Something went wrong. Please try again in a moment.');
    } catch {
      setGlobalError('Could not connect to the server. Check your internet and try again.');
    } finally {
      setLoading(false);
    }
  }, [values, validateAll]);

  // ── Render ───────────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <main className="min-h-screen bg-bg">
        <div className="max-w-2xl mx-auto px-5 md:px-10 py-20 md:py-28">
          <SuccessScreen email={successEmail} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg">
      {/* Page header */}
      <div className="border-b border-border">
        <div className="max-w-2xl mx-auto px-5 md:px-10 pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 border border-border rounded-full text-[10px] sm:text-xs font-mono tracking-widest text-text-muted uppercase">
            Join the Club
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-3">
            Apply to Join{' '}
            <span className="text-primary-light">The Turing Club</span>
          </h1>
          <p className="text-sm md:text-base text-text-muted leading-relaxed max-w-lg">
            Fill in the form below. We&apos;ll get back to you when the next auditions are confirmed.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-5 md:px-10 py-10 md:py-14">
        <form
          onSubmit={handleSubmit}
          noValidate
          aria-label="Club application form"
        >
          <div className="flex flex-col gap-6">

            {/* Global error */}
            <ErrorBanner message={globalError} onDismiss={() => setGlobalError('')} />

            {/* Name */}
            <div>
              <Label htmlFor="name">Full Name</Label>
              <input
                id="name"
                type="text"
                name="name"
                autoComplete="name"
                value={values.name}
                placeholder="e.g. Turing Alan"
                className={inputCls(!!errors.name)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
              />
              <FieldError id="name-error" message={errors.name} />
            </div>

            {/* USN */}
            <div>
              <Label htmlFor="usn">USN / Application number</Label>
              <input
                id="usn"
                type="text"
                name="usn"
                autoComplete="off"
                value={values.usn}
                placeholder="USN or application number"
                className={inputCls(!!errors.usn)}
                aria-invalid={!!errors.usn}
                aria-describedby={errors.usn ? 'usn-error' : undefined}
                onChange={(e) => handleChange('usn', e.target.value)}
                onBlur={() => handleBlur('usn')}
              />
              <p className="mt-1 text-xs text-text-dim">Enter your USN. If you don't have one, use your application number.</p>
              <FieldError id="usn-error" message={errors.usn} />
            </div>

            {/* College email (optional) */}
            <div>
              <Label htmlFor="college_email" optional>College Email</Label>
              <input
                id="college_email"
                type="email"
                name="college_email"
                autoComplete="email"
                value={values.college_email}
                placeholder="e.g. you@university.edu"
                className={inputCls(!!errors.college_email)}
                aria-invalid={!!errors.college_email}
                aria-describedby={errors.college_email ? 'college-email-error' : undefined}
                onChange={(e) => handleChange('college_email', e.target.value)}
                onBlur={() => handleBlur('college_email')}
              />
              <FieldError id="college-email-error" message={errors.college_email} />
            </div>

            {/* Personal email */}
            <div>
              <Label htmlFor="personal_email">Personal Email</Label>
              <input
                id="personal_email"
                type="email"
                name="personal_email"
                autoComplete="email"
                value={values.personal_email}
                placeholder="e.g. you@gmail.com"
                className={inputCls(!!errors.personal_email)}
                aria-invalid={!!errors.personal_email}
                aria-describedby={errors.personal_email ? 'personal-email-error' : undefined}
                onChange={(e) => handleChange('personal_email', e.target.value)}
                onBlur={() => handleBlur('personal_email')}
              />
              <p className="mt-1 text-xs text-text-dim">We'll send a confirmation email here.</p>
              <FieldError id="personal-email-error" message={errors.personal_email} />
            </div>

            {/* Mobile */}
            <div>
              <Label htmlFor="mobile">Mobile Number</Label>
              <input
                id="mobile"
                type="tel"
                name="mobile"
                autoComplete="tel"
                value={values.mobile}
                placeholder="e.g. 9876543210"
                className={inputCls(!!errors.mobile)}
                aria-invalid={!!errors.mobile}
                aria-describedby={errors.mobile ? 'mobile-error' : undefined}
                onChange={(e) => handleChange('mobile', e.target.value)}
                onBlur={() => handleBlur('mobile')}
              />
              <FieldError id="mobile-error" message={errors.mobile} />
            </div>

            {/* Resume */}
            <div>
              <Label htmlFor="resume">Resume</Label>
              <label
                htmlFor="resume"
                className={[
                  'flex flex-col items-center justify-center gap-2 w-full rounded-lg border-2 border-dashed px-5 py-8 cursor-pointer transition-colors duration-150',
                  errors.resume
                    ? 'border-red-500/50 hover:border-red-400/70'
                    : 'border-border hover:border-white/25',
                  values.resume ? 'bg-surface/60' : 'bg-surface/30',
                ].join(' ')}
                aria-invalid={!!errors.resume}
                aria-describedby={errors.resume ? 'resume-error' : undefined}
              >
                {values.resume ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                      className="w-8 h-8 text-primary-light">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="18" x2="12" y2="12" />
                      <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                    <span className="text-sm text-text font-medium truncate max-w-[240px]">
                      {values.resume.name}
                    </span>
                    <span className="text-xs text-text-dim">
                      {(values.resume.size / 1024 / 1024).toFixed(2)} MB · click to replace
                    </span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                      className="w-8 h-8 text-text-dim">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span className="text-sm text-text-muted">
                      <span className="text-primary-light font-medium">Click to upload</span> or drag &amp; drop
                    </span>
                    <span className="text-xs text-text-dim">PDF only · max {MAX_RESUME_MB} MB</span>
                  </>
                )}
                <input
                  id="resume"
                  type="file"
                  name="resume"
                  accept=".pdf,application/pdf"
                  className="sr-only"
                  onChange={(e) => {
                    handleResumeChange(e.target.files?.[0] ?? null);
                  }}
                />
              </label>
              <FieldError id="resume-error" message={errors.resume} />
            </div>

            {/* Domains */}
            <div>
              <fieldset aria-describedby={errors.domains ? 'domains-error' : undefined}>
                <legend className="text-sm font-medium text-text mb-3">
                  Domains{' '}
                  <span className="text-text-dim font-normal text-xs ml-1">
                    (select one or more)
                  </span>
                </legend>
                <div
                  className="flex flex-wrap items-center justify-center gap-3"
                  role="group"
                  aria-label="Select your domains"
                >
                  {DOMAINS.map(({ key, label, helper }) => {
                    const selected = values.domains.includes(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        role="checkbox"
                        aria-checked={selected}
                        onClick={() => toggleDomain(key)}
                        className={[
                          'flex flex-col items-center justify-center text-center px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150 min-h-[64px] w-[calc(50%-0.5rem)] sm:w-[175px]',
                          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
                          selected
                            ? 'border-primary bg-primary/10 text-primary-light shadow-[0_0_0_1px_rgba(37,99,235,0.4)]'
                            : 'border-border bg-surface text-text-muted hover:border-white/25 hover:text-white',
                        ].join(' ')}
                      >
                        <span className="leading-tight">{label}</span>
                        {helper && (
                          <span className={`text-[11px] font-normal leading-tight mt-1 ${selected ? 'text-primary-light/70' : 'text-text-dim'}`}>
                            {helper}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <FieldError id="domains-error" message={errors.domains} />
              </fieldset>
            </div>

            {/* Submit */}
            <div className="pt-4 flex flex-col items-center justify-center text-center">
              <button
                id="submit-application"
                type="submit"
                disabled={loading}
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-lg bg-primary hover:bg-primary-light text-white font-semibold text-sm tracking-tight transition-all duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_4px_14px_rgba(37,99,235,0.35)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_6px_20px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12" cy="12" r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                      />
                    </svg>
                    <span>Submitting…</span>
                  </>
                ) : (
                  <>
                    <span>Submit Application</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
              <p className="mt-3 text-xs text-text-dim leading-relaxed">
                By submitting you agree that the information provided is accurate. Only one application per student per hiring cycle is allowed.
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
