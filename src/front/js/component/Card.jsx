import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "../services/alerts";
import "/src/front/styles/index.css";
import { apiFetch } from "../services/api";
import { Context } from "../store/appContext";

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
  <div className={`product-badges ${product.precio_oferta >= 200000 ? "product-badges-icon-wine" : product.categoria?.toLowerCase() === "premium" ? "product-badges-premium-wine" : ""}`}>
    {product.precio_oferta >= 200000 && <span className="product-badge product-badge-icon"><i className="fa-solid fa-gem" /> Vino ícono</span>}
    {product.categoria?.toLowerCase() === "premium" && product.precio_oferta < 200000 && <span className="product-badge product-badge-premium">Premium</span>}
    {product.categoria?.toLowerCase() === "gran reserva" && <span className="product-badge product-badge-reserve">Gran reserva</span>}
    {product.precio_oferta && <span className="product-badge product-badge-offer">-{discountPercent(product)}%</span>}
    {product.stock > 0 && product.stock <= 5 && !isLimitedAllocation(product) && <span className="product-badge product-badge-stock">Últimas unidades</span>}
  </div>
);

const ProductCard = ({ producto }) => {
  const { store, actions } = useContext(Context);
  const favorites = Array.isArray(store.favorites) ? store.favorites : [];
  const favorite = favorites.some(item => item.id === producto.id);
  const cart = Array.isArray(store.shoppingCart) ? store.shoppingCart : [];
  const inCart = cart.some(item => item.id === producto.id);
  const effectivePrice = producto.precio_oferta || producto.precio;
  const toggleFavorite = async () => {
    if (!localStorage.getItem("token")) {
      Swal.fire({ icon:"info", title:"Accede para guardar favoritos", text:"Necesitas iniciar sesión para crear tu selección personal.", confirmButtonColor:"#7b2121" });
      return;
    }
    try { await actions.toggleFavorite(producto); }
    catch (error) { Swal.fire({ icon:"error", title:"No pudimos actualizar tus favoritos", text:error.message, confirmButtonColor:"#7b2121" }); }
  };
  const addToCart = () => {
    if (!localStorage.getItem("token")) {
      Swal.fire({ icon:"info", title:"Accede para comprar", text:"Inicia sesión para agregar productos al carrito.", confirmButtonColor:"#7b2121" });
      return;
    }
    if (inCart || !producto.stock) return;
    actions.setShoppingCart([...cart, { id:producto.id, nombre:producto.nombre, precio:effectivePrice, precio_original:producto.precio, image:producto.image, tipo:producto.tipo, unitFormat:producto.unitFormat, cantidad:1, stock:producto.stock }]);
    Swal.fire({ toast:true, position:"top-end", timer:2200, showConfirmButton:false, icon:"success", title:`${producto.nombre} agregado al carrito` });
  };
  return (
      <div key={producto.id} className="col-12 col-sm-6 col-lg-3 d-flex">
        <article className={`wine-product-card w-100 ${producto.precio_oferta >= 200000 ? "wine-product-card-icon" : ""}`}>
          <button className={`wine-card-favorite ${favorite ? "active" : ""}`} onClick={toggleFavorite} aria-label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}><i className={`${favorite ? "fa-solid" : "fa-regular"} fa-heart`} /></button>
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
            <div className="wine-card-actions"><button className="wine-card-cart" onClick={addToCart} disabled={inCart || !producto.stock}><i className="fa-solid fa-bag-shopping" /> {inCart ? "En el carrito" : "Agregar"}</button><Link className="wine-card-button" to={`/producto/${producto.id}`} onClick={resetDocumentScroll}>Ver producto</Link></div>
          </div>
        </article>
      </div>
  );
};

const Card = ({ productos = [] }) => (
  <>
    {productos.map(producto => <ProductCard producto={producto} key={producto.id} />)}
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
