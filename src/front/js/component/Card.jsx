import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "/src/front/styles/index.css";
import { apiFetch } from "../services/api";

export const formatPrice = price => new Intl.NumberFormat("es-CL", {
  style: "currency", currency: "CLP", maximumFractionDigits: 0,
}).format(price || 0);

const discountPercent = product => product.precio_oferta
  ? Math.round((1 - product.precio_oferta / product.precio) * 100)
  : 0;

const isLimitedAllocation = product => product.nombre?.toLowerCase().includes("almaviva");

const resetDocumentScroll = () => {
  document.getElementById("page-top")?.scrollIntoView({ block: "start", behavior: "auto" });
  if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
  window.scrollTo(0, 0);
};

const ProductBadges = ({ product }) => (
  <div className="product-badges">
    {product.precio_oferta >= 200000 && <span className="product-badge product-badge-icon"><i className="fa-solid fa-gem" /> Vino ícono</span>}
    {product.precio_oferta && <span className="product-badge product-badge-offer">-{discountPercent(product)}%</span>}
    {product.categoria?.toLowerCase() === "premium" && product.precio_oferta < 200000 && <span className="product-badge product-badge-premium">Premium</span>}
    {product.categoria?.toLowerCase() === "gran reserva" && <span className="product-badge product-badge-reserve">Gran reserva</span>}
    {product.stock > 0 && product.stock <= 5 && !isLimitedAllocation(product) && <span className="product-badge product-badge-stock">Últimas unidades</span>}
  </div>
);

const Card = ({ productos = [] }) => (
  <>
    {productos.map(producto => (
      <div key={producto.id} className="col-12 col-sm-6 col-lg-3 d-flex">
        <article className={`wine-product-card w-100 ${producto.precio_oferta >= 200000 ? "wine-product-card-icon" : ""}`}>
          <Link className="wine-product-image-frame" to={`/producto/${producto.id}`} onClick={resetDocumentScroll} aria-label={`Ver ${producto.nombre}`}>
            <ProductBadges product={producto} />
            <img className="wine-product-image" src={producto.image} alt={producto.nombre} loading="lazy" />
          </Link>
          <div className="wine-product-body">
            <p className="wine-product-meta">{producto.marca}</p>
            <h3 title={producto.nombre}>{producto.nombre}</h3>
            <p className="wine-product-detail">{producto.cepa} · {producto.unitFormat}</p>
            <div className="wine-product-price">
              {producto.precio_oferta ? (
                <><span>{formatPrice(producto.precio)}</span><strong>{formatPrice(producto.precio_oferta)}</strong></>
              ) : <strong>{formatPrice(producto.precio)}</strong>}
            </div>
            <p className={`wine-stock ${producto.stock <= 5 && !isLimitedAllocation(producto) ? "wine-stock-low" : ""}`}>
              <i className="fa-solid fa-circle" /> {producto.stock > 0 ? `${producto.stock} unidades disponibles` : "Sin stock"}
            </p>
            <Link className="wine-card-button" to={`/producto/${producto.id}`} onClick={resetDocumentScroll}>Ver producto</Link>
          </div>
        </article>
      </div>
    ))}
  </>
);

const ProductCardSkeleton = () => (
  <div className="col-12 col-sm-6 col-lg-3">
    <div className="wine-product-card wine-skeleton-card" aria-hidden="true">
      <div className="wine-skeleton wine-skeleton-image" />
      <div className="wine-product-body">
        <div className="wine-skeleton wine-skeleton-line short" />
        <div className="wine-skeleton wine-skeleton-line" />
        <div className="wine-skeleton wine-skeleton-line medium" />
      </div>
    </div>
  </div>
);

const useProducts = endpoint => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiFetch(endpoint).then(setProductos).catch(() => setProductos([])).finally(() => setLoading(false));
  }, [endpoint]);
  return { productos, loading };
};

const CardContainer4 = () => {
  const { productos, loading } = useProducts("/productos");
  return loading ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />) : <Card productos={productos.slice(0, 4)} />;
};

const CardContainer16 = ({ tipo }) => {
  const { productos, loading } = useProducts(`/productos/tipo/${tipo}`);
  return loading ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />) : <Card productos={productos.slice(0, 16)} />;
};

const CardFilterCategoria = ({ categoria }) => {
  const { productos, loading } = useProducts(`/productos/categoria/${categoria}`);
  return loading ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />) : <Card productos={productos.slice(0, 16)} />;
};

export { Card, ProductCardSkeleton, CardContainer4, CardFilterCategoria, CardContainer16 };
