/**
 * src/api/applications.js
 *
 * Single access point for submitting applications.
 * Krishnapriya replaces the mock block (below MOCK_MODE) with the real fetch
 * in PR feat/apply-integration without touching callers.
 *
 * Contract response shapes:
 *  201 → { id: "<uuid>", message: "Application received" }
 *  409 → { error: "duplicate_application", message: "..." }
 *  413 → { error: "file_too_large", message: "..." }
 *  415 → { error: "invalid_file_type", message: "..." }
 *  422 → { error: "validation_error", fields: { fieldName: "message" } }
 *  429 → { error: "rate_limited", message: "..." }
 *  500 → { error: "server_error", message: "..." }
 */

// ─── Mock control ────────────────────────────────────────────────────────────
// Set MOCK_SCENARIO to one of the values below to simulate that response.
// 'success' | '422' | '409' | '413' | '415' | '429' | '500'
const MOCK_SCENARIO = 'success';

const MOCK_DELAY_MS = 1200;

const MOCK_RESPONSES = {
  success: {
    status: 201,
    body: { id: 'mock-uuid-1234', message: 'Application received' },
  },
  422: {
    status: 422,
    body: {
      error: 'validation_error',
      fields: {
        usn: 'Enter a valid USN.',
        domains: 'Select at least one domain.',
      },
    },
  },
  409: {
    status: 409,
    body: {
      error: 'duplicate_application',
      message: 'You have already applied.',
    },
  },
  413: {
    status: 413,
    body: {
      error: 'file_too_large',
      message: 'Resume must be 5 MB or less.',
    },
  },
  415: {
    status: 415,
    body: {
      error: 'invalid_file_type',
      message: 'Resume must be a PDF.',
    },
  },
  429: {
    status: 429,
    body: {
      error: 'rate_limited',
      message: 'Too many requests. Please wait a moment and try again.',
    },
  },
  500: {
    status: 500,
    body: {
      error: 'server_error',
      message: 'Something went wrong. Please try again.',
    },
  },
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Submit an application form.
 *
 * @param {FormData} formData - The multipart form data built by Apply.jsx
 * @returns {Promise<{ status: number, body: object }>}
 *
 * The caller (Apply.jsx) receives the raw { status, body } shape and maps it
 * to UI states. This keeps all HTTP/mock details here and all UI logic there.
 */
export async function submitApplication(_formData) {
  // ── MOCK (remove this block in I1) ──────────────────────────────────────
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
  const mock = MOCK_RESPONSES[MOCK_SCENARIO] ?? MOCK_RESPONSES['500'];
  return { status: mock.status, body: mock.body };
  // ── END MOCK ─────────────────────────────────────────────────────────────

  // ── REAL (Krishnapriya uncomments + fills VITE_API_BASE_URL in .env) ────
  // const base = import.meta.env.VITE_API_BASE_URL ?? '';
  // const res = await fetch(`${base}/api/v1/applications`, {
  //   method: 'POST',
  //   body: formData,          // multipart/form-data, browser sets Content-Type
  // });
  // const body = await res.json().catch(() => ({
  //   error: 'server_error',
  //   message: 'Something went wrong. Please try again.',
  // }));
  // return { status: res.status, body };
}
