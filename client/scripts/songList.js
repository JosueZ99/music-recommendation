document.addEventListener("DOMContentLoaded", async () => {
  try {
    // 1. Fetch de canciones
    let response = await fetch("http://localhost:3000/canciones");
    if (!response.ok) {
      console.error("Error al obtener canciones:", response.status);
      return;
    }

    let canciones = await response.json();
    let container = document.getElementById("songsContainer");
    container.innerHTML = "";

    // 2. Renderizar cada canción
    canciones.forEach((cancion) => {
      // Tarjeta principal (Grid de 2 columnas)
      let songItem = document.createElement("div");
      songItem.classList.add("song-item");

      // ============= PRIMERA COLUMNA =============
      // A) Ícono de lápiz
      let pencilIcon = document.createElement("img");
      pencilIcon.src = "./images/pencil.png";
      pencilIcon.alt = "Editar o Eliminar";
      pencilIcon.classList.add("pencil-icon");

      pencilIcon.addEventListener("click", () => {
        mostrarPopupOpciones(cancion);
      });

      let leftContainer = document.createElement("div");
      leftContainer.classList.add("song-left-section");
      leftContainer.appendChild(pencilIcon);

      // B) Info de la canción (nombre, artista, ícono YouTube)
      let infoDiv = document.createElement("div");
      infoDiv.classList.add("song-info");

      // Subdiv para texto
      let textDiv = document.createElement("div");
      textDiv.classList.add("song-text");

      let songName = document.createElement("h2");
      songName.textContent = cancion.nombre;

      let songArtist = document.createElement("p");
      songArtist.textContent = cancion.artista;

      textDiv.appendChild(songName);
      textDiv.appendChild(songArtist);

      // Ícono de YouTube
      let youtubeLink = document.createElement("a");
      youtubeLink.classList.add("youtube-link");
      youtubeLink.href = cancion.url_video;
      youtubeLink.target = "_blank";

      let youtubeIcon = document.createElement("img");
      youtubeIcon.src = "./images/youtube.png";
      youtubeIcon.alt = "Ver en YouTube";
      youtubeLink.appendChild(youtubeIcon);

      // Ícono de comentarios
      let commentsIcon = document.createElement("img");
      commentsIcon.src = "./images/comments.png";
      commentsIcon.alt = "Ver comentarios";
      commentsIcon.classList.add("comments-icon");

      commentsIcon.addEventListener("click", () => {
        mostrarPopupComentarios(cancion);
      });

      infoDiv.appendChild(textDiv);
      infoDiv.appendChild(youtubeLink);
      infoDiv.appendChild(commentsIcon);

      // C) Envolvemos leftContainer + infoDiv en un contenedor de primera columna
      let firstColumn = document.createElement("div");
      firstColumn.classList.add("song-first-column");

      firstColumn.appendChild(leftContainer);
      firstColumn.appendChild(infoDiv);

      // ============= SEGUNDA COLUMNA: Sección de Votos =============
      let voteSection = document.createElement("div");
      voteSection.classList.add("vote-section");

      // Botón Upvote
      let btnUpvote = document.createElement("button");
      btnUpvote.classList.add("vote-button", "upvote");
      let upvoteIcon = document.createElement("img");
      upvoteIcon.src = "./images/like.png";
      upvoteIcon.alt = "pulgar arriba";
      btnUpvote.appendChild(upvoteIcon);

      btnUpvote.addEventListener("click", async () => {
        try {
          let upResp = await fetch(
            `http://localhost:3000/canciones/${cancion._id}/upvote`,
            {
              method: "PATCH",
            }
          );
          if (upResp.ok) {
            let data = await upResp.json();
            voteCount.textContent = `Votos: ${data.cancion.votos}`;
          } else {
            console.error("Error al votar positivo");
          }
        } catch (error) {
          console.error("Error de conexión:", error);
        }
      });

      // Contador de votos
      let voteCount = document.createElement("span");
      voteCount.classList.add("vote-count");
      voteCount.textContent = `Votos: ${cancion.votos}`;

      // Botón Downvote
      let btnDownvote = document.createElement("button");
      btnDownvote.classList.add("vote-button", "downvote");
      let downvoteIcon = document.createElement("img");
      downvoteIcon.src = "./images/dislike.png";
      downvoteIcon.alt = "pulgar abajo";
      btnDownvote.appendChild(downvoteIcon);

      btnDownvote.addEventListener("click", async () => {
        try {
          let downResp = await fetch(
            `http://localhost:3000/canciones/${cancion._id}/downvote`,
            {
              method: "PATCH",
            }
          );
          if (downResp.ok) {
            let data = await downResp.json();
            voteCount.textContent = `Votos: ${data.cancion.votos}`;
          } else {
            console.error("Error al votar negativo");
          }
        } catch (error) {
          console.error("Error de conexión:", error);
        }
      });

      voteSection.appendChild(btnUpvote);
      voteSection.appendChild(voteCount);
      voteSection.appendChild(btnDownvote);

      // Agregamos ambas columnas al contenedor grid
      songItem.appendChild(firstColumn);
      songItem.appendChild(voteSection);

      // Finalmente, insertar en el contenedor principal
      container.appendChild(songItem);
    });
  } catch (error) {
    console.error("Error de conexión:", error);
  }
});

