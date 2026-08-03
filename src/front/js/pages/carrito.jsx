import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js";
import { formatPrice } from "../component/Card.jsx";
import "../../styles/carrito.css";

const Carrito = () => {
  const { store, actions } = useContext(Context);
  const products = store.shoppingCart || [];
  const updateQuantity = (index, delta) => {
    const updated = products.map((product, position) => position === index
      ? { ...product, cantidad: Math.max(1, Math.min(product.stock || 99, product.cantidad + delta)) }
      : product);
    actions.setShoppingCart(updated);
  };
  const remove = index => actions.setShoppingCart(products.filter((_, position) => position !== index));
  const subtotal = products.reduce((total, product) => total + product.precio * product.cantidad, 0);

  if (!products.length) return (
    <main className="container cart-page">
      <div className="wine-empty-state">
        <i className="fa-solid fa-basket-shopping" />
        <h1>Tu carrito está vacío</h1>
        <p>Encuentra una botella especial y agrégala para continuar.</p>
        <Link className="wine-button wine-button-primary" to="/busqueda?q=">Explorar el catálogo</Link>
      </div>
    </main>
  );

  return (
    <main className="container cart-page">
      <header className="wine-catalog-header"><span className="wine-eyebrow wine-eyebrow-dark">Tu compra</span><h1>Carrito</h1><p>{products.length} productos seleccionados</p></header>
      <div className="cart-layout">
        <section className="cart-items" aria-label="Productos del carrito">
          {products.map((product, index) => (
            <article className="cart-item" key={`${product.nombre}-${index}`}>
              <img src={product.image} alt={product.nombre} loading="lazy" decoding="async" />
              <div className="cart-item-info"><h2>{product.nombre}</h2><p>{product.tipo} · {product.unitFormat || "750 ml"}</p><button className="cart-remove" onClick={() => remove(index)}><i className="fa-regular fa-trash-can" /> Eliminar producto</button></div>
              <div className="cart-quantity"><button onClick={() => updateQuantity(index, -1)} aria-label="Reducir cantidad">−</button><span>{product.cantidad}</span><button onClick={() => updateQuantity(index, 1)} aria-label="Aumentar cantidad">+</button></div>
              <strong>{formatPrice(product.precio * product.cantidad)}</strong>
            </article>
          ))}
        </section>
        <aside className="cart-summary">
          <h2>Resumen de compra</h2>
          <div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
          <div><span>Despacho</span><span>Calculado en el siguiente paso</span></div>
          <div className="cart-total"><span>Total</span><strong>{formatPrice(subtotal)}</strong></div>
          <Link className="wine-button wine-button-primary" to="/metodo-de-pago">Continuar al pago</Link>
          <Link className="cart-continue" to="/busqueda?q=">Seguir comprando</Link>
        </aside>
      </div>
    </main>
  );
};

export default Carrito;
