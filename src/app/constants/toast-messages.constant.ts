// Validation Messages
export const VALIDATION_MESSAGES = {
  URL_EMPTY: 'Please enter a URL to analyze',
  TEXT_EMPTY: 'Please enter text to analyze',
  FILE_EMPTY: 'Please select a file to analyze',
  IMAGE_ONLY: 'Currently only image files are supported',
  OCR_EXTRACT_FAILED: 'Unable to extract text from image'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SAFE: '✅ Analysis Complete: Safe',
  WARNING: '⚠️ Analysis Complete: Warning',
  DANGER: '🚨 Analysis Complete: Dangerous'
};

// Error Messages
export const ERROR_MESSAGES = {
  CONNECTION_FAILED: '❌ Cannot connect to server. Please check that the server is running at localhost:8000',
  SERVER_ERROR: '❌ Server error. Please try again later',
  GENERIC_ERROR: '❌ An error occurred. Please try again',
  OCR_ERROR: '❌ Error during OCR processing. Please try again'
};
