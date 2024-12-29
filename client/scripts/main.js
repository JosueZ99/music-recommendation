document.addEventListener("DOMContentLoaded", () => {
    let randomSongBtn = document.getElementById("randomSongBtn");
    let randomSongContainer = document.getElementById("randomSongContainer");
  
    randomSongBtn.addEventListener("click", async () => {
      try {
        let response = await fetch("http://localhost:3000/canciones/random");
        if (!response.ok) {
          console.error("Error al obtener canción aleatoria:", response.status);
          return;
        }
        let cancion = await response.json();
        // Mostrar la canción en la página
        randomSongContainer.innerHTML = `
          <p><strong>${cancion.nombre}</strong> - ${cancion.artista}</p>
          <a href="${cancion.url_video}" target="_blank">Ver en YouTube</a>
        `;
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    });
  });
  