document.addEventListener("DOMContentLoaded", () => {
  let button = document.getElementById("save");

  button.addEventListener("click", async () => {
    let nombre = document.getElementById("nombre").value;
    let artista = document.getElementById("artista").value;
    let url = document.getElementById("url").value;

    // Validaciones
    if (!nombre.trim() || !artista.trim() || !url.trim()) {
      alert("Por favor completa todos los campos");
      return;
    }

    let youtubePattern =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/).+$/;

    if (!youtubePattern.test(url)) {
      alert("Por favor ingresa una URL válida de YouTube");
      return;
    }

    let body = JSON.stringify({
      nombre,
      artista,
      url_video: url,
    });

    try {
      let response = await fetch("http://localhost:3000/canciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
      });

      if (response.status === 201) {
        alert("¡Canción guardada con éxito!");
        // Limpiar inputs
        document.getElementById("nombre").value = "";
        document.getElementById("artista").value = "";
        document.getElementById("url").value = "";
      } else {
        alert("Error al guardar la canción");
      }
    } catch (error) {
      console.error(error);
    }
  });
});
