const getPagination = (query, defaultLimit = 10) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || defaultLimit));

  return {
    page,
    limit,
    offset: (page - 1) * limit,
  };
};

const buildMeta = (page, limit, totalItems) => ({
  page,
  limit,
  totalItems,
  totalPages: Math.ceil(totalItems / limit),
});

module.exports = { getPagination, buildMeta };
