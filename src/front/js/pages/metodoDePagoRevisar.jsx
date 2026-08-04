import React, { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { MetodoPagoContext } from "../component/ContextPago.jsx";
import PagoTarjetaDeCredito from "../component/PagoTarjetaCredito.jsx";
import Webpay from "../component/Webpay.jsx";
import "../../styles/metodoDePagoRevisar.css";

const MetodoDePagoRevisar = () => {
  const { metodoSeleccionado } = useContext(MetodoPagoContext);
  if (!metodoSeleccionado) return <Navigate to="/metodo-de-pago" replace />;
  const methodName = metodoSeleccionado === "credito" ? "Tarjeta de crédito" : "Tarjeta de débito";
  return <main className="payment-review-page"><div className="container payment-review-container">
    <header className="payment-review-header"><Link to="/metodo-de-pago" aria-label="Volver a métodos de pago"><i className="fa-solid fa-arrow-left" /></Link><div><span className="wine-eyebrow wine-eyebrow-dark">Pago seguro</span><h1>Confirmar compra</h1></div></header>
    <div className="proceso-de-pago-barra-pago-revisar" aria-label="Progreso de la compra"><span>Carrito</span><span className="active">Pago</span><span>Revisar</span></div>
    <section className="payment-review-content"><span className="wine-eyebrow wine-eyebrow-dark">Método seleccionado</span><h2>{methodName}</h2>{metodoSeleccionado === "credito" ? <PagoTarjetaDeCredito /> : <Webpay />}</section>
  </div></main>;
};
export default MetodoDePagoRevisar;
