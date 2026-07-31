const configuredBackendUrl = (process.env.BACKEND_URL || "").replace(/\/$/, "");

export const API_URL = `${configuredBackendUrl}/api`;

export const apiFetch = async (path, options = {}) => {
    const headers = new Headers(options.headers || {});
    const token = window.localStorage.getItem("token");

    if (options.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_URL}${path}`, { ...options, headers });
    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        const message = data?.message || data?.error || "No se pudo completar la solicitud";
        throw new Error(message);
    }

    return data;
};
