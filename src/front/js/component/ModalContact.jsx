import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import contactImage from "../../img/barriles-concha-y-toro.webp";

const initialForm = { name: "", lastName: "", email: "", phone: "", message: "" };
const emailService = process.env.EMAILJS_SERVICE_ID;
const emailTemplate = process.env.EMAILJS_TEMPLATE_ID;
const emailPublicKey = process.env.EMAILJS_PUBLIC_KEY;
const emailConfigured = [emailService, emailTemplate, emailPublicKey].every(value => value && value !== "MISSING_ENV_VAR");

const ModalContact = () => {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const formRef = useRef();

  const handleInputChange = event => setFormData(current => ({ ...current, [event.target.name]: event.target.value }));
  const handleSubmit = async event => {
    event.preventDefault();
    setError("");
    if (Object.values(formData).some(value => !value.trim())) {
      setError("Completa todos los campos para poder enviar tu mensaje.");
      return;
    }
    setStatus("sending");
    try {
      if (!emailConfigured) {
        throw new Error("contact-not-configured");
      }
      await emailjs.sendForm(emailService, emailTemplate, formRef.current, emailPublicKey);
      setStatus("success");
      setFormData(initialForm);
    } catch (error) {
      setStatus("idle");
      setError(error.message === "contact-not-configured" ? "El formulario no está habilitado en esta demostración. Puedes usar el correo indicado en esta ventana." : "No pudimos enviar el mensaje. Inténtalo nuevamente en unos minutos.");
    }
  };

  return (
    <div className="modal fade wine-contact-modal" id="ModalContact" tabIndex="-1" aria-labelledby="contactTitle" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content">
          <button type="button" className="btn-close wine-modal-close" data-bs-dismiss="modal" aria-label="Cerrar" />
          <div className="wine-contact-layout">
            <aside className="wine-contact-aside" style={{ backgroundImage: `url(${contactImage})` }}>
              <div>
                <span className="wine-eyebrow">Hablemos</span>
                <h2>¿Necesitas ayuda para elegir?</h2>
                <p>Cuéntanos qué buscas y te ayudaremos a encontrar un vino para ese momento especial.</p>
              </div>
              <ul><li><i className="fa-regular fa-envelope" /> elrincondelvino14@gmail.com</li><li><i className="fa-regular fa-clock" /> Respuesta dentro de 24 horas</li></ul>
            </aside>
            <section className="wine-contact-form-wrap">
              {status === "success" ? (
                <div className="wine-contact-success"><i className="fa-regular fa-circle-check" /><span className="wine-eyebrow wine-eyebrow-dark">Mensaje enviado</span><h2>Gracias por escribirnos</h2><p>Recibimos tu consulta y responderemos lo antes posible.</p><button className="wine-button wine-button-primary" data-bs-dismiss="modal" onClick={() => setStatus("idle")}>Cerrar</button></div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit}>
                  <span className="wine-eyebrow wine-eyebrow-dark">Contacto</span>
                  <h1 id="contactTitle">Conversemos sobre vinos</h1>
                  <p className="wine-contact-intro">Completa el formulario y responderemos tu consulta.</p>
                  <div className="wine-contact-fields">
                    <label><span>Nombre</span><input name="name" value={formData.name} onChange={handleInputChange} autoComplete="given-name" /></label>
                    <label><span>Apellido</span><input name="lastName" value={formData.lastName} onChange={handleInputChange} autoComplete="family-name" /></label>
                    <label className="full"><span>Correo electrónico</span><input name="email" type="email" value={formData.email} onChange={handleInputChange} autoComplete="email" /></label>
                    <label className="full"><span>Teléfono</span><input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} autoComplete="tel" /></label>
                    <label className="full"><span>Mensaje</span><textarea name="message" rows="5" value={formData.message} onChange={handleInputChange} placeholder="¿En qué podemos ayudarte?" /></label>
                  </div>
                  {error && <p className="wine-form-error" role="alert"><i className="fa-solid fa-circle-exclamation" /> {error}</p>}
                  <button type="submit" className="wine-button wine-button-primary wine-contact-submit" disabled={status === "sending"}>{status === "sending" ? "Enviando…" : "Enviar mensaje"}</button>
                </form>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalContact;
