import { apiFetch } from "../services/api";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			tipo: "",
			categoria: "",
			user: null,
			token: localStorage.getItem("token"),
			product: {},
			shoppingCart: JSON.parse(window.localStorage.getItem("shoppingCart")) || [],
			favorites: JSON.parse(window.localStorage.getItem("favorites")) || [],

			//productos
			search: "",
			productos: [],
			productosFiltrados: []
		},
		actions: {
			// Use getActions to call a function within a fuction
			createUser: async (username, email, password) => {
				const opts = {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						"username": username,
						"email": email,
						"password": password,
						"active": true
					})
				};
				try {
					return await apiFetch("/users", opts);
				} catch (error) {
					throw error;
				}
			},

			login: async (email, password) => {
				const opts = {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						"email": email,
						"password": password,
					}),
				};
				const data = await apiFetch("/login", opts);

				localStorage.setItem("token", data.token);
				localStorage.setItem("user_id", data.user_id);

				return true;
			},
			processPayment: async (_user_id, product_id) => {
				try {
				  await apiFetch("/historial-compra", {
					method: 'POST',
					body: JSON.stringify({ producto_id: product_id }),
				  });
				} catch (error) {
				  console.error('Error procesando pago', error);
				}
			  },
			//fetch de productos para la busqueda
			getProduct: () => {

				apiFetch("/productos")
					.then(data => {
						setStore({ productos: data });

					})
					.catch(error => console.log("error desde getProduct", error))
			},

			handleSearch: (e) => {
				setStore({ search: e.target.value })

			},
			setShoppingCart: (shoppingCart) => {
				window.localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart))
				setStore({
					...getStore(),
					shoppingCart
				})
			},
			toggleFavorite: (product) => {
				const favorites = getStore().favorites || [];
				const exists = favorites.some(item => item.id === product.id);
				const updated = exists ? favorites.filter(item => item.id !== product.id) : [...favorites, product];
				window.localStorage.setItem("favorites", JSON.stringify(updated));
				setStore({ favorites: updated });
				return !exists;
			},
			clearShoppingCart: () => {
				window.localStorage.setItem("shoppingCart", JSON.stringify([]));
				setStore({ shoppingCart: [] });
			},
			updateShoppingCart: (nombre, newCantidad) => {
				const updatedShoppingCart = getStore().shoppingCart.map(item =>
					item.nombre === nombre ? { ...item, cantidad: newCantidad } : item
				);

				getActions().setShoppingCart(updatedShoppingCart);
			},
			fetchProduct: async (id) => {
				const product = await apiFetch(`/productos/${id}`)
				setStore({
					...getStore(),
					product
				})
			},

			productosFiltrados: () => {
				let store = getStore();
				let productos = getStore()?.productos?.filter((producto) =>
					producto?.nombre?.toLowerCase().includes(store?.search?.toLocaleLowerCase()) ||
					producto?.tipo?.toLowerCase().includes(store?.search?.toLowerCase())
				)
				setStore({ productosFiltrados: productos })
				console.log("estos son los productos filtrados", getStore().productosFiltrados)
			},
			setTipo: (tipo) => setStore({ tipo }),
			setCategoria: (category) => setStore({ categoria: category }),

			//fetch para restaurar contraseña

			restaurar_contraseña: async (email) => {
				try {
					const response = await fetch(`https://didactic-happiness-7qx694qjp792xjqj-3001.app.github.dev/api/reset_password`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ email: email }),
					});

					if (response.ok) {
						const data = await response.json();
						const token = data.token;
						const resetUrl = `https://didactic-happiness-7qx694qjp792xjqj-3001.app.github.dev/reset_password/${token}`; // URL con el token

					}
					else {
						throw new Error('Error al obtener el token');
					}
				}catch(error) {
						console.error(error);
					}

				}
		


		}
		}
	};



	export default getState;
