import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "../services/alerts";
import webpayLogo from "../../img/webpayLogo.png";
const { formatCardNumber, formatExpiry, isValidCardNumber, isValidExpiry, onlyDigits } = require("./cardValidation.common.cjs");
import "../../styles/pagoTarjetaDeCredito.css";

const Webpay = () => {
  const navigate = useNavigate();
  const [card, setCard] = useState({ bank:"", number:"", name:"", expiry:"", cvc:"" });
  const update = event => {
    const { name } = event.target;
    let value = event.target.value;
    if (name === "number") value = formatCardNumber(value);
    if (name === "expiry") value = formatExpiry(value);
    if (name === "cvc") value = onlyDigits(value).slice(0, 3);
    setCard(current => ({ ...current, [name]:value }));
  };
  const submit = event => {
    event.preventDefault();
    if (!card.bank) return Swal.fire({ icon:"error", title:"Selecciona tu banco", confirmButtonColor:"#7b2121" });
    if (!isValidCardNumber(card.number)) return Swal.fire({ icon:"error", title:"Número de tarjeta inválido", text:"Ingresa un número de 16 dígitos válido.", confirmButtonColor:"#7b2121" });
    if (card.name.trim().length < 3) return Swal.fire({ icon:"error", title:"Nombre inválido", confirmButtonColor:"#7b2121" });
    if (!isValidExpiry(card.expiry)) return Swal.fire({ icon:"error", title:"Fecha inválida", text:"Usa el formato MM/AA y una fecha vigente.", confirmButtonColor:"#7b2121" });
    if (!/^\d{3}$/.test(card.cvc)) return Swal.fire({ icon:"error", title:"CVC inválido", confirmButtonColor:"#7b2121" });
    navigate("/metodo-de-pago/direccion");
  };
  return <div className="card-payment-panel debit-panel"><img src={webpayLogo} alt="Webpay" className="card-payment-logo" /><form className="card-payment-form" onSubmit={submit}>
    <label className="card-holder">Banco<div className="payment-input"><i className="fa-solid fa-building-columns" /><select name="bank" value={card.bank} onChange={update} required><option value="">Selecciona tu banco</option><option>Banco de Chile</option><option>Banco Falabella</option><option>Banco BCI</option><option>Banco Itaú</option><option>Banco Ripley</option><option>Banco Estado</option></select></div></label>
    <label>Número de tarjeta<div className="payment-input"><i className="fa-regular fa-credit-card" /><input name="number" value={card.number} onChange={update} inputMode="numeric" placeholder="1234 5678 9012 3456" maxLength="19" required /></div><small className="payment-field-hint">Demo: usa 4242 4242 4242 4242. No ingreses una tarjeta real.</small></label>
    <label>Nombre del titular<div className="payment-input"><i className="fa-regular fa-user" /><input name="name" value={card.name} onChange={update} placeholder="Nombre y apellido" maxLength="40" required /></div></label>
    <label>Fecha de caducidad<div className="payment-input"><i className="fa-regular fa-calendar" /><input name="expiry" value={card.expiry} onChange={update} inputMode="numeric" placeholder="MM/AA" maxLength="5" required /></div></label>
    <label>CVC<div className="payment-input"><i className="fa-solid fa-lock" /><input name="cvc" value={card.cvc} onChange={update} inputMode="numeric" placeholder="123" maxLength="3" required /></div></label>
    <button className="wine-button wine-button-primary card-payment-submit" type="submit">Continuar al envío</button>
  </form></div>;
};
export default Webpay;
