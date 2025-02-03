document.addEventListener("DOMContentLoaded", function () {
    cargarHorario(); // Cargar actividades guardadas al iniciar

    // Permitir arrastrar stickers desde el panel de creación
    document.getElementById("stickers-creados").addEventListener("dragstart", function (event) {
        if (event.target.classList.contains("sticker")) {
            event.dataTransfer.setData("text/plain", event.target.outerHTML);
            event.target.classList.add("dragging");
        }
    });

    // Configurar celdas del horario como zonas de destino
    document.querySelectorAll("#horario td").forEach((cell) => {
        cell.addEventListener("dragover", (event) => event.preventDefault());

        cell.addEventListener("drop", (event) => {
            event.preventDefault();
            let stickerHTML = event.dataTransfer.getData("text/plain");

            if (!stickerHTML) return;

            let wrapper = document.createElement("div");
            wrapper.innerHTML = stickerHTML;
            let sticker = wrapper.firstElementChild;

            // Agregar botón para eliminar la actividad
            let eliminarBtn = document.createElement("button");
            eliminarBtn.innerText = "❌";
            eliminarBtn.classList.add("eliminar");
            eliminarBtn.addEventListener("click", function () {
                cell.innerHTML = ""; // Borra la celda
                eliminarActividad(cell.dataset.dia, cell.dataset.hora); // Elimina de la base de datos
            });

            sticker.appendChild(eliminarBtn);
            cell.innerHTML = "";
            cell.appendChild(sticker);

            // Eliminar el sticker del panel de creación
            let draggingSticker = document.querySelector(".dragging");
            if (draggingSticker) {
                draggingSticker.remove();
            }

            // Guardar en BD
            guardarActividad(cell.dataset.dia, cell.dataset.hora, sticker.outerHTML);
        });
    });
});

// Crear un nuevo sticker con icono y hacerlo arrastrable
function crearSticker() {
    let nombre = document.getElementById("nombre-actividad").value.trim();
    let icono = document.getElementById("icono-actividad").value;

    if (!nombre) return;

    let sticker = document.createElement("div");
    sticker.classList.add("sticker");
    sticker.setAttribute("draggable", true);
    sticker.innerHTML = `
        <img src="static/img/${icono}" alt="${nombre}">
        <p>${nombre}</p>
    `;

    sticker.addEventListener("dragstart", function () {
        sticker.classList.add("dragging");
    });

    sticker.addEventListener("dragend", function () {
        sticker.classList.remove("dragging");
    });

    document.getElementById("stickers-creados").appendChild(sticker);
}

// Guardar actividad en la base de datos
function guardarActividad(dia, hora, actividad) {
    fetch("/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dia, hora, actividad }),
    });
}

// Eliminar actividad de la base de datos
function eliminarActividad(dia, hora) {
    fetch("/eliminar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dia, hora }),
    });
}

// Cargar actividades guardadas y asegurarse de que las imágenes se carguen bien
function cargarHorario() {
    fetch("/cargar")
        .then((res) => res.json())
        .then((datos) => {
            datos.forEach(({ dia, hora, actividad }) => {
                let cell = document.querySelector(`[data-dia="${dia}"][data-hora="${hora}"]`);
                if (cell) {
                    let wrapper = document.createElement("div");
                    wrapper.innerHTML = actividad;

                    // Verificar si la actividad tiene una imagen
                    let img = wrapper.querySelector("img");
                    if (img && !img.src.includes("static/img/")) {
                        let icono = img.getAttribute("alt");
                        img.src = `static/img/${icono}`;
                    }

                    // Agregar botón para eliminar
                    let eliminarBtn = document.createElement("button");
                    eliminarBtn.innerText = "❌";
                    eliminarBtn.classList.add("eliminar");
                    eliminarBtn.addEventListener("click", function () {
                        cell.innerHTML = ""; // Borra la celda
                        eliminarActividad(dia, hora); // Elimina de la base de datos
                    });

                    wrapper.appendChild(eliminarBtn);
                    cell.innerHTML = "";
                    cell.appendChild(wrapper);
                }
            });
        });
}
