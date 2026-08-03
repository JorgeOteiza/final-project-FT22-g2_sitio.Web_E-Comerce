import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import injectContext from "./store/appContext";

import Navbar from "./component/Navbar.jsx";
import Footer from "./component/footer.jsx";
import { MetodoPagoProvider } from "./component/ContextPago.jsx";
import PrivateRoute from "./component/PrivateRoute.jsx";

const Search = lazy(() => import("./pages/search").then(module => ({ default: module.Search })));
const Carrito = lazy(() => import("./pages/carrito.jsx"));
const Registro = lazy(() => import("./pages/registro.jsx"));
const PerfilUsuario = lazy(() => import("./pages/perfilUsuario.js"));
const Single = lazy(() => import("./pages/single.js"));
const Favoritos = lazy(() => import("./pages/favoritos.jsx"));
const HistorialCompra = lazy(() => import("./pages/historialCompra.jsx"));
const ResetPassword = lazy(() => import("./pages/reset_password.jsx"));
const DetallesPedido = lazy(() => import("./pages/DetallesPedido.jsx"));
const MetodoDePago = lazy(() => import("./pages/metodoDePago.jsx"));
const MetodoDePagoRevisar = lazy(() => import("./pages/metodoDePagoRevisar.jsx"));
const Direccion = lazy(() => import("./component/Direccion.jsx"));
//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = "/";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <MetodoPagoProvider>
                <BrowserRouter basename={basename}>
                    <ScrollToTop>
                        <div id="page-top" aria-hidden="true" />
                        <Navbar />
                        <Suspense fallback={<main className="container wine-loading-state" aria-live="polite">Cargando contenido…</main>}>
                        <Routes>
                            <Route element={<Home />} path="/" />
                            <Route element={
                                <PrivateRoute>
                                    <Carrito />
                                </PrivateRoute>
                            } path="/carrito" />
                            <Route element={<Single />} path="/producto/:id" />
                            <Route element={
                                <PrivateRoute>
                                    <PerfilUsuario />
                                </PrivateRoute>
                            } path="/perfil" />
                            <Route element={<Registro />} path="/registro" />
                            <Route element={<Search />} path="/busqueda" />
                            <Route element={<Search />} path="/busqueda/:tipo" />
                            <Route element={
                                <PrivateRoute>
                                    <HistorialCompra />
                                </PrivateRoute>
                            } path="/historial-compra" />
                            <Route element={
                                <PrivateRoute>
                                    <MetodoDePago />
                                </PrivateRoute>
                            } path="/metodo-de-pago" />
                            <Route element={
                                <PrivateRoute>
                                    <MetodoDePagoRevisar />
                                </PrivateRoute>
                            } path="/metodo-de-pago/:payment" />
                            <Route element={
                                <PrivateRoute>
                                    <Favoritos />
                                </PrivateRoute>
                            } path="/favoritos" />
                            <Route element={
                                <PrivateRoute>
                                    <DetallesPedido />
                                </PrivateRoute>
                            } path="/detalles-pedido" />
                            <Route element={
                                <PrivateRoute>
                                    <Direccion />
                                </PrivateRoute>
                            } path="/metodo-de-pago/direccion" />
                            <Route element={<h1>Not found!</h1>} />


                            <Route element={

                                <ResetPassword />

                            } path="/reset_password" />
                        </Routes>
                        </Suspense>
                        <Footer />
                    </ScrollToTop>
                </BrowserRouter>
            </MetodoPagoProvider>
        </div>
    );
};

export default injectContext(Layout);
