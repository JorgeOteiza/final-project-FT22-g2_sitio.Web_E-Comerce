import React, { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Context } from "../store/appContext.js";
import { formatPrice } from "../component/Card.jsx";
import "../../styles/filter.css";
import "../../styles/carrito.css";

const Carrito = () => {
  const { store, actions } = useContext(Context);
  const location = useLocation();
  const products = store.shoppingCart || [];

  useEffect(() => {
    if (location.hash !== "#productos-carrito" || !products.length) return;

    const scrollToProducts = () => {
      document.getElementById("productos-carrito")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    };

    const animationFrame = window.requestAnimationFrame(scrollToProducts);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [location.hash, products.length]);
  const updateQuantity = (index, delta) => {
    const updated = products.map((product, position) => position === index
      ? { ...product, cantidad: Math.max(1, Math.min(product.stock || 99, product.cantidad + delta)) }
      : product);
    actions.setShoppingCart(updated);
  };
  const remove = index => actions.setShoppingCart(products.filter((_, position) => position !== index));
  const subtotal = products.reduce((total, product) => total + product.precio * product.cantidad, 0);
  const originalSubtotal = products.reduce((total, product) => total + (product.precio_original || product.precio) * product.cantidad, 0);
  const savings = Math.max(0, originalSubtotal - subtotal);
  const totalUnits = products.reduce((total, product) => total + product.cantidad, 0);

  if (!products.length) return (
    <main className="container cart-page cart-page-empty">
      <div className="wine-empty-state cart-empty-state">
        <span className="cart-empty-eyebrow">Tu selección personal</span>
        <div className="cart-empty-icon"><i className="fa-solid fa-basket-shopping" /></div>
        <h1>Tu carrito está vacío</h1>
        <p>Descubre nuestra selección de vinos chilenos y encuentra una botella especial para tu próxima ocasión.</p>
        <Link className="wine-button wine-button-primary" to="/busqueda?q=">Explorar el catálogo</Link>
        <div className="cart-empty-benefits"><span><i className="fa-solid fa-wine-bottle" /> Selección chilena</span><span><i className="fa-solid fa-shield-halved" /> Compra protegida</span><span><i className="fa-solid fa-truck-fast" /> Despacho seguro</span></div>
      </div>
    </main>
  );

  return (
    <main className="container cart-page">
      <header className="cart-header">
        <div><span className="wine-eyebrow wine-eyebrow-dark">Tu selección</span><h1>Carrito de compras</h1><p>{totalUnits} {totalUnits === 1 ? "botella seleccionada" : "botellas seleccionadas"}</p></div>
        <div className="cart-progress" aria-label="Progreso de compra"><span className="active"><i className="fa-solid fa-bag-shopping" /> Carrito</span><i className="fa-solid fa-chevron-right" /><span>Pago</span><i className="fa-solid fa-chevron-right" /><span>Confirmación</span></div>
      </header>
      <div className="cart-layout">
        <section id="productos-carrito" className="cart-items" aria-label="Productos del carrito">
          <div className="cart-items-heading"><div><h2>Tu selección</h2><span>{products.length} {products.length === 1 ? "etiqueta" : "etiquetas"}</span></div><Link to="/busqueda?q=">Añadir más vinos</Link></div>
          {products.map((product, index) => (
            <article className="cart-item" key={`${product.nombre}-${index}`}>
              <div
                className="cart-item-image"
                role="img"
                aria-label={product.nombre}
                style={{ backgroundImage: `url("${product.image}")` }}
              />
              <div className="cart-item-info"><span className="cart-item-kicker">El Rincón del Vino</span><h2>{product.nombre}</h2><div className="cart-item-tags"><span>{product.tipo}</span><span>{product.unitFormat || "750 ml"}</span></div><button className="cart-remove" onClick={() => remove(index)}><i className="fa-regular fa-trash-can" /> Eliminar</button></div>
              <div className="cart-item-actions"><span className="cart-quantity-label">Cantidad</span><div className="cart-quantity"><button onClick={() => updateQuantity(index, -1)} disabled={product.cantidad <= 1} aria-label="Reducir cantidad">−</button><span>{product.cantidad}</span><button onClick={() => updateQuantity(index, 1)} disabled={product.cantidad >= (product.stock || 99)} aria-label="Aumentar cantidad">+</button></div><small>{product.stock || 0} disponibles</small></div>
              <div className="cart-item-price"><small>{formatPrice(product.precio)} c/u</small><strong>{formatPrice(product.precio * product.cantidad)}</strong></div>
            </article>
          ))}
        </section>
        <aside className="cart-summary">
          <div className="cart-summary-heading"><span className="cart-summary-icon"><i className="fa-solid fa-receipt" /></span><div><span>Detalle de compra</span><h2>Resumen</h2></div></div>
          <div className="cart-summary-row"><span>Productos ({totalUnits})</span><strong>{formatPrice(originalSubtotal)}</strong></div>
          {savings > 0 && <div className="cart-summary-row cart-savings"><span>Descuentos</span><strong>− {formatPrice(savings)}</strong></div>}
          <div className="cart-summary-row"><span>Despacho</span><span className="cart-pending">Por calcular</span></div>
          <div className="cart-total"><span><small>Total estimado</small>Total</span><strong>{formatPrice(subtotal)}</strong></div>
          <Link className="wine-button wine-button-primary cart-checkout" to="/metodo-de-pago">Continuar al pago <i className="fa-solid fa-arrow-right" /></Link>
          <Link className="cart-continue" to="/busqueda?q="><i className="fa-solid fa-arrow-left" /> Seguir comprando</Link>
          <div className="cart-trust"><i className="fa-solid fa-shield-halved" /><div><strong>Compra protegida</strong><span>Tus datos se utilizan sólo para procesar esta compra de demostración.</span></div></div>
        </aside>
      </div>
    </main>
  );
};

export default Carrito;
