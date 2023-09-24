export const UNAUTHORIZED = "Unauthorized";
export const NOT_FOUND_ACCOUNT = "Tài khoản không tồn tại";
export const INCORRECT_PASSWORD = "Mật khẩu không chính xác";
export const SEND_VERIFY_EMAIL = (email) =>
    `Một email xác minh đã được gửi đến ${email}. Vui lòng kiểm tra hộp thư đến (hoặc spam) và làm theo hướng dẫn.`;
export const QUERY_SUCCESS = (name) => `Truy vấn ${name || "data"} thành công`;
export const EXISTED_USER = "Tên đăng nhập đã tồn tại";
export const EXISTED_GROUP = "Tên nhóm đã được sử dụng";
export const EXISTED_EMAIL = "Email đã được sử dụng";
export const MISSING_INPUT = (input) => `${input} không được để trống`;
export const POST_SUCCESS = (action) => `${action} thành công`;
export const QUERY_NOT_FOUND = (name) => `Không tìm thấy ${name} nào`;
export const SEND_RESET_PASSWORD_EMAIL = (email) =>
    `Một email đặt lại mật khẩu đã được gửi đến ${email}. Vui lòng kiểm tra hộp thư đến (hoặc spam) và làm theo hướng dẫn.`;
export const SUCCESS_CHANGE_PASSWORD =
    "Đặt lại mật khẩu thành công. Vui lòng thực hiện lại đăng nhập.";
