import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "../services/alerts";
import { MetodoPagoContext } from "../component/ContextPago.jsx";
import { Context } from "../store/appContext.js";
import { formatPrice } from "../component/Card.jsx";
import mastercardLogo from "../../img/mastercardLogo.png";
import visaLogo from "../../img/visaLogo.png";
import webpayLogo from "../../img/webpayLogo.png";
import "../../styles/metodoDePago.css";

const MetodoDePago = () => {
  const { store } = useContext(Context);
  const { seleccionarMetodo, metodoSeleccionado } = useContext(MetodoPagoContext);
  const navigate = useNavigate();
  const cart = store.shoppingCart || [];
  const total = cart.reduce((sum, product) => sum + product.precio * product.cantidad, 0);
  const units = cart.reduce((sum, product) => sum + product.cantidad, 0);
  const methods = [
    { id:"credito", title:"Tarjeta de crédito", description:"Visa o Mastercard", logos:[mastercardLogo, visaLogo] },
    { id:"debito", title:"Tarjeta de débito", description:"Pago seguro mediante Webpay", logos:[webpayLogo] },
  ];
  const continuePayment = () => {
    if (!metodoSeleccionado) {
      Swal.fire({ icon:"info", title:"Selecciona un método de pago", text:"Elige una de las opciones para poder continuar.", confirmButtonColor:"#7b2121" });
      return;
    }
    navigate(`/metodo-de-pago/${metodoSeleccionado}`);
  };

  return (
    <main className="payment-page">
      <div className="container payment-container">
        <Link className="payment-back" to="/carrito"><i className="fa-solid fa-arrow-left" /> Volver al carrito</Link>
        <div className="payment-progress" aria-label="Proceso de compra"><span className="complete"><i className="fa-solid fa-check" /> Carrito</span><span className="active">2. Pago</span><span>3. Revisar</span></div>
        <header className="payment-header"><span className="wine-eyebrow wine-eyebrow-dark">Compra segura</span><h1>Elige cómo pagar</h1><p>Selecciona la fila completa del método que prefieras.</p></header>
        <div className="payment-layout">
          <section className="payment-methods" aria-label="Métodos de pago">
            {methods.map(method => (
              <label className={`payment-method ${metodoSeleccionado === method.id ? "selected" : ""}`} key={method.id}>
                <input type="radio" name="payment" value={method.id} checked={metodoSeleccionado === method.id} onChange={() => seleccionarMetodo(method.id)} />
                <span className="payment-radio"><i className="fa-solid fa-check" /></span>
                <span className="payment-method-copy"><strong>{method.title}</strong><small>{method.description}</small></span>
                <span className="payment-logos">{method.logos.map((logo, index) => <img src={logo} alt="" key={index} />)}</span>
              </label>
            ))}
            <div className="payment-security"><i className="fa-solid fa-lock" /><div><strong>Tus datos están protegidos</strong><span>Esta demostración no almacena información bancaria real.</span></div></div>
          </section>
          <aside className="payment-summary">
            <h2>Resumen</h2><div><span>Productos ({units})</span><strong>{formatPrice(total)}</strong></div><div><span>Despacho</span><strong>Gratis</strong></div><div className="payment-total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
            <button className="wine-button wine-button-primary" onClick={continuePayment}>Continuar <i className="fa-solid fa-arrow-right" /></button>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default MetodoDePago;
