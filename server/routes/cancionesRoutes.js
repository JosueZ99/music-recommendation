let express = require("express");
let router = express.Router();
let cancionController = require("../controller/cancionController");

router.post("/", cancionController.agregarCancion);

router.get("/", cancionController.listarCanciones);

router.patch("/:id/upvote", cancionController.upvote);
router.patch("/:id/downvote", cancionController.downvote);

router.get("/random", cancionController.randomSong);

router.put('/:id', cancionController.editarCancion);
router.delete('/:id', cancionController.eliminarCancion);

router.get("/:id/comentarios", cancionController.obtenerComentarios);
router.post("/:id/comentarios", cancionController.agregarComentario);

module.exports = router;
