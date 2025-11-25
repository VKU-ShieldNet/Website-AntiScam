// Validation Messages
export const VALIDATION_MESSAGES = {
  URL_EMPTY: 'Vui lòng nhập URL để phân tích',
  TEXT_EMPTY: 'Vui lòng nhập văn bản để phân tích',
  FILE_EMPTY: 'Vui lòng chọn file để phân tích',
  IMAGE_ONLY: 'Hiện tại chỉ hỗ trợ phân tích file ảnh',
  OCR_EXTRACT_FAILED: 'Không thể trích xuất văn bản từ hình ảnh'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SAFE: '✅ Phân tích hoàn tất: An toàn',
  WARNING: '⚠️ Phân tích hoàn tất: Cảnh báo',
  DANGER: '🚨 Phân tích hoàn tất: Nguy hiểm'
};

// Error Messages
export const ERROR_MESSAGES = {
  CONNECTION_FAILED: '❌ Không thể kết nối đến server. Vui lòng kiểm tra server đang chạy tại localhost:8000',
  SERVER_ERROR: '❌ Lỗi server. Vui lòng thử lại sau',
  GENERIC_ERROR: '❌ Đã xảy ra lỗi. Vui lòng thử lại',
  OCR_ERROR: '❌ Lỗi khi OCR hình ảnh. Vui lòng thử lại'
};
