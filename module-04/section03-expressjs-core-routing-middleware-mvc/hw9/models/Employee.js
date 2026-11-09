let employees = [
  { id: 1, name: 'Nguyễn Văn A', email: 'a@company.com', avatarUrl: null },
  { id: 2, name: 'Trần Thị B', email: 'b@company.com', avatarUrl: null }
];
let nextId = 3;

const getAll = () => employees;

const create = ({ name, email }) => {
  const employee = { id: nextId++, name, email, avatarUrl: null };
  employees.push(employee);
  return employee;
};

const findById = (id) => employees.find((e) => e.id === Number(id));

const updateAvatar = (id, avatarUrl) => {
  const employee = findById(id);
  if (!employee) return undefined;
  employee.avatarUrl = avatarUrl;
  return employee;
};

module.exports = { getAll, create, findById, updateAvatar };
