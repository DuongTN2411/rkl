const { TASK_STATUSES, TASK_PRIORITIES } = require('../constants');
const {
  isBlank,
  isEmail,
  isDateOnly,
  isPositiveInteger,
  isEnumValue,
} = require('../utils/validation');
const AppError = require('../utils/AppError');

const reject = (next, errors) => next(new AppError(400, 'Dữ liệu đầu vào không hợp lệ', errors));

const validateDateRange = (errors, startDate, endDate) => {
  if (startDate && endDate && startDate > endDate) {
    errors.push({
      field: 'endDate',
      message: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu',
    });
  }
};

const validateDescription = (errors, value) => {
  if (value === undefined || value === null) return;

  if (typeof value !== 'string') {
    errors.push({ field: 'description', message: 'Mô tả phải là chuỗi' });
  } else if (value.length > 5000) {
    errors.push({ field: 'description', message: 'Mô tả tối đa 5000 ký tự' });
  }
};

const validateRegister = (req, res, next) => {
  const body = req.body || {};
  const errors = [];

  if (isBlank(body.name)) {
    errors.push({ field: 'name', message: 'Họ tên là bắt buộc' });
  } else if (typeof body.name !== 'string') {
    errors.push({ field: 'name', message: 'Họ tên phải là chuỗi' });
  } else if (body.name.trim().length > 100) {
    errors.push({ field: 'name', message: 'Họ tên tối đa 100 ký tự' });
  }

  if (isBlank(body.email)) {
    errors.push({ field: 'email', message: 'Email là bắt buộc' });
  } else if (typeof body.email !== 'string' || !isEmail(body.email)) {
    errors.push({ field: 'email', message: 'Email không hợp lệ' });
  } else if (body.email.length > 150) {
    errors.push({ field: 'email', message: 'Email tối đa 150 ký tự' });
  }

  if (isBlank(body.password)) {
    errors.push({ field: 'password', message: 'Mật khẩu là bắt buộc' });
  } else if (typeof body.password !== 'string') {
    errors.push({ field: 'password', message: 'Mật khẩu phải là chuỗi' });
  } else if (body.password.length < 6) {
    errors.push({ field: 'password', message: 'Mật khẩu phải có ít nhất 6 ký tự' });
  } else if (body.password.length > 72) {
    errors.push({ field: 'password', message: 'Mật khẩu tối đa 72 ký tự' });
  }

  if (errors.length > 0) {
    return reject(next, errors);
  }
  return next();
};

const validateLogin = (req, res, next) => {
  const body = req.body || {};
  const errors = [];

  if (isBlank(body.email)) {
    errors.push({ field: 'email', message: 'Email là bắt buộc' });
  } else if (typeof body.email !== 'string' || !isEmail(body.email)) {
    errors.push({ field: 'email', message: 'Email không hợp lệ' });
  }

  if (isBlank(body.password)) {
    errors.push({ field: 'password', message: 'Mật khẩu là bắt buộc' });
  } else if (typeof body.password !== 'string') {
    errors.push({ field: 'password', message: 'Mật khẩu phải là chuỗi' });
  }

  if (errors.length > 0) {
    return reject(next, errors);
  }
  return next();
};

const validateProjectCreate = (req, res, next) => {
  const body = req.body || {};
  const errors = [];

  if (isBlank(body.name)) {
    errors.push({ field: 'name', message: 'Tên dự án là bắt buộc' });
  } else if (typeof body.name !== 'string') {
    errors.push({ field: 'name', message: 'Tên dự án phải là chuỗi' });
  } else if (body.name.trim().length > 200) {
    errors.push({ field: 'name', message: 'Tên dự án tối đa 200 ký tự' });
  }

  validateDescription(errors, body.description);

  if (body.startDate !== undefined && body.startDate !== null && !isDateOnly(body.startDate)) {
    errors.push({ field: 'startDate', message: 'Ngày bắt đầu phải có định dạng YYYY-MM-DD' });
  }

  if (body.endDate !== undefined && body.endDate !== null && !isDateOnly(body.endDate)) {
    errors.push({ field: 'endDate', message: 'Ngày kết thúc phải có định dạng YYYY-MM-DD' });
  }

  validateDateRange(errors, body.startDate, body.endDate);

  if (errors.length > 0) {
    return reject(next, errors);
  }
  return next();
};

