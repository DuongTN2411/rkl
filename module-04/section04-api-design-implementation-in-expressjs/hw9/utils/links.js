const linkRules = [
  () => ({ rel: 'self', build: (o) => ({ href: `/api/v2/orders/${o.id}`, method: 'GET' }) }),
  (o) => (o.status === 'pending'
    ? { rel: 'cancel', build: (x) => ({ href: `/api/v2/orders/${x.id}/cancellation`, method: 'POST' }) }
    : null),
  () => ({ rel: 'customer', build: (o) => ({ href: `/api/v2/users/${o.userId}`, method: 'GET' }) }),
];

function buildOrderLinks(order) {
  const links = {};
  linkRules.forEach((rule) => {
    const item = rule(order);
    if (item) {
      links[item.rel] = item.build(order);
    }
  });
  return links;
}

module.exports = { buildOrderLinks };
