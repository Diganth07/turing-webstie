/**
 * src/pages/Apply.test.jsx
 *
 * Vitest + React Testing Library tests covering:
 *  - All validation rules (each field)
 *  - Optional college email
 *  - Multi-domain selection
 *  - Success screen
 *  - All error states (422, 409, 413, 415, 429, 500, network)
 *
 * The mock API module is vi.mocked so tests control every scenario without
 * changing MOCK_SCENARIO in the source file.
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Apply from './Apply';

// Mock the API module
vi.mock('../api/applications', () => ({
  submitApplication: vi.fn(),
}));

import { submitApplication } from '../api/applications';

function renderApply() {
  return render(
    <MemoryRouter>
      <Apply />
    </MemoryRouter>
  );
}

// Helper: fill required fields then submit
async function fillAndSubmit(user, overrides = {}) {
  const get = (label) => screen.getByLabelText(label);

  await user.type(get('Full Name'), overrides.name ?? 'Turing Alan');
  await user.type(get('USN (University Seat Number)'), overrides.usn ?? 'JU2024CS001');
  if (overrides.college_email !== undefined) {
    await user.type(get(/College Email/i), overrides.college_email);
  }
  await user.type(get('Personal Email'), overrides.personal_email ?? 'alan@example.com');
  await user.type(get('Mobile Number'), overrides.mobile ?? '9876543210');

  // Domain chip — Tech by default
  const techChip = screen.getByRole('checkbox', { name: /Technology/i });
  await user.click(techChip);

  // Resume
  const resumeInput = document.getElementById('resume');
  const file = overrides.resume ?? new File(['%PDF-1.4 hello'], 'resume.pdf', { type: 'application/pdf' });
  await user.upload(resumeInput, file);

  await user.click(screen.getByRole('button', { name: /Submit Application/i }));
}

// ─── Rendering ────────────────────────────────────────────────────────────────
describe('Apply page rendering', () => {
  it('renders the page heading', () => {
    renderApply();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders all required field labels', () => {
    renderApply();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText(/USN/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Personal Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mobile Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Resume/i)).toBeInTheDocument();
  });

  it('marks college email as optional', () => {
    renderApply();
    expect(screen.getByText('(optional)')).toBeInTheDocument();
  });

  it('renders all domain chips', () => {
    renderApply();
    for (const label of ['Technology', 'Photography', 'Design', 'Marketing', 'Social Media']) {
      expect(screen.getByRole('checkbox', { name: new RegExp(label, 'i') })).toBeInTheDocument();
    }
  });

  it('submit button is present and enabled initially', () => {
    renderApply();
    expect(screen.getByRole('button', { name: /Submit Application/i })).not.toBeDisabled();
  });
});

// ─── Name validation ──────────────────────────────────────────────────────────
describe('Name validation', () => {
  it('shows error when name is empty on blur', async () => {
    const user = userEvent.setup();
    renderApply();
    const input = screen.getByLabelText('Full Name');
    await user.click(input);
    await user.tab();
    expect(await screen.findByText(/Name is required/i)).toBeInTheDocument();
  });

  it('shows error when name is too short', async () => {
    const user = userEvent.setup();
    renderApply();
    const input = screen.getByLabelText('Full Name');
    await user.type(input, 'A');
    await user.tab();
    expect(await screen.findByText(/at least 2/i)).toBeInTheDocument();
  });

  it('shows error when name is too long', async () => {
    const user = userEvent.setup();
    renderApply();
    const input = screen.getByLabelText('Full Name');
    await user.type(input, 'A'.repeat(101));
    await user.tab();
    expect(await screen.findByText(/at most 100/i)).toBeInTheDocument();
  });

  it('shows error for invalid characters', async () => {
    const user = userEvent.setup();
    renderApply();
    const input = screen.getByLabelText('Full Name');
    await user.type(input, '<script>');
    await user.tab();
    expect(await screen.findByText(/only letters/i)).toBeInTheDocument();
  });

  it('accepts letters with dots, hyphens and apostrophes', async () => {
    const user = userEvent.setup();
    renderApply();
    const input = screen.getByLabelText('Full Name');
    await user.type(input, "D'Arcy O'Brien-Smith");
    await user.tab();
    expect(screen.queryByText(/Name is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/only letters/i)).not.toBeInTheDocument();
  });
});

// ─── USN validation ───────────────────────────────────────────────────────────
describe('USN validation', () => {
  it('shows error when USN is empty on blur', async () => {
    const user = userEvent.setup();
    renderApply();
    const input = screen.getByLabelText(/USN/i);
    await user.click(input);
    await user.tab();
    expect(await screen.findByText(/USN is required/i)).toBeInTheDocument();
  });

  it('shows error when USN is too short', async () => {
    const user = userEvent.setup();
    renderApply();
    const input = screen.getByLabelText(/USN/i);
    await user.type(input, 'AB1');
    await user.tab();
    expect(await screen.findByText(/at least 5/i)).toBeInTheDocument();
  });

  it('shows error when USN is too long', async () => {
    const user = userEvent.setup();
    renderApply();
    const input = screen.getByLabelText(/USN/i);
    await user.type(input, 'A'.repeat(21));
    await user.tab();
    expect(await screen.findByText(/at most 20/i)).toBeInTheDocument();
  });

  it('rejects USN with special characters', async () => {
    const user = userEvent.setup();
    renderApply();
    const input = screen.getByLabelText(/USN/i);
    await user.type(input, 'JU-2024!');
    await user.tab();
    expect(await screen.findByText(/only letters and digits/i)).toBeInTheDocument();
  });

  it.each(['JU2024CS001', 'ABC123', '12345', 'ABCDE12345FGHIJ67890'])(
    'accepts valid USN format: %s', async (usn) => {
      const user = userEvent.setup();
      renderApply();
      const input = screen.getByLabelText(/USN/i);
      await user.type(input, usn);
      await user.tab();
      expect(screen.queryByText(/USN is required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/only letters and digits/i)).not.toBeInTheDocument();
    }
  );
});

// ─── College email (optional) ─────────────────────────────────────────────────
describe('College email (optional)', () => {
  it('does not show an error when college email is omitted', async () => {
    const user = userEvent.setup();
    renderApply();
    const input = screen.getByLabelText(/College Email/i);
    await user.click(input);
    await user.tab();
    expect(screen.queryByText(/valid email/i)).not.toBeInTheDocument();
  });

  it('does not show an error when college email is empty string', async () => {
    const user = userEvent.setup();
    renderApply();
    const input = screen.getByLabelText(/College Email/i);
    await user.type(input, '   ');
    await user.tab();
    expect(screen.queryByText(/valid email/i)).not.toBeInTheDocument();
  });

  it('shows error when college email has invalid format', async () => {
    const user = userEvent.setup();
    renderApply();
    const input = screen.getByLabelText(/College Email/i);
    await user.type(input, 'not-an-email');
    await user.tab();
    expect(await screen.findByText(/valid email address/i)).toBeInTheDocument();
  });

  it('accepts any valid domain for college email', async () => {
    const user = userEvent.setup();
    renderApply();
    const input = screen.getByLabelText(/College Email/i);
    await user.type(input, 'student@anydomain.org');
    await user.tab();
    expect(screen.queryByText(/valid email address/i)).not.toBeInTheDocument();
  });
});

// ─── Personal email ───────────────────────────────────────────────────────────
describe('Personal email validation', () => {
  it('shows error when personal email is empty', async () => {
    const user = userEvent.setup();
    renderApply();
    const input = screen.getByLabelText('Personal Email');
    await user.click(input);
    await user.tab();
    expect(await screen.findByText(/Personal email is required/i)).toBeInTheDocument();
  });

  it('shows error for invalid format', async () => {
    const user = userEvent.setup();
    renderApply();
    const input = screen.getByLabelText('Personal Email');
    await user.type(input, 'notanemail');
    await user.tab();
    expect(await screen.findByText(/valid email address/i)).toBeInTheDocument();
  });

  it('accepts plus-addressing', async () => {
    const user = userEvent.setup();
    renderApply();
    const input = screen.getByLabelText('Personal Email');
    await user.type(input, 'user+tag@gmail.com');
    await user.tab();
    expect(screen.queryByText(/valid email/i)).not.toBeInTheDocument();
  });
});

// ─── Mobile validation ────────────────────────────────────────────────────────
describe('Mobile validation', () => {
  it('shows error when mobile is empty', async () => {
    const user = userEvent.setup();
    renderApply();
    const input = screen.getByLabelText('Mobile Number');
    await user.click(input);
    await user.tab();
    expect(await screen.findByText(/Mobile number is required/i)).toBeInTheDocument();
  });

  it('shows error for 9-digit number', async () => {
    const user = userEvent.setup();
    renderApply();
    const input = screen.getByLabelText('Mobile Number');
    await user.type(input, '987654321');
    await user.tab();
    expect(await screen.findByText(/10-digit/i)).toBeInTheDocument();
  });

  it('accepts number with +91 prefix', async () => {
    const user = userEvent.setup();
    renderApply();
    const input = screen.getByLabelText('Mobile Number');
    await user.type(input, '+919876543210');
    await user.tab();
    expect(screen.queryByText(/10-digit/i)).not.toBeInTheDocument();
  });

  it('accepts number with leading 0', async () => {
    const user = userEvent.setup();
    renderApply();
    const input = screen.getByLabelText('Mobile Number');
    await user.type(input, '09876543210');
    await user.tab();
    expect(screen.queryByText(/10-digit/i)).not.toBeInTheDocument();
  });

  it('rejects numbers starting with digit below 6', async () => {
    const user = userEvent.setup();
    renderApply();
    const input = screen.getByLabelText('Mobile Number');
    await user.type(input, '5876543210');
    await user.tab();
    expect(await screen.findByText(/10-digit/i)).toBeInTheDocument();
  });
});

// ─── Resume validation ────────────────────────────────────────────────────────
describe('Resume validation', () => {
  it('shows error when no resume uploaded and form submitted', async () => {
    const user = userEvent.setup();
    submitApplication.mockResolvedValue({ status: 201, body: { id: 'x', message: 'ok' } });
    renderApply();
    await user.click(screen.getByRole('button', { name: /Submit Application/i }));
    expect(await screen.findByText(/Please upload your resume/i)).toBeInTheDocument();
  });

  it('shows error for non-PDF file', async () => {
    renderApply();
    const input = document.getElementById('resume');
    const file = new File(['data'], 'resume.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    // Use fireEvent for sr-only hidden file inputs where userEvent may not propagate
    Object.defineProperty(input, 'files', { value: [file], configurable: true });
    fireEvent.change(input);
    expect(await screen.findByText(/must be a PDF/i)).toBeInTheDocument();
  });

  it('shows error for oversized PDF', async () => {
    renderApply();
    const input = document.getElementById('resume');
    // Create a File with a manually mocked size above the 5 MB limit
    const file = new File(['%PDF-1.4 content'], 'big.pdf', { type: 'application/pdf' });
    // Override size to simulate 6 MB because jsdom does not support large Uint8Array files reliably
    Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024, configurable: true });
    Object.defineProperty(input, 'files', { value: [file], configurable: true });
    fireEvent.change(input);
    expect(await screen.findByText(/5 MB or less/i)).toBeInTheDocument();
  });
});

// ─── Domain selection ─────────────────────────────────────────────────────────
describe('Domain multi-selection', () => {
  it('shows error when no domain selected on submit', async () => {
    const user = userEvent.setup();
    renderApply();
    await user.click(screen.getByRole('button', { name: /Submit Application/i }));
    expect(await screen.findByText(/Select at least one domain/i)).toBeInTheDocument();
  });

  it('selects and deselects chips correctly', async () => {
    const user = userEvent.setup();
    renderApply();
    const techChip = screen.getByRole('checkbox', { name: /Technology/i });
    expect(techChip).toHaveAttribute('aria-checked', 'false');
    await user.click(techChip);
    expect(techChip).toHaveAttribute('aria-checked', 'true');
    await user.click(techChip);
    expect(techChip).toHaveAttribute('aria-checked', 'false');
  });

  it('allows selecting multiple domains', async () => {
    const user = userEvent.setup();
    renderApply();
    await user.click(screen.getByRole('checkbox', { name: /Technology/i }));
    await user.click(screen.getByRole('checkbox', { name: /Design/i }));
    expect(screen.getByRole('checkbox', { name: /Technology/i })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('checkbox', { name: /Design/i })).toHaveAttribute('aria-checked', 'true');
  });
});

// ─── Loading state ────────────────────────────────────────────────────────────
describe('Loading state', () => {
  it('disables submit button while loading', async () => {
    submitApplication.mockImplementation(() => new Promise(() => {})); // never resolves
    const user = userEvent.setup();
    renderApply();
    await fillAndSubmit(user);
    expect(screen.getByRole('button', { name: /Submitting/i })).toBeDisabled();
  });
});

// ─── Success state ────────────────────────────────────────────────────────────
describe('Success screen', () => {
  it('shows success message after 201', async () => {
    submitApplication.mockResolvedValue({ status: 201, body: { id: 'abc', message: 'Application received' } });
    const user = userEvent.setup();
    renderApply();
    await fillAndSubmit(user);
    expect(await screen.findByText(/You're registered!/i)).toBeInTheDocument();
    expect(screen.getByText(/Thanks for registering/i)).toBeInTheDocument();
    expect(screen.getByText(/confirmation email has been sent/i)).toBeInTheDocument();
  });

  it('shows the personal email in the success screen', async () => {
    submitApplication.mockResolvedValue({ status: 201, body: { id: 'abc', message: 'Application received' } });
    const user = userEvent.setup();
    renderApply();
    await fillAndSubmit(user, { personal_email: 'alan@example.com' });
    expect(await screen.findByText('alan@example.com')).toBeInTheDocument();
  });
});

// ─── Error states ─────────────────────────────────────────────────────────────
describe('Error states', () => {
  it('shows per-field errors from API 422', async () => {
    submitApplication.mockResolvedValue({
      status: 422,
      body: {
        error: 'validation_error',
        fields: { usn: 'Enter a valid USN.', domains: 'Select at least one domain.' },
      },
    });
    const user = userEvent.setup();
    renderApply();
    await fillAndSubmit(user);
    expect(await screen.findByText('Enter a valid USN.')).toBeInTheDocument();
    expect(screen.getByText('Select at least one domain.')).toBeInTheDocument();
  });

  it('shows duplicate message for 409', async () => {
    submitApplication.mockResolvedValue({
      status: 409,
      body: { error: 'duplicate_application', message: 'You have already applied.' },
    });
    const user = userEvent.setup();
    renderApply();
    await fillAndSubmit(user);
    expect(await screen.findByText(/already applied/i)).toBeInTheDocument();
  });

  it('shows resume error for 413', async () => {
    submitApplication.mockResolvedValue({
      status: 413,
      body: { error: 'file_too_large', message: 'Resume must be 5 MB or less.' },
    });
    const user = userEvent.setup();
    renderApply();
    await fillAndSubmit(user);
    expect(await screen.findByText(/5 MB or less/i)).toBeInTheDocument();
  });

  it('shows file type error for 415', async () => {
    submitApplication.mockResolvedValue({
      status: 415,
      body: { error: 'invalid_file_type', message: 'Resume must be a PDF.' },
    });
    const user = userEvent.setup();
    renderApply();
    await fillAndSubmit(user);
    expect(await screen.findByText(/must be a PDF/i)).toBeInTheDocument();
  });

  it('shows retry message for 429', async () => {
    submitApplication.mockResolvedValue({
      status: 429,
      body: { error: 'rate_limited', message: 'Too many requests. Please wait a moment and try again.' },
    });
    const user = userEvent.setup();
    renderApply();
    await fillAndSubmit(user);
    expect(await screen.findByText(/Too many requests/i)).toBeInTheDocument();
  });

  it('shows generic error for 500', async () => {
    submitApplication.mockResolvedValue({
      status: 500,
      body: { error: 'server_error', message: 'Something went wrong. Please try again.' },
    });
    const user = userEvent.setup();
    renderApply();
    await fillAndSubmit(user);
    expect(await screen.findByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it('shows network error message when fetch rejects', async () => {
    submitApplication.mockRejectedValue(new Error('Network Error'));
    const user = userEvent.setup();
    renderApply();
    await fillAndSubmit(user);
    expect(await screen.findByText(/Could not connect/i)).toBeInTheDocument();
  });
});