const validateProjectUpdate = (req, res, next) => {
  const body = req.body || {};
  const errors = [];
  const allowedFields = ['name', 'description', 'startDate', 'endDate'];
  const hasField = allowedFields.some((field) =>
    Object.prototype.hasOwnProperty.call(body, field)
  );

  if (!hasField) {
    errors.push({
      field: 'body',
      message: 'Cần cung cấp ít nhất một trường để cập nhật',
    });
  }

  if (body.name !== undefined) {
    if (isBlank(body.name)) {
      errors.push({ field: 'name', message: 'Tên dự án không được để trống' });
    } else if (typeof body.name !== 'string') {
      errors.push({ field: 'name', message: 'Tên dự án phải là chuỗi' });
    } else if (body.name.trim().length > 200) {
      errors.push({ field: 'name', message: 'Tên dự án tối đa 200 ký tự' });
    }
  }

  validateDescription(errors, body.description);

  if (body.startDate !== undefined && body.startDate !== null && !isDateOnly(body.startDate)) {
    errors.push({ field: 'startDate', message: 'Ngày bắt đầu phải có định dạng YYYY-MM-DD' });
  }

  if (body.endDate !== undefined && body.endDate !== null && !isDateOnly(body.endDate)) {
    errors.push({ field: 'endDate', message: 'Ngày kết thúc phải có định dạng YYYY-MM-DD' });
  }

  const startDate = body.startDate !== undefined ? body.startDate : req.project.startDate;
  const endDate = body.endDate !== undefined ? body.endDate : req.project.endDate;
  validateDateRange(errors, startDate, endDate);

  if (errors.length > 0) {
    return reject(next, errors);
  }
  return next();
};

const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;
  const errors = [];

  if (page !== undefined && !isPositiveInteger(page)) {
    errors.push({ field: 'page', message: 'page phải là số nguyên dương' });
  }

  if (limit !== undefined) {
    if (!isPositiveInteger(limit)) {
      errors.push({ field: 'limit', message: 'limit phải là số nguyên dương' });
    } else if (Number(limit) > 100) {
      errors.push({ field: 'limit', message: 'limit tối đa là 100' });
    }
  }

  if (errors.length > 0) {
    return reject(next, errors);
  }
  return next();
};

const validateMemberCreate = (req, res, next) => {
  const body = req.body || {};

  if (!isPositiveInteger(body.userId)) {
    return reject(next, [
      { field: 'userId', message: 'userId phải là số nguyên dương' },
    ]);
  }
  return next();
};

const validateMemberParams = (req, res, next) => {
  if (!isPositiveInteger(req.params.userId)) {
    return reject(next, [
      { field: 'userId', message: 'userId phải là số nguyên dương' },
    ]);
  }
  return next();
};

const validateTaskCreate = (req, res, next) => {
  const body = req.body || {};
  const errors = [];

  if (isBlank(body.title)) {
    errors.push({ field: 'title', message: 'Tiêu đề công việc là bắt buộc' });
  } else if (typeof body.title !== 'string') {
    errors.push({ field: 'title', message: 'Tiêu đề phải là chuỗi' });
  } else if (body.title.trim().length > 200) {
    errors.push({ field: 'title', message: 'Tiêu đề tối đa 200 ký tự' });
  }

  validateDescription(errors, body.description);

  if (body.status !== undefined && !isEnumValue(body.status, TASK_STATUSES)) {
    errors.push({
      field: 'status',
      message: `status phải là một trong: ${TASK_STATUSES.join(', ')}`,
    });
  }

  if (body.priority !== undefined && !isEnumValue(body.priority, TASK_PRIORITIES)) {
    errors.push({
      field: 'priority',
      message: `priority phải là một trong: ${TASK_PRIORITIES.join(', ')}`,
    });
  }

  if (body.dueDate !== undefined && body.dueDate !== null && !isDateOnly(body.dueDate)) {
    errors.push({ field: 'dueDate', message: 'Hạn hoàn thành phải có định dạng YYYY-MM-DD' });
  }

  if (
    body.assigneeId !== undefined &&
    body.assigneeId !== null &&
    !isPositiveInteger(body.assigneeId)
  ) {
    errors.push({ field: 'assigneeId', message: 'assigneeId phải là số nguyên dương' });
  }

  if (errors.length > 0) {
    return reject(next, errors);
  }
  return next();
};

