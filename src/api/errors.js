/**
 * Custom ApiError class and error normalization utility.
 * Maps backend error shape:
 * {
 *   "error": {
 *     "code": "ERROR_CODE",
 *     "message": "Human readable message",
 *     "field_errors": { "field": ["detail"] }
 *   }
 * }
 */

export class ApiError extends Error {
  constructor({
    message = 'An unexpected error occurred.',
    code = 'UNKNOWN_ERROR',
    status = 500,
    fieldErrors = {},
    nextStep = null,
    rejectionReason = null,
    raw = null,
  }) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.fieldErrors = fieldErrors || {};
    this.nextStep = nextStep;
    this.rejectionReason = rejectionReason;
    this.raw = raw;
  }

  /**
   * Helper to get the first error message for a specific field.
   */
  getFieldError(fieldName) {
    const errors = this.fieldErrors[fieldName];
    if (Array.isArray(errors) && errors.length > 0) {
      return errors[0];
    }
    if (typeof errors === 'string') {
      return errors;
    }
    return null;
  }
}

/**
 * Normalizes any error (Axios error, network error, or unexpected exception)
 * into a typed ApiError instance.
 */
export function normalizeError(err) {
  if (err instanceof ApiError) {
    return err;
  }

  if (err && err.response) {
    const status = err.response.status;
    const data = err.response.data;

    // Handle LMS standard envelope: { code, detail, next_step, errors, rejection_reason }
    if (data && (data.code || data.detail || data.errors)) {
      return new ApiError({
        message: data.detail || (data.error && data.error.message) || 'An error occurred.',
        code: data.code || (data.error && data.error.code) || 'API_ERROR',
        status,
        fieldErrors: data.errors || (data.error && data.error.field_errors) || {},
        nextStep: data.next_step,
        rejectionReason: data.rejection_reason,
        raw: data,
      });
    }

    // Handle standard LMS backend format: { error: { code, message, field_errors } }
    if (data && data.error) {
      return new ApiError({
        message: data.error.message || 'An error occurred.',
        code: data.error.code || 'API_ERROR',
        status,
        fieldErrors: data.error.field_errors || {},
        raw: data,
      });
    }

    // Handle DRF throttled response or standard string/dict detail
    if (data && (data.detail || typeof data === 'string')) {
      const message = typeof data === 'string' ? data : data.detail;
      return new ApiError({
        message,
        code: status === 429 ? 'THROTTLED' : 'API_ERROR',
        status,
        raw: data,
      });
    }

    return new ApiError({
      message: `Request failed with status ${status}.`,
      code: `HTTP_${status}`,
      status,
      raw: data,
    });
  }

  if (err && err.request) {
    return new ApiError({
      message: 'Unable to connect to the server. Please check your network connection.',
      code: 'NETWORK_ERROR',
      status: 0,
      raw: err,
    });
  }

  return new ApiError({
    message: err?.message || 'An unexpected error occurred.',
    code: 'CLIENT_ERROR',
    status: 0,
    raw: err,
  });
}
