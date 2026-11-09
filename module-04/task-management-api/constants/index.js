const USER_PUBLIC_ATTRIBUTES = ['id', 'name', 'email', 'createdAt', 'updatedAt'];

const TASK_STATUSES = ['todo', 'doing', 'done'];
const TASK_PRIORITIES = ['low', 'medium', 'high'];

const TASK_SORT_FIELDS = {
  createdAt: 'createdAt',
  dueDate: 'dueDate',
};

module.exports = {
  USER_PUBLIC_ATTRIBUTES,
  TASK_STATUSES,
  TASK_PRIORITIES,
  TASK_SORT_FIELDS,
};
