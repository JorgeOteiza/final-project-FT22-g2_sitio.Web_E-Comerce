import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Context } from "../store/appContext.js";
import "../../styles/registro.css";

const Registro = () => {
  const { actions } = useContext(Context);
  const [form, setForm] = useState({ username:"", email:"", password:"", terms:false });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));
  const validPassword = form.password.length >= 8;

  const submit = async event => {
    event.preventDefault();
    if (!validPassword) return;
    setSubmitting(true);
    try {
      await actions.createUser(form.username.trim(), form.email.trim(), form.password);
      await Swal.fire({ icon:"success", title:"Cuenta creada", text:"Ahora puedes acceder con tus datos.", confirmButtonColor:"#7b2121" });
      navigate("/");
    } catch (error) {
      Swal.fire({ icon:"error", title:"No pudimos crear la cuenta", text:error.message || "Revisa tus datos e inténtalo nuevamente.", confirmButtonColor:"#7b2121" });
    } finally { setSubmitting(false); }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-heading"><span className="wine-eyebrow wine-eyebrow-dark">Únete a la selección</span><h1>Crear cuenta</h1><p>Guarda favoritos, arma tu carrito y consulta tus compras.</p></div>
        <form onSubmit={submit} className="auth-form">
          <label><span>Nombre de usuario</span><div className="auth-input"><i className="fa-regular fa-user" /><input name="username" value={form.username} onChange={update} autoComplete="username" required /></div></label>
          <label><span>Correo electrónico</span><div className="auth-input"><i className="fa-regular fa-envelope" /><input name="email" type="email" value={form.email} onChange={update} autoComplete="email" required /></div></label>
          <label><span>Contraseña</span><div className={`auth-input ${form.password && !validPassword ? "invalid" : ""}`}><i className="fa-solid fa-lock" /><input name="password" type="password" value={form.password} onChange={update} minLength="8" autoComplete="new-password" required /></div><small className={`password-hint ${validPassword ? "valid" : ""}`}><i className={`fa-solid ${validPassword ? "fa-circle-check" : "fa-circle-info"}`} /> Debe contener un mínimo de 8 caracteres.</small></label>
          <label className="auth-terms"><input name="terms" type="checkbox" checked={form.terms} onChange={update} required /><span>Acepto los términos y condiciones.</span></label>
          <button className="wine-button wine-button-primary auth-submit" disabled={!validPassword || submitting}>{submitting ? "Creando cuenta…" : "Crear mi cuenta"}</button>
        </form>
        <p className="auth-switch">¿Ya tienes una cuenta? <button data-bs-toggle="modal" data-bs-target="#modalLogin">Acceder</button></p>
      </section>
    </main>
  );
};

export default Registro;
