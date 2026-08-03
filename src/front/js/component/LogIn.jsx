import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Context } from "../store/appContext";
import "../../styles/logIn.css";

const LogIn = () => {
  const { actions } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const submit = async event => {
    event.preventDefault(); setSubmitting(true);
    try {
      await actions.login(email.trim(), password);
      await Swal.fire({ toast:true, position:"top-end", timer:1800, showConfirmButton:false, icon:"success", title:"Sesión iniciada correctamente" });
      navigate("/"); window.location.reload();
    } catch (error) {
      setPassword("");
      Swal.fire({ icon:"error", title:"No pudimos iniciar sesión", text:"Revisa tu correo y contraseña.", confirmButtonColor:"#7b2121" });
    } finally { setSubmitting(false); }
  };
  return (
    <div className="modal fade login-modal" tabIndex="-1" id="modalLogin" aria-labelledby="loginTitle" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content login-modal-content">
          <button type="button" className="btn-close login-close" data-bs-dismiss="modal" aria-label="Cerrar" />
          <div className="login-icon"><i className="fa-solid fa-wine-glass" /></div>
          <span className="wine-eyebrow wine-eyebrow-dark">Bienvenido de vuelta</span>
          <h1 id="loginTitle">Accede a tu cuenta</h1>
          <p className="login-intro">Continúa tu selección y consulta tus vinos favoritos.</p>
          <form onSubmit={submit} className="auth-form login-form">
            <label><span>Correo electrónico</span><div className="auth-input"><i className="fa-regular fa-envelope" /><input value={email} type="email" autoComplete="email" onChange={event => setEmail(event.target.value)} required /></div></label>
            <label><span>Contraseña</span><div className="auth-input"><i className="fa-solid fa-lock" /><input value={password} type="password" autoComplete="current-password" onChange={event => setPassword(event.target.value)} required /></div></label>
            <button className="wine-button wine-button-primary auth-submit" disabled={submitting}>{submitting ? "Accediendo…" : "Acceder"}</button>
          </form>
          <button className="login-forgot" data-bs-toggle="modal" data-bs-target="#modalRestaurarContraseña" data-bs-dismiss="modal">¿Olvidaste tu contraseña?</button>
          <div className="login-divider"><span>¿Aún no tienes cuenta?</span></div>
          <Link className="login-create" to="/registro" data-bs-dismiss="modal">Crear una cuenta</Link>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
