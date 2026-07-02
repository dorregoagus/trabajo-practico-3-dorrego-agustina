
// URLS de la API y del CDN de imágenes
const URL_LISTADO = "https://thesimpsonsapi.com/api/characters";
const URL_DETALLE = "https://thesimpsonsapi.com/api/characters"; // + /id
const URL_CDN_IMAGENES = "https://cdn.thesimpsonsapi.com/500";

// Arreglo que va a guardar TODOS los personajes obtenidos en el fetch inicial.
let personajes = [];

// Referencias a elementos del HTML 
const contenedorPersonajes = document.getElementById("contenedorPersonajes");
const inputBuscar = document.getElementById("inputBuscar");
const btnBuscar = document.getElementById("btnBuscar");
const btnLimpiar = document.getElementById("btnLimpiar");
const mensajeAlerta = document.getElementById("mensajeAlerta");
const loading = document.getElementById("loading");
const modalDetalleBody = document.getElementById("modalDetalleBody");

// Bootstrap necesita un objeto "Modal" de JS para poder abrirlo por código.
const modalDetalle = new bootstrap.Modal(document.getElementById("modalDetalle"));

// funciones asíncronas (async/await) para obtener datos de la API
async function obtenerListadoPersonajes() {
    try {
        const respuesta = await fetch(URL_LISTADO);

        // Si la API responde con un error 
        if (!respuesta.ok) {
            throw new Error("Error al obtener el listado de personajes");
        }

        const datos = await respuesta.json();

        // Si la API responde con un objeto vacío o sin resultados
        if (!datos.results || datos.results.length === 0) {
            throw new Error("La API no devolvió personajes");
        }

        personajes = datos.results;
        renderizarTarjetas(personajes);
    } catch (error) {
        mostrarMensaje(
            "No se pudo cargar la lista de personajes. Intenta recargar la página.",
            "danger"
        );
        console.error(error);
    } finally {
        loading.classList.add("d-none");
    }
}

// función para obtener el detalle de un personaje por su ID
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

// renderiza las tarjetas de personajes en el contenedor del HTML
function renderizarTarjetas(listaPersonajes) {
    limpiarResultados();

    // Si no hay personajes que mostrar, se muestra un mensaje de alerta
    if (listaPersonajes.length === 0) {
        mostrarMensaje("No se encontraron personajes con ese nombre.", "warning");
        return;
    }

    // se recorre el arreglo de personajes y se crea una tarjeta para cada uno
    listaPersonajes.forEach((personaje) => {
        const urlImagen = `${URL_CDN_IMAGENES}${personaje.portrait_path}`;
        const estado = personaje.status;
        const claseBadge = estado === "Alive" ? "badge-alive" : "badge-deceased";

        // columna de Bootstrap
        const columna = document.createElement("div");
        columna.className = "col-12 col-sm-6 col-md-4 col-lg-3";

        // se arma el html de la tarjeta
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

    // respuesta del botón "ver detalle" al hacer click
    document.querySelectorAll(".btn-ver-detalle").forEach((boton) => {
        boton.addEventListener("click", (evento) => {
            const id = evento.target.getAttribute("data-id");
            obtenerDetallePersonaje(id);
        });
    });
}

// muestra el modal con el detalle del personaje
function mostrarModalDetalle(personaje) {
    const urlImagen = `${URL_CDN_IMAGENES}${personaje.portrait_path}`;
    const estado = personaje.status;
    const claseBadge = estado === "Alive" ? "badge-alive" : "badge-deceased";

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
    <p class="frase-personaje">"${frase}"</p>
  `;

    modalDetalle.show();
}

// filtra los personajes según el texto ingresado en el input
function filtrarPersonajes() {
    const textoBuscado = inputBuscar.value.trim().toLowerCase();

    if (textoBuscado === "") {
        mostrarMensaje("Escribe un nombre para buscar.", "warning");
        return;
    }

    // filtra los personajes según el texto ingresado y muestra solo los que coinciden
    const resultados = personajes.filter((personaje) =>
        personaje.name.toLowerCase().includes(textoBuscado)
    );

    renderizarTarjetas(resultados);
}

// limpia el contenedor de personajes y el mensaje de alerta
function limpiarResultados() {
    contenedorPersonajes.innerHTML = "";
    mensajeAlerta.innerHTML = "";
}

// muestra un mensaje de alerta en el HTML con el texto y tipo especificados
function mostrarMensaje(texto, tipo) {
    mensajeAlerta.innerHTML = `
    <div class="alert alert-${tipo} py-2" role="alert">
      ${texto}
    </div>`;
}

// eventos de los botones y del input
btnBuscar.addEventListener("click", filtrarPersonajes);

// Permitir buscar también apretando "Enter" en el input
inputBuscar.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        filtrarPersonajes();
    }
});

btnLimpiar.addEventListener("click", () => {
    inputBuscar.value = "";
    renderizarTarjetas(personajes); // vuelve a mostrar todos los personajes
});

obtenerListadoPersonajes();