/* ==========================================================
   Popup de Opciones: Editar / Eliminar / Cancelar
   ========================================================== */
function mostrarPopupOpciones(cancion) {
  let overlay = document.getElementById("popupOverlay");
  overlay.classList.remove("hidden");

  // Inyectamos el contenido del popup
  overlay.innerHTML = `
    <div class="popup-content">
      <h3>¿Qué deseas hacer con esta canción?</h3>
      <div class="popup-options">
        <button class="popup-btn" id="editarBtn">Editar</button>
        <button class="popup-btn" id="eliminarBtn">Eliminar</button>
        <button class="popup-btn" id="cancelarBtn">Cancelar</button>
      </div>
    </div>
  `;

  // Listeners
  document.getElementById("editarBtn").addEventListener("click", () => {
    mostrarPopupEdicion(cancion);
  });
  document.getElementById("eliminarBtn").addEventListener("click", () => {
    mostrarPopupEliminar(cancion);
  });
  document.getElementById("cancelarBtn").addEventListener("click", () => {
    overlay.classList.add("hidden");
    overlay.innerHTML = ""; // Limpia
  });
}

/* ==========================================================
   Popup para Editar una canción
   ========================================================== */
function mostrarPopupEdicion(cancion) {
  let overlay = document.getElementById("popupOverlay");
  overlay.innerHTML = `
  <div class="popup-content">
    <h3>Editar Canción</h3>

    <div class="form-group">
      <label for="editNombre">Nombre</label>
      <input type="text" id="editNombre" value="${cancion.nombre}" />
    </div>

    <div class="form-group">
      <label for="editArtista">Artista</label>
      <input type="text" id="editArtista" value="${cancion.artista}" />
    </div>

    <div class="form-group">
      <label for="editURL">URL Video</label>
      <input type="text" id="editURL" value="${cancion.url_video}" />
    </div>

    <div class="popup-options">
      <button class="popup-btn" id="guardarBtn">Guardar</button>
      <button class="popup-btn" id="cancelarEditBtn">Cancelar</button>
    </div>
  </div>
`;

  // Guardar cambios
  document.getElementById("guardarBtn").addEventListener("click", async () => {
    let editNombre = document.getElementById("editNombre").value.trim();
    let editArtista = document.getElementById("editArtista").value.trim();
    let editURL = document.getElementById("editURL").value.trim();

    if (!editNombre || !editArtista || !editURL) {
      alert("Por favor completa todos los campos");
      return;
    }

    let youtubePattern =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/).+$/;
    if (!youtubePattern.test(editURL)) {
      alert("Por favor ingresa una URL válida de YouTube");
      return;
    }

    // PUT /canciones/:id
    try {
      let response = await fetch(
        `http://localhost:3000/canciones/${cancion._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: editNombre,
            artista: editArtista,
            url_video: editURL,
          }),
        }
      );

      if (response.ok) {
        alert("Canción editada correctamente");
        window.location.reload();
      } else {
        alert("Error al editar canción");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  });

  // Cancelar edición
  document.getElementById("cancelarEditBtn").addEventListener("click", () => {
    overlay.classList.add("hidden");
    overlay.innerHTML = "";
  });
}

/* ==========================================================
   Popup para Eliminar una canción
   ========================================================== */
function mostrarPopupEliminar(cancion) {
  let overlay = document.getElementById("popupOverlay");
  overlay.innerHTML = `
    <div class="popup-content">
      <h3>¿Seguro que deseas eliminar la canción?</h3>
      <p><strong>${cancion.nombre}</strong> - ${cancion.artista}</p>
      <div class="popup-options">
        <button class="popup-btn" id="confirmDeleteBtn">Eliminar</button>
        <button class="popup-btn" id="cancelDeleteBtn">Cancelar</button>
      </div>
    </div>
  `;

  // Confirmar eliminación
  document
    .getElementById("confirmDeleteBtn")
    .addEventListener("click", async () => {
      try {
        let response = await fetch(
          `http://localhost:3000/canciones/${cancion._id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          alert("Canción eliminada correctamente");
          window.location.reload();
        } else {
          alert("Error al eliminar la canción");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    });

  // Cancelar eliminación
  document.getElementById("cancelDeleteBtn").addEventListener("click", () => {
    overlay.classList.add("hidden");
    overlay.innerHTML = "";
  });
}

async function mostrarPopupComentarios(cancion) {
  let overlay = document.getElementById("popupOverlay");
  overlay.classList.remove("hidden");

  try {
    // Obtener la lista de comentarios
    let response = await fetch(
      `http://localhost:3000/canciones/${cancion._id}/comentarios`
    );
    if (!response.ok) {
      console.error("Error al obtener comentarios:", response.status);
      return;
    }
    let comentarios = await response.json(); // Array de comentarios

    // Generar HTML para la lista
    let comentariosHTML = comentarios
      .map((com) => {
        // Fecha en formato local
        let fecha = new Date(com.fecha).toLocaleString();
        return `
        <div class="comentario-item">
          <strong>${com.nombre}</strong> <small>(${fecha})</small>
          <p>${com.texto}</p>
        </div>
      `;
      })
      .join("");

    overlay.innerHTML = `
      <div class="popup-content">
        <h3>Comentarios de: ${cancion.nombre}</h3>

        <div class="comments-list">
          ${
            comentarios.length > 0
              ? comentariosHTML
              : "<p>No hay comentarios aún.</p>"
          }
        </div>

        <!-- Botón para mostrar el form de añadir comentario -->
        <div class="popup-options">
          <button class="popup-btn" id="addCommentBtn">Añadir comentario</button>
          <button class="popup-btn" id="closeCommentsBtn">Cerrar</button>
        </div>
      </div>
    `;

    document.getElementById("addCommentBtn").addEventListener("click", () => {
      mostrarFormComentario(cancion);
    });

    document
      .getElementById("closeCommentsBtn")
      .addEventListener("click", () => {
        overlay.classList.add("hidden");
        overlay.innerHTML = "";
      });
  } catch (error) {
    console.error("Error de conexión:", error);
  }
}

function mostrarFormComentario(cancion) {
  let overlay = document.getElementById("popupOverlay");
  // Reemplaza la parte interior sin cerrar el popup
  overlay.innerHTML = `
    <div class="popup-content">
      <h3>Añadir Comentario a "${cancion.nombre}"</h3>
      <div class="form-group">
        <label for="comentName">Tu nombre</label>
        <input type="text" id="comentName" />
      </div>
      <div class="form-group">
        <label for="comentText">Comentario</label>
        <textarea id="comentText" rows="4"></textarea>
      </div>
      <div class="popup-options">
        <button class="popup-btn" id="saveCommentBtn">Guardar</button>
        <button class="popup-btn" id="cancelCommentBtn">Cancelar</button>
      </div>
    </div>
  `;

  document
    .getElementById("saveCommentBtn")
    .addEventListener("click", async () => {
      let nombre = document.getElementById("comentName").value.trim();
      let texto = document.getElementById("comentText").value.trim();
      if (!nombre || !texto) {
        alert("Por favor llena tu nombre y el comentario");
        return;
      }

      try {
        let response = await fetch(
          `http://localhost:3000/canciones/${cancion._id}/comentarios`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, texto }),
          }
        );
        if (response.ok) {
          // Se agregó el comentario
          alert("Comentario agregado");
          // Volver a mostrar la lista de comentarios
          mostrarPopupComentarios(cancion);
        } else {
          alert("Error al agregar comentario");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    });

  document.getElementById("cancelCommentBtn").addEventListener("click", () => {
    // Volvemos a la lista de comentarios
    mostrarPopupComentarios(cancion);
  });
}
