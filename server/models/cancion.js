let mongoose = require("mongoose");

let cancionSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  artista: { type: String, required: true },
  url_video: { type: String, required: true },
  votos: { type: Number, default: 0 },
  comentarios: [
    {
      nombre: { type: String, required: true },
      texto: { type: String, required: true },
      fecha: { type: Date, default: Date.now }
    }
  ]
});

let Cancion = mongoose.model("Cancion", cancionSchema);

module.exports = Cancion;
