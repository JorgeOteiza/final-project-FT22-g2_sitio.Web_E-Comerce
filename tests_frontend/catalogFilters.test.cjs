const test = require("node:test");
const assert = require("node:assert/strict");
const {
  normalize,
  effectivePrice,
  filterAndSortProducts,
} = require("../src/front/js/component/catalogFilters.common.js");

const products = [
  { id: 1, nombre: "Montes Alpha", marca: "Montes", tipo: "tinto", cepa: "Carménère", categoria: "premium", precio: 16290, precio_oferta: 13032 },
  { id: 2, nombre: "Casas del Bosque", marca: "Casas del Bosque", tipo: "blanco", cepa: "Sauvignon Blanc", categoria: "reserva", precio: 9490, precio_oferta: 7690 },
  { id: 3, nombre: "Toro de Piedra", marca: "Requingua", tipo: "tinto", cepa: "Cabernet Sauvignon", categoria: "gran reserva", precio: 8690, precio_oferta: null },
];

const defaults = { query: "", type: "", grape: "", category: "", maxPrice: "", sort: "featured", offersOnly: false };

test("normaliza mayúsculas y acentos para búsquedas", () => {
  assert.equal(normalize("CARMÉNÈRE"), "carmenere");
});

test("busca en nombre, marca, tipo, cepa y categoría", () => {
  const result = filterAndSortProducts(products, { ...defaults, query: "carmenere" });
  assert.deepEqual(result.map(product => product.id), [1]);
});

test("combina filtros de tipo y categoría", () => {
  const result = filterAndSortProducts(products, { ...defaults, type: "TINTO", category: "Gran Reserva" });
  assert.deepEqual(result.map(product => product.id), [3]);
});

test("usa el precio de oferta para filtrar y ordenar", () => {
  assert.equal(effectivePrice(products[0]), 13032);
  const result = filterAndSortProducts(products, { ...defaults, maxPrice: "10000", sort: "price-asc" });
  assert.deepEqual(result.map(product => product.id), [2, 3]);
});

test("la búsqueda ofertas excluye productos sin descuento", () => {
  const result = filterAndSortProducts(products, { ...defaults, query: "ofertas" });
  assert.deepEqual(result.map(product => product.id), [1, 2]);
});