const validateTaskUpdate = (req, res, next) => {
  const body = req.body || {};
  const errors = [];
  const allowedFields = ['title', 'description', 'status', 'priority', 'dueDate', 'assigneeId'];
  const hasField = allowedFields.some((field) =>
    Object.prototype.hasOwnProperty.call(body, field)
  );

  if (!hasField) {
    errors.push({
      field: 'body',
      message: 'Cần cung cấp ít nhất một trường để cập nhật',
    });
  }

  if (body.title !== undefined) {
    if (isBlank(body.title)) {
      errors.push({ field: 'title', message: 'Tiêu đề không được để trống' });
    } else if (typeof body.title !== 'string') {
      errors.push({ field: 'title', message: 'Tiêu đề phải là chuỗi' });
    } else if (body.title.trim().length > 200) {
      errors.push({ field: 'title', message: 'Tiêu đề tối đa 200 ký tự' });
    }
  }

  validateDescription(errors, body.description);

  if (body.status !== undefined && !isEnumValue(body.status, TASK_STATUSES)) {
    errors.push({
      field: 'status',
      message: `status phải là một trong: ${TASK_STATUSES.join(', ')}`,
    });
  }

  if (body.priority !== undefined && !isEnumValue(body.priority, TASK_PRIORITIES)) {
    errors.push({
      field: 'priority',
      message: `priority phải là một trong: ${TASK_PRIORITIES.join(', ')}`,
    });
  }

  if (body.dueDate !== undefined && body.dueDate !== null && !isDateOnly(body.dueDate)) {
    errors.push({ field: 'dueDate', message: 'Hạn hoàn thành phải có định dạng YYYY-MM-DD' });
  }

  if (
    body.assigneeId !== undefined &&
    body.assigneeId !== null &&
    !isPositiveInteger(body.assigneeId)
  ) {
    errors.push({ field: 'assigneeId', message: 'assigneeId phải là số nguyên dương' });
  }

  if (errors.length > 0) {
    return reject(next, errors);
  }
  return next();
};

const validateTaskQuery = (req, res, next) => {
  const query = req.query;
  const errors = [];

  if (query.status !== undefined && !isEnumValue(query.status, TASK_STATUSES)) {
    errors.push({
      field: 'status',
      message: `status phải là một trong: ${TASK_STATUSES.join(', ')}`,
    });
  }

  if (query.priority !== undefined && !isEnumValue(query.priority, TASK_PRIORITIES)) {
    errors.push({
      field: 'priority',
      message: `priority phải là một trong: ${TASK_PRIORITIES.join(', ')}`,
    });
  }

  if (query.assigneeId !== undefined && !isPositiveInteger(query.assigneeId)) {
    errors.push({ field: 'assigneeId', message: 'assigneeId phải là số nguyên dương' });
  }

  if (query.search !== undefined) {
    if (typeof query.search !== 'string') {
      errors.push({ field: 'search', message: 'search phải là chuỗi' });
    } else if (query.search.length > 200) {
      errors.push({ field: 'search', message: 'search tối đa 200 ký tự' });
    }
  }

  if (query.sortBy !== undefined && !['createdAt', 'dueDate'].includes(query.sortBy)) {
    errors.push({ field: 'sortBy', message: 'sortBy chỉ nhận createdAt hoặc dueDate' });
  }

  if (query.order !== undefined && !['asc', 'desc'].includes(query.order)) {
    errors.push({ field: 'order', message: 'order chỉ nhận asc hoặc desc' });
  }

  if (query.page !== undefined && !isPositiveInteger(query.page)) {
    errors.push({ field: 'page', message: 'page phải là số nguyên dương' });
  }

  if (query.limit !== undefined) {
    if (!isPositiveInteger(query.limit)) {
      errors.push({ field: 'limit', message: 'limit phải là số nguyên dương' });
    } else if (Number(query.limit) > 100) {
      errors.push({ field: 'limit', message: 'limit tối đa là 100' });
    }
  }

  if (errors.length > 0) {
    return reject(next, errors);
  }
  return next();
};

const validateTaskStatus = (req, res, next) => {
  const body = req.body || {};

  if (!isEnumValue(body.status, TASK_STATUSES)) {
    return reject(next, [
      {
        field: 'status',
        message: `status phải là một trong: ${TASK_STATUSES.join(', ')}`,
      },
    ]);
  }
  return next();
};

const validateCommentCreate = (req, res, next) => {
  const body = req.body || {};

  if (isBlank(body.content)) {
    return reject(next, [
      { field: 'content', message: 'Nội dung bình luận là bắt buộc' },
    ]);
  }

  if (typeof body.content !== 'string') {
    return reject(next, [
      { field: 'content', message: 'Nội dung bình luận phải là chuỗi' },
    ]);
  }

  if (body.content.trim().length > 2000) {
    return reject(next, [
      { field: 'content', message: 'Nội dung bình luận tối đa 2000 ký tự' },
    ]);
  }

  return next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateProjectCreate,
  validateProjectUpdate,
  validatePagination,
  validateMemberCreate,
  validateMemberParams,
  validateTaskCreate,
  validateTaskUpdate,
  validateTaskQuery,
  validateTaskStatus,
  validateCommentCreate,
};
