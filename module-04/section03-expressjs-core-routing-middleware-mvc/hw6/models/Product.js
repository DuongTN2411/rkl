let products = [
  { id: 1, name: 'Laptop Dell XPS 15', price: 1299, quantity: 10 },
  { id: 2, name: 'Chuột Logitech MX Master 3', price: 99, quantity: 50 },
  { id: 3, name: 'Bàn phím Keychron K2', price: 89, quantity: 30 }
];
let nextId = 4;

const getAll = () => products;

const create = (data) => {
  const product = {
    id: nextId++,
    name: data.name,
    price: data.price,
    quantity: data.quantity
  };
  products.push(product);
  return product;
};

const findById = (id) => products.find((p) => p.id === Number(id));

module.exports = { getAll, create, findById };
