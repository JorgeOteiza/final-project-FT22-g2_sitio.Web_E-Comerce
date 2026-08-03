import React from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { formatPrice } from "../component/Card.jsx";
import "../../styles/compraExitosa.css";

const CompraExitosa = () => {
  const { state } = useLocation();
  const order = state?.order;
  if (!order) return <Navigate to="/" replace />;

  return (
    <main className="order-success-page">
      <section className="order-success-card">
        <div className="order-success-icon"><i className="fa-solid fa-check" /></div>
        <span className="wine-eyebrow wine-eyebrow-dark">Compra confirmada</span>
        <h1>¡Gracias por tu compra!</h1>
        <p>Tu pedido fue registrado correctamente y ya forma parte de tu historial.</p>
        <div className="order-success-number"><span>Número de orden</span><strong>{order.numero_orden}</strong></div>
        <dl><div><dt>Estado</dt><dd>Confirmada</dd></div><div><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div><div><dt>Productos</dt><dd>{order.productos.reduce((sum, item) => sum + item.cantidad, 0)}</dd></div></dl>
        <div className="order-success-actions"><Link className="wine-button wine-button-primary" to="/historial-compra">Ver historial</Link><Link className="wine-button wine-button-secondary" to="/">Volver al inicio</Link></div>
        <small>Esta es una compra demostrativa y no representa un cobro real.</small>
      </section>
    </main>
  );
};

export default CompraExitosa;
