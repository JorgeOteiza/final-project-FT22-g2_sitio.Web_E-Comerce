import React from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { formatPrice } from "../component/Card.jsx";
import "../../styles/compraExitosa.css";

const CompraExitosa = () => {
  const { state } = useLocation();
  const order = state?.order;
  const address = state?.address;
  if (!order) return <Navigate to="/" replace />;
  const totalUnits = order.productos.reduce((sum, item) => sum + item.cantidad, 0);
  const deliveryAddress = address
    ? `${address.calle}, ${address.numeroCasa}, ${address.comuna}, Región ${address.region}`
    : "Dirección registrada durante la compra";

  return (
    <main className="order-success-page">
      <section className="order-success-card">
        <header className="order-success-header">
          <div className="order-success-icon"><i className="fa-solid fa-check" /></div>
          <div><span className="wine-eyebrow wine-eyebrow-dark">Compra confirmada</span><h1>¡Gracias por tu compra!</h1><p>Tu pedido fue registrado correctamente y ya forma parte de tu historial.</p></div>
        </header>
        <div className="order-success-number"><span>Número de orden</span><strong>{order.numero_orden}</strong><small>Guárdalo para consultar tu compra</small></div>
        <dl className="order-success-stats"><div><dt>Estado</dt><dd><i className="fa-solid fa-circle-check" /> Confirmada</dd></div><div><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div><div><dt>Botellas</dt><dd>{totalUnits}</dd></div></dl>
        <div className="order-success-details">
          <section className="order-success-products"><div className="order-success-section-title"><i className="fa-solid fa-wine-bottle" /><h2>Tu selección</h2></div>{order.productos.map(item => <div className="order-success-product" key={item.id}><span>{item.cantidad}</span><div><strong>{item.producto?.nombre || "Vino seleccionado"}</strong><small>{item.cantidad === 1 ? "1 botella" : `${item.cantidad} botellas`}</small></div><b>{formatPrice(item.subtotal)}</b></div>)}</section>
          <section className="order-success-delivery"><div className="order-success-section-title"><i className="fa-solid fa-location-dot" /><h2>Entrega</h2></div><strong>Dirección de envío</strong><p>{deliveryAddress}</p>{address?.numeroContacto && <small><i className="fa-solid fa-phone" /> {address.numeroContacto}</small>}</section>
        </div>
        <div className="order-success-actions"><Link className="wine-button wine-button-primary" to="/historial-compra">Ver historial</Link><Link className="wine-button wine-button-secondary" to="/">Volver al inicio</Link></div>
        <small className="order-success-demo"><i className="fa-solid fa-circle-info" /> Compra demostrativa: no representa un cobro real.</small>
      </section>
    </main>
  );
};

export default CompraExitosa;
