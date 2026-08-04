import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, ProductCardSkeleton } from "./Card.jsx";
import { apiFetch } from "../services/api";
import "../../styles/filter.css";

const normalize = value => (value || "").toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const EmptyResults = ({ clear }) => (
  <div className="wine-empty-state">
    <i className="fa-solid fa-magnifying-glass" />
    <h2>No encontramos vinos con estos filtros</h2>
    <p>Prueba otra cepa, categoría o rango de precio.</p>
    <button className="wine-button wine-button-primary" onClick={clear}>Limpiar filtros</button>
  </div>
);

const Filteredproduct = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const urlType = searchParams.get("tipo") || "";
  const urlCategory = searchParams.get("categoria") || "";
  const urlOffers = searchParams.get("ofertas") === "1";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({ query: urlQuery, type: urlType, grape: "", category: urlCategory, maxPrice: "", sort: "featured", offersOnly: urlOffers });

  useEffect(() => {
    apiFetch("/productos").then(setProducts).catch(() => setProducts([])).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setFilters({ query: urlQuery, type: urlType, grape: "", category: urlCategory, maxPrice: "", sort: "featured", offersOnly: urlOffers });
  }, [urlQuery, urlType, urlCategory, urlOffers]);

  const options = key => [...new Set(products.map(product => product[key]).filter(Boolean))].sort();
  const setFilter = (key, value) => {
    setFilters(current => ({ ...current, [key]: value }));
    if (key === "query") setSearchParams(value ? { q: value } : {});
  };

  const filtered = useMemo(() => {
    const query = normalize(filters.query);
    const result = products.filter(product => {
      const searchable = normalize([product.nombre, product.marca, product.tipo, product.cepa, product.categoria].join(" "));
      const offerMatch = query === "ofertas" ? Boolean(product.precio_oferta) : searchable.includes(query);
      const price = product.precio_oferta || product.precio;
      return offerMatch
        && (!filters.offersOnly || Boolean(product.precio_oferta))
        && (!filters.type || normalize(product.tipo) === normalize(filters.type))
        && (!filters.grape || product.cepa === filters.grape)
        && (!filters.category || normalize(product.categoria) === normalize(filters.category))
        && (!filters.maxPrice || price <= Number(filters.maxPrice));
    });
    return [...result].sort((a, b) => {
      const aPrice = a.precio_oferta || a.precio;
      const bPrice = b.precio_oferta || b.precio;
      if (filters.sort === "price-asc") return aPrice - bPrice;
      if (filters.sort === "price-desc") return bPrice - aPrice;
      if (filters.sort === "discount") return Number(Boolean(b.precio_oferta)) - Number(Boolean(a.precio_oferta));
      return a.id - b.id;
    });
  }, [products, filters]);

  const clear = () => { setFilters({ query: "", type: "", grape: "", category: "", maxPrice: "", sort: "featured", offersOnly: false }); setSearchParams({}); };

  return (
    <div className="container wine-catalog-page">
      <header className="wine-catalog-header">
        <span className="wine-eyebrow wine-eyebrow-dark">Catálogo</span>
        <h1>Encuentra tu próxima botella</h1>
        <p>{loading ? "Cargando selección…" : `${filtered.length} vinos disponibles`}</p>
      </header>
      <button className="wine-mobile-filter-toggle" type="button" onClick={() => setFiltersOpen(open => !open)} aria-expanded={filtersOpen} aria-controls="catalog-filters"><span><i className="fa-solid fa-sliders" /> Filtrar y ordenar</span><i className={`fa-solid fa-chevron-${filtersOpen ? "up" : "down"}`} /></button>
      <div className={`wine-filter-panel ${filtersOpen ? "mobile-open" : ""}`} id="catalog-filters">
        <label className="wine-filter-search"><span>Buscar</span><input value={filters.query} onChange={event => setFilter("query", event.target.value)} placeholder="Nombre, viña o cepa" /></label>
        <label><span>Tipo</span><select value={filters.type} onChange={event => setFilter("type", event.target.value)}><option value="">Todos</option>{options("tipo").map(value => <option key={value}>{value}</option>)}</select></label>
        <label><span>Cepa</span><select value={filters.grape} onChange={event => setFilter("grape", event.target.value)}><option value="">Todas</option>{options("cepa").map(value => <option key={value}>{value}</option>)}</select></label>
        <label><span>Categoría</span><select value={filters.category} onChange={event => setFilter("category", event.target.value)}><option value="">Todas</option>{options("categoria").map(value => <option key={value}>{value}</option>)}</select></label>
        <label><span>Precio máximo</span><select value={filters.maxPrice} onChange={event => setFilter("maxPrice", event.target.value)}><option value="">Sin límite</option><option value="5000">$5.000</option><option value="10000">$10.000</option><option value="20000">$20.000</option><option value="300000">$300.000</option></select></label>
        <label><span>Ordenar</span><select value={filters.sort} onChange={event => setFilter("sort", event.target.value)}><option value="featured">Destacados</option><option value="price-asc">Menor precio</option><option value="price-desc">Mayor precio</option><option value="discount">Ofertas primero</option></select></label>
        <button className="wine-filter-clear" onClick={() => { clear(); setFiltersOpen(false); }}>Limpiar</button>
      </div>
      <div className="row g-4">
        {loading ? Array.from({ length: 8 }).map((_, index) => <ProductCardSkeleton key={index} />) : filtered.length ? <Card productos={filtered} /> : <EmptyResults clear={clear} />}
      </div>
    </div>
  );
};

export default Filteredproduct;
