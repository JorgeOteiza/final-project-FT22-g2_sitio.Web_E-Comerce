import React, { useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Context } from "../store/appContext.js";
import { formatPrice } from "../component/Card.jsx";
import "../../styles/ProductCard.css";

const DetailBadge = ({ children, tone = "default" }) => <span className={`single-badge single-badge-${tone}`}>{children}</span>;

const Single = () => {
  const { store, actions } = useContext(Context);
  const { id } = useParams();
  const product = store.product || {};
  const [quantity, setQuantity] = useState(1);
  const token = localStorage.getItem("token");
  const effectivePrice = product.precio_oferta || product.precio || 0;
  const inCart = store.shoppingCart?.some(item => item.id === product.id || item.nombre === product.nombre);
  const favorite = (store.favorites || []).some(item => item.id === product.id);
  const isIconWine = product.precio_oferta >= 200000;
  const isLimitedAllocation = product.nombre?.toLowerCase().includes("almaviva");
  const discount = product.precio_oferta ? Math.round((1 - product.precio_oferta / product.precio) * 100) : 0;

  useLayoutEffect(() => {
    const resetProductScroll = () => {
      document.getElementById("page-top")?.scrollIntoView({ block: "start", behavior: "auto" });
      if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
      window.scrollTo(0, 0);
    };
    resetProductScroll();
    const frame = window.requestAnimationFrame(resetProductScroll);
    const timer = window.setTimeout(resetProductScroll, 250);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [id]);

  useEffect(() => {
    actions.fetchProduct(id);
  }, [id]);
  useEffect(() => { setQuantity(1); }, [product.id]);

  const specs = useMemo(() => [
    ["Tipo", product.tipo], ["Cepa", product.cepa], ["Categoría", product.categoria], ["Formato", product.unitFormat],
  ].filter(([, value]) => value), [product]);

  const toggleFavorite = () => {
    if (!token) {
      Swal.fire({
        icon:"info", title:"Accede para guardar favoritos",
        text:"Necesitas iniciar sesión para crear tu selección personal.",
        confirmButtonText:"Entendido", confirmButtonColor:"#7b2121",
      });
      return;
    }
    const added = actions.toggleFavorite(product);
    Swal.fire({ toast:true, position:"top-end", timer:2200, showConfirmButton:false, icon:"success", title:added ? "Guardado en favoritos" : "Eliminado de favoritos" });
  };

  const addToCart = () => {
    if (inCart) return;
    actions.setShoppingCart([...(store.shoppingCart || []), {
      id:product.id, nombre:product.nombre, precio:effectivePrice, precio_original:product.precio,
      image:product.image, tipo:product.tipo, unitFormat:product.unitFormat, cantidad:quantity, stock:product.stock,
    }]);
    Swal.fire({ toast:true, position:"top-end", timer:2500, showConfirmButton:false, icon:"success", title:`${product.nombre} agregado al carrito` });
  };

  if (!product.id || String(product.id) !== String(id)) return <main className="single-page"><div className="single-loading"><div className="wine-skeleton single-loading-image" /><div><div className="wine-skeleton wine-skeleton-line" /><div className="wine-skeleton wine-skeleton-line medium" /></div></div></main>;

  return (
    <main className={`single-page ${isIconWine ? "single-page-icon" : ""}`}>
      <div className="container">
        <nav className="single-breadcrumb" aria-label="Migas de pan"><Link to="/">Inicio</Link><span>/</span><Link to="/busqueda?q=">Vinos</Link><span>/</span><span>{product.nombre}</span></nav>
        <section className="single-product-layout">
          <div className="single-product-gallery">
            <div className="single-product-image-wrap">
              <div className="single-badges">
                {isIconWine && <DetailBadge tone="icon"><i className="fa-solid fa-gem" /> Vino ícono</DetailBadge>}
                {product.precio_oferta && <DetailBadge tone="offer">-{discount}%</DetailBadge>}
              </div>
              <img src={product.image} alt={product.nombre} />
            </div>
            {isIconWine && <div className="single-icon-note"><i className="fa-solid fa-award" /><div><strong>Una etiqueta excepcional</strong><span>Selección de colección para ocasiones memorables.</span></div></div>}
          </div>
          <div className="single-product-info">
            <span className="wine-eyebrow wine-eyebrow-dark">{product.marca}</span>
            <div className="single-title-row"><h1>{product.nombre}</h1><button className={`single-favorite ${favorite ? "active" : ""} ${!token ? "requires-login" : ""}`} onClick={toggleFavorite} aria-label={token ? (favorite ? "Quitar de favoritos" : "Agregar a favoritos") : "Accede para agregar a favoritos"} title={!token ? "Inicia sesión para guardar favoritos" : ""}><i className={`${favorite ? "fa-solid" : "fa-regular"} fa-heart`} /></button></div>
            <p className="single-subtitle">{product.cepa} · {product.unitFormat}</p>
            <div className="single-price">
              {product.precio_oferta && <span>{formatPrice(product.precio)}</span>}
              <strong>{formatPrice(effectivePrice)}</strong>
              {product.precio_oferta && <small>Ahorras {formatPrice(product.precio - product.precio_oferta)}</small>}
            </div>
            <div className={`single-stock ${product.stock <= 5 && !isLimitedAllocation ? "low" : ""}`}><i className="fa-solid fa-circle" /> {product.stock > 0 && isLimitedAllocation ? `Disponibilidad limitada · ${product.stock} unidades` : product.stock > 5 ? `Disponible · ${product.stock} unidades` : product.stock > 0 ? `Últimas ${product.stock} unidades` : "Agotado"}</div>
            <div className="single-specs">{specs.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
            <div className="single-purchase">
              <div className="single-quantity"><button onClick={() => setQuantity(current => Math.max(1, current - 1))} aria-label="Reducir cantidad">−</button><span>{quantity}</span><button onClick={() => setQuantity(current => Math.min(product.stock, current + 1))} aria-label="Aumentar cantidad">+</button></div>
              {token ? <button className="wine-button wine-button-primary single-cart-button" onClick={addToCart} disabled={inCart || !product.stock}><i className="fa-solid fa-bag-shopping" /> {inCart ? "Ya está en tu carrito" : "Agregar al carrito"}</button> : <Link className="wine-button wine-button-primary single-cart-button" to="/registro">Accede para comprar</Link>}
            </div>
            <div className="single-service-notes"><span><i className="fa-solid fa-shield-halved" /> Compra protegida</span><span><i className="fa-solid fa-truck-fast" /> Despacho seguro</span></div>
          </div>
        </section>
        <section className="single-description">
          <div><span className="wine-eyebrow wine-eyebrow-dark">Notas del vino</span><h2>Descripción</h2></div>
          <p>{product.descripcion}</p>
        </section>
      </div>
    </main>
  );
};

export default Single;
