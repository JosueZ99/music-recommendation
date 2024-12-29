# Instrucciones de Ejecución

Este proyecto es una aplicación web de Biblioteca Musical que permite:

- Agregar canciones con su nombre, artista y URL de YouTube.  
- Votar (like / dislike) cada canción.  
- Ver una canción aleatoria.  
- Editar y eliminar canciones.  
- Agregar y consultar comentarios por canción.

## Requisitos previos

- **Node.js** (versión 14 o superior)  
- **MongoDB** (instalado localmente o disponible en la nube)  
- Un navegador web

## Paso a paso para ejecutar

### 1. Clonar el repositorio
```bash
git clone https://github.com/JosueZ99/music-recommendation.git
```
### 2. Instalar dependencias
```bash
cd server
npm install
```
Esto descargará las dependencias necesarias declaradas en el `package.json`.

### 3. Configurar la base de datos
Asegúrate de que **MongoDB** se esté ejecutando en `mongodb://localhost:27017/`, o bien ajusta la cadena de conexión en el archivo `server.js` si usas un servidor remoto:

```js
// server.js
await mongoose.connect("mongodb://localhost:27017/music", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

### 4. Iniciar el servidor
```bash
npm run dev
```
*(Asumiendo que en tu `package.json` tienes `"dev": "nodemon server.js"`.  
Si no, ejecuta `node server.js` manualmente.)*

Si todo va bien, verás un mensaje tipo “Server is up” en la consola, indicando que el servidor Express corre en el puerto **3000**.

### 5. Abrir el frontend
Puedes abrir los archivos de la carpeta **client** directamente en tu navegador (por ejemplo, `index.html`).  
También podrías servir la carpeta `client` de forma estática desde tu servidor, pero la forma más simple es:
- Abrir `client/index.html` en tu navegador.

### 6. Probar la aplicación
- **Página de Inicio (index.html)**: Botón de canción aleatoria y bienvenida.  
- **Agregar Canción (addSong.html)**: Formulario para añadir canciones.  
- **Lista de Canciones (songList.html)**:  
  - Visualiza todas las canciones ordenadas por votos.  
  - Vota con los pulgares arriba/abajo.  
  - Edita o elimina una canción (ícono de lápiz).  
  - Ver y agregar comentarios (ícono de comentarios).  

### 7. Funcionalidades principales
- **Canción aleatoria**: Presiona el botón en la página de inicio para ver una canción al azar.  
- **Votos**: Se guardan en la base de datos, por lo que persisten si reinicias el servidor.  
- **Comentarios**: Haz clic en el ícono de comentarios de cada canción para ver y añadir comentarios.  
- **Edición**: Haz clic en el ícono de lápiz para editar la información de la canción o eliminarla definitivamente.

### 8. Despliegue en un servidor
- Para desplegar tu backend, puedes usar plataformas como Heroku, Railway, Render, etc.  
- Para la base de datos, usa MongoDB Atlas o un servicio equivalente.  
- Ajusta la cadena de conexión en `server.js` para que apunte a la base remota.  
- Si deseas servir tus archivos estáticos, puedes usar `app.use(express.static('client'));` dentro de tu servidor.

### 9. Gitignore
El proyecto incluye un archivo `.gitignore` para **no subir** la carpeta `node_modules/` y otros archivos sensibles al repositorio.
