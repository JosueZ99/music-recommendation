let Cancion = require("../models/cancion");

exports.listarCanciones = async (req, res) => {
  try {
    const canciones = await Cancion.find().sort({ votos: -1 });
    res.status(200).json(canciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener canciones" });
  }
};

exports.agregarCancion = async (req, res) => {
  console.log("REQUEST RECIBIDA " + req.body);
  const { nombre, artista, url_video } = req.body;
  const cancion = new Cancion({ nombre, artista, url_video });
  try {
    await cancion.save();
    console.log("CANCION GUARDADA " + cancion);

    res.status(201).json(cancion);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error al guardar cancion" });
  }
};

exports.upvote = async (req, res) => {
  try {
    let cancion = await Cancion.findById(req.params.id);
    if (!cancion) {
      return res.status(404).json({ message: "Canción no encontrada" });
    }

    cancion.votos += 1;
    await cancion.save();

    res.status(200).json({
      message: "Voto positivo registrado",
      cancion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al votar" });
  }
};

exports.downvote = async (req, res) => {
  try {
    let cancion = await Cancion.findById(req.params.id);
    if (!cancion) {
      return res.status(404).json({ message: "Canción no encontrada" });
    }

    cancion.votos -= 1;
    await cancion.save();

    res.status(200).json({
      message: "Voto negativo registrado",
      cancion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al votar" });
  }
};

exports.randomSong = async (req, res) => {
  try {
    // Contar cuántas canciones hay
    const count = await Cancion.countDocuments();
    if (count === 0) {
      return res.status(404).json({ message: "No hay canciones en la base de datos" });
    }
    
    // Escoger un índice aleatorio
    const randomIndex = Math.floor(Math.random() * count);
    
    // Buscar una sola canción en ese índice
    const randomCancion = await Cancion.findOne().skip(randomIndex);
    
    return res.status(200).json(randomCancion);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener canción aleatoria" });
  }
};

exports.editarCancion = async (req, res) => {
  try {
    let cancion = await Cancion.findById(req.params.id);
    if (!cancion) {
      return res.status(404).json({ message: 'Canción no encontrada' });
    }

    // Actualizar campos si vienen en la request
    const { nombre, artista, url_video } = req.body;
    if (nombre) cancion.nombre = nombre;
    if (artista) cancion.artista = artista;
    if (url_video) cancion.url_video = url_video;

    await cancion.save();

    res.status(200).json({
      message: 'Canción editada correctamente',
      cancion
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error al editar la canción' });
  }
};

exports.eliminarCancion = async (req, res) => {
  try {
    let cancion = await Cancion.findByIdAndDelete(req.params.id);
    if (!cancion) {
      return res.status(404).json({ message: 'Canción no encontrada' });
    }

    res.status(200).json({
      message: 'Canción eliminada correctamente'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la canción' });
  }
};

exports.obtenerComentarios = async (req, res) => {
  try {
    let cancion = await Cancion.findById(req.params.id);
    if (!cancion) {
      return res.status(404).json({ message: "Canción no encontrada" });
    }
    res.status(200).json(cancion.comentarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener comentarios" });
  }
};

exports.agregarComentario = async (req, res) => {
  try {
    let cancion = await Cancion.findById(req.params.id);
    if (!cancion) {
      return res.status(404).json({ message: "Canción no encontrada" });
    }

    let { nombre, texto } = req.body;
    if (!nombre || !texto) {
      return res.status(400).json({ message: "Faltan campos del comentario" });
    }

    let nuevoComentario = {
      nombre,
      texto,
      fecha: new Date()
    };

    cancion.comentarios.push(nuevoComentario);
    await cancion.save();

    res.status(201).json({
      message: "Comentario agregado",
      comentarios: cancion.comentarios
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al agregar comentario" });
  }
};