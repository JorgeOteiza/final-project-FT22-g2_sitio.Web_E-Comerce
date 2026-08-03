import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Context } from "../store/appContext";
import { formatPrice } from "./Card.jsx";
import "../../styles/cambiarDireccion.css";

const initialAddress = {
  region: "",
  comuna: "",
  calle: "",
  numeroCasa: "",
  codigoPostal: "",
  numeroContacto: "",
};

const regions = [
  "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo",
  "Valparaíso", "Metropolitana", "O'Higgins", "Maule", "Ñuble", "Biobío",
  "La Araucanía", "Los Ríos", "Los Lagos", "Aysén", "Magallanes",
];

const Direccion = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const cart = Array.isArray(store.shoppingCart) ? store.shoppingCart : [];
  const [address, setAddress] = useState(initialAddress);
  const [submitting, setSubmitting] = useState(false);
  const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const updateField = event => setAddress(current => ({
    ...current,
    [event.target.name]: event.target.value,
  }));

  const submitCheckout = async event => {
    event.preventDefault();
    if (!cart.length) {
      navigate("/carrito", { replace: true });
      return;
    }
    if (!/^\d{7}$/.test(address.codigoPostal) || !/^\d{9}$/.test(address.numeroContacto)) {
      Swal.fire({
        icon: "error",
        title: "Revisa tus datos",
        text: "El código postal debe tener 7 dígitos y el teléfono 9 dígitos.",
        confirmButtonColor: "#7b2121",
      });
      return;
    }

    setSubmitting(true);
    try {
      const order = await actions.checkout(cart);
      navigate("/compra-exitosa", { replace: true, state: { order, address } });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "No pudimos confirmar la compra",
        text: error.message,
        confirmButtonColor: "#7b2121",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="shipping-page">
      <div className="container shipping-container">
        <div className="payment-progress" aria-label="Proceso de compra">
          <span className="complete">Carrito</span><span className="complete">Pago</span><span className="active">3. Envío y confirmación</span>
        </div>
        <header className="shipping-header">
          <span className="wine-eyebrow wine-eyebrow-dark">Último paso</span>
          <h1>Dirección de envío</h1>
          <p>Confirma dónde quieres recibir tu selección.</p>
        </header>
        <div className="shipping-layout">
          <form className="shipping-form" onSubmit={submitCheckout}>
            <label>Región<select name="region" value={address.region} onChange={updateField} required><option value="">Selecciona tu región</option>{regions.map(region => <option key={region}>{region}</option>)}</select></label>
            <label>Comuna<input name="comuna" value={address.comuna} onChange={updateField} maxLength="30" required /></label>
            <label className="shipping-wide">Dirección<input name="calle" value={address.calle} onChange={updateField} maxLength="60" required /></label>
            <label>Piso o departamento <small>(opcional)</small><input name="numeroCasa" value={address.numeroCasa} onChange={updateField} maxLength="20" /></label>
            <label>Código postal<input name="codigoPostal" inputMode="numeric" value={address.codigoPostal} onChange={updateField} maxLength="7" required /></label>
            <label>Teléfono<input name="numeroContacto" inputMode="numeric" value={address.numeroContacto} onChange={updateField} maxLength="9" required /></label>
            <button className="wine-button wine-button-primary shipping-submit" type="submit" disabled={submitting}>{submitting ? "Confirmando compra…" : `Confirmar compra por ${formatPrice(total)}`}</button>
          </form>
          <aside className="shipping-summary"><h2>Tu pedido</h2>{cart.map(item => <div key={item.id}><span>{item.cantidad} × {item.nombre}</span><strong>{formatPrice(item.precio * item.cantidad)}</strong></div>)}<div className="shipping-total"><span>Total</span><strong>{formatPrice(total)}</strong></div><p><i className="fa-solid fa-lock" /> Pago simulado. No almacenamos datos bancarios.</p></aside>
        </div>
      </div>
    </main>
  );
};

export default Direccion;
