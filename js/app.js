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
            personajes = datos.results;
            renderizarTarjetas(personajes);
        } catch (error) {
            mostrarMensaje(
                "No se pudo cargar la lista de personajes. Intenta recargar la p'agina.",
                "danger"
            );
            console.error(error);
        } finally {
            loading.classList.add("d-none");
        }
    }
// fetch del detalle de un personaje
async function obtenerDetallePersonaje(id) {
    try {
        const respuesta = await fetch(`${URL_DETALLE}/${id}`);

        if (!respuesta.ok) {
            throw new Error("Error al obtener el detalle del personaje");
        }

        const personaje = await respuesta.json();

        if (!personaje || Object.keys(personaje).length === 0) {
            throw new Error("La API no devolvió información del personaje");
        }

        mostrarModalDetalle(personaje);
    } catch (error) {
        mostrarMensaje(
            "No se pudo cargar el detalle de este personaje.",
            "danger"
        );
        console.error(error);
    }
}
function renderizarTarjetas(listaPersonajes) {
    limpiarResultados(); // se limpia lo que había antes

    // Si no hay resultados, se muestra un mensaje
    if (listaPersonajes.length === 0) {
        mostrarMensaje("No se encontraron personajes con ese nombre.", "warning");
        return;
    }

    // se recorre el arreglo de personajes y por cada uno se arma una tarjeta
    listaPersonajes.forEach((personaje) => {
        const urlImagen = `${URL_CDN_IMAGENES}${personaje.portrait_path}`;
        const estado = personaje.status; // "Alive" o "Deceased"
        const claseBadge = estado === "Alive" ? "badge-alive" : "badge-deceased";

        // Creamos la columna de Bootstrap
        const columna = document.createElement("div");
        columna.className = "col-12 col-sm-6 col-md-4 col-lg-3";
        // backticks para armar el html de la tarjeta
        columna.innerHTML = `
      <div class="card tarjeta-personaje">
        <img src="${urlImagen}" alt="${personaje.name}" onerror="this.src='https://placehold.co/400x300?text=Sin+imagen'">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${personaje.name}</h5>
          <p class="card-text mb-1"><strong>Ocupación:</strong> ${personaje.occupation || "Desconocida"}</p>
          <span class="badge ${claseBadge} mb-3">${estado}</span>
          <button
            class="btn btn-primary mt-auto btn-ver-detalle"
            data-id="${personaje.id}"
          >
            Ver detalle
          </button>
        </div>
      </div>
    `;

        contenedorPersonajes.appendChild(columna);
    });
    // Respuesta del botón ver detalle al hacer click
    document.querySelectorAll(".btn-ver-detalle").forEach((boton) => {
        boton.addEventListener("click", (evento) => {
            const id = evento.target.getAttribute("data-id");
            obtenerDetallePersonaje(id);
        });
    });
}
// se muestra modal de detalle del personaje
function mostrarModalDetalle(personaje) {
    const urlImagen = `${URL_CDN_IMAGENES}${personaje.portrait_path}`;
    const estado = personaje.status;
    const claseBadge = estado === "Alive" ? "badge-alive" : "badge-deceased";

    // se obtiene una frase del personaje si tiene, sino se muestra un mensaje por defecto
    const frase =
        personaje.phrases && personaje.phrases.length > 0
            ? personaje.phrases[0]
            : "Este personaje no tiene frases registradas.";

    modalDetalleBody.innerHTML = `
    <img src="${urlImagen}" alt="${personaje.name}" onerror="this.src='https://placehold.co/400x300?text=Sin+imagen'">
    <h4>${personaje.name}</h4>
    <p><strong>Edad:</strong> ${personaje.age ?? "Desconocida"}</p>
    <p><strong>Fecha de nacimiento:</strong> ${personaje.birthdate ?? "Desconocida"}</p>
    <p><strong>Género:</strong> ${personaje.gender ?? "Desconocido"}</p>
    <p><strong>Ocupación:</strong> ${personaje.occupation ?? "Desconocida"}</p>
    <span class="badge ${claseBadge} mb-2">${estado}</span>
    <p class="frase-personaje">"${frase}"</p>`;

    modalDetalle.show();
}
