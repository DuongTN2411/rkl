let posts = [
  { id: 1, title: 'Giới thiệu Express', content: 'Express là web framework cho Node.js', thumbnailUrl: null },
  { id: 2, title: 'Middleware là gì?', content: 'Middleware nằm giữa request và response', thumbnailUrl: null }
];
let nextId = 3;

const getAll = () => posts;

const create = ({ title, content, thumbnailUrl }) => {
  const post = { id: nextId++, title, content, thumbnailUrl: thumbnailUrl || null };
  posts.push(post);
  return post;
};

const findById = (id) => posts.find((p) => p.id === Number(id));

const deleteById = (id) => {
  const index = posts.findIndex((p) => p.id === Number(id));
  if (index === -1) return undefined;
  const [removed] = posts.splice(index, 1);
  return removed;
};

module.exports = { getAll, create, findById, deleteById };
