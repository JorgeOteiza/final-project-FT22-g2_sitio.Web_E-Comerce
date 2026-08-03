import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { formatPrice } from "./Card.jsx";

export const NavBarShoppingCart = () => {
  const { store } = useContext(Context);
  const cart = store.shoppingCart || [];
  const token = localStorage.getItem("token");
  if (!token) return null;
  const units = cart.reduce((total, item) => total + item.cantidad, 0);
  const subtotal = cart.reduce((total, item) => total + item.precio * item.cantidad, 0);

  return (
    <div className="dropdown">
      <button className="wine-navbar-icon wine-cart-trigger" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false" aria-label="Abrir carrito">
        <i className="fa-solid fa-bag-shopping" />{units > 0 && <span>{units}</span>}
      </button>
      <div className="dropdown-menu dropdown-menu-end wine-dropdown wine-mini-cart">
        <div className="wine-mini-cart-header"><strong>Tu carrito</strong><span>{units} {units === 1 ? "unidad" : "unidades"}</span></div>
        {cart.length ? <>
          <div className="wine-mini-cart-items">{cart.slice(0, 3).map((item, index) => <div className="wine-mini-cart-item" key={`${item.nombre}-${index}`}><img src={item.image} alt="" loading="lazy" decoding="async" /><div><strong>{item.nombre}</strong><span>{item.cantidad} × {formatPrice(item.precio)}</span></div><b>{formatPrice(item.precio * item.cantidad)}</b></div>)}</div>
          {cart.length > 3 && <p className="wine-mini-cart-more">Y {cart.length - 3} productos más</p>}
          <div className="wine-mini-cart-total"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
          <Link className="wine-button wine-button-primary" to="/carrito">Ver carrito</Link>
        </> : <div className="wine-mini-cart-empty"><i className="fa-solid fa-basket-shopping" /><strong>Tu carrito está vacío</strong><span>Agrega una botella para comenzar.</span></div>}
      </div>
    </div>
  );
};
