// URLS base de la API
const URL_LISTADO = "https://thesimpsonsapi.com/api/characters";
const URL_DETALLE = "https://thesimpsonsapi.com/api/characters";
const URL_CDN_IMAGENES = "https://cdn.thesimpsonsapi.com/500";

let personajes = [];

// referencias a los elementos del html
const contenedorPersonajes = document.getElementById("contenedorPersonajes");
const inputBuscar = document.getElementById("inputBuscar");
const btnBuscar = document.getElementById("btnBuscar");
const btnLimpiar = document.getElementById("btnLimpiar");
const mensajeAlerta = document.getElementById("mensajeAlerta");
const loading = document.getElementById("loading");
const modalDetalleBody = document.getElementById("modalDetalleBody");
// modal para bootstrap
const modalDetalle = new bootstrap.Modal(document.getElementById("modalDetalle")),
// fetch del listado de personajes
async function obtenerListadoPersonajes() {
    try {
        const respuesta = await fetch(URL_LISTADO);
        if (!respuesta.ok) {
            throw new Error("Error al obtener el listado de personajes");
        }
        const datos = await respuesta.json();
        if (!datos.results || datos.results.length === 0) {
            throw new Error("No se encontraron personajes");
        }
    }
}