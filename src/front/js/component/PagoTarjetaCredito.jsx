import React, { useState } from "react";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { formatCardNumber, formatExpiry, isValidCardNumber, isValidExpiry, onlyDigits } from "./cardValidation";
import "../../styles/pagoTarjetaDeCredito.css";

const PagoTarjetaCredito = () => {
  const navigate = useNavigate();
  const [card, setCard] = useState({ number:"", name:"", expiry:"", cvc:"", focus:"" });
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
    if (!isValidCardNumber(card.number)) return Swal.fire({ icon:"error", title:"Número de tarjeta inválido", text:"Ingresa un número de 16 dígitos válido.", confirmButtonColor:"#7b2121" });
    if (card.name.trim().length < 3) return Swal.fire({ icon:"error", title:"Nombre inválido", text:"Ingresa el nombre que aparece en la tarjeta.", confirmButtonColor:"#7b2121" });
    if (!isValidExpiry(card.expiry)) return Swal.fire({ icon:"error", title:"Fecha inválida", text:"Usa el formato MM/AA y una fecha vigente.", confirmButtonColor:"#7b2121" });
    if (!/^\d{3}$/.test(card.cvc)) return Swal.fire({ icon:"error", title:"CVC inválido", text:"Ingresa los 3 dígitos de seguridad.", confirmButtonColor:"#7b2121" });
    navigate("/metodo-de-pago/direccion");
  };
  return <div className="card-payment-panel"><Cards number={onlyDigits(card.number)} name={card.name} expiry={onlyDigits(card.expiry)} cvc={card.cvc} focused={card.focus} /><form className="card-payment-form" onSubmit={submit}>
    <label>Número de tarjeta<div className="payment-input"><i className="fa-regular fa-credit-card" /><input name="number" value={card.number} onChange={update} onFocus={() => setCard(current => ({...current,focus:"number"}))} inputMode="numeric" placeholder="1234 5678 9012 3456" autoComplete="cc-number" required /></div><small className="payment-field-hint">Demo: usa 4242 4242 4242 4242. No ingreses una tarjeta real.</small></label>
    <label className="card-holder">Nombre del titular<div className="payment-input"><i className="fa-regular fa-user" /><input name="name" value={card.name} onChange={update} onFocus={() => setCard(current => ({...current,focus:"name"}))} placeholder="Nombre y apellido" autoComplete="cc-name" maxLength="40" required /></div></label>
    <label>Fecha de caducidad<div className="payment-input"><i className="fa-regular fa-calendar" /><input name="expiry" value={card.expiry} onChange={update} onFocus={() => setCard(current => ({...current,focus:"expiry"}))} inputMode="numeric" placeholder="MM/AA" autoComplete="cc-exp" maxLength="5" required /></div></label>
    <label>CVC<div className="payment-input"><i className="fa-solid fa-lock" /><input name="cvc" value={card.cvc} onChange={update} onFocus={() => setCard(current => ({...current,focus:"cvc"}))} inputMode="numeric" placeholder="123" autoComplete="cc-csc" maxLength="3" required /></div></label>
    <button className="wine-button wine-button-primary card-payment-submit" type="submit">Continuar al envío</button>
  </form></div>;
};
export default PagoTarjetaCredito;
