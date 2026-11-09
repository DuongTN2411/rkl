let comments = [
  { id: 1, postId: 1, content: 'Bài viết hay!', authorId: 1 },
  { id: 2, postId: 1, content: 'Cảm ơn tác giả', authorId: 1 },
  { id: 3, postId: 2, content: 'Mình đã hiểu middleware', authorId: 1 }
];
let nextId = 4;

const create = ({ postId, content, authorId }) => {
  const comment = { id: nextId++, postId: Number(postId), content, authorId };
  comments.push(comment);
  return comment;
};

const findByPostId = (postId) => comments.filter((c) => c.postId === Number(postId));

const deleteByPostId = (postId) => {
  const before = comments.length;
  comments = comments.filter((c) => c.postId !== Number(postId));
  return before - comments.length;
};

module.exports = { create, findByPostId, deleteByPostId };
