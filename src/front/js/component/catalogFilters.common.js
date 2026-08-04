const normalize = value => (value || "")
  .toLocaleLowerCase("es")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "");

const effectivePrice = product => product.precio_oferta || product.precio || 0;

const filterAndSortProducts = (products, filters) => {
  const query = normalize(filters.query);
  const result = products.filter(product => {
    const searchable = normalize([
      product.nombre,
      product.marca,
      product.tipo,
      product.cepa,
      product.categoria,
    ].join(" "));
    const offerMatch = query === "ofertas" ? Boolean(product.precio_oferta) : searchable.includes(query);

    return offerMatch
      && (!filters.offersOnly || Boolean(product.precio_oferta))
      && (!filters.type || normalize(product.tipo) === normalize(filters.type))
      && (!filters.grape || product.cepa === filters.grape)
      && (!filters.category || normalize(product.categoria) === normalize(filters.category))
      && (!filters.maxPrice || effectivePrice(product) <= Number(filters.maxPrice));
  });

  return [...result].sort((first, second) => {
    if (filters.sort === "price-asc") return effectivePrice(first) - effectivePrice(second);
    if (filters.sort === "price-desc") return effectivePrice(second) - effectivePrice(first);
    if (filters.sort === "discount") return Number(Boolean(second.precio_oferta)) - Number(Boolean(first.precio_oferta));
    return first.id - second.id;
  });
};

module.exports = { normalize, effectivePrice, filterAndSortProducts };
