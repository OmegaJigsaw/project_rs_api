import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { PORT } from './config/app-config.js';
import userRouter from './routes/users-routes.js';
import postRouter from './routes/posts-routes.js';
import commentRouter from './routes/comments-routes.js';


// Obtenemos la ruta del archivo actual con esta función
const __filename = fileURLToPath(import.meta.url);

// Obtenemos la carpeta del archivo actual con esta función
const __dirname = path.dirname(__filename)

const app = express();

const allowCrossDomain = function(req, res, next) {
    // Permite que el servidor responda a peticiones desde cualquier origen
    res.header('Access-Control-Allow-Origin', '*');

    // Permite que el servidor responda a peticiones con los métodos indicados
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');

    // Permite que el servidor responda a peticiones con las cabeceras indicadas
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    // Termina la ejecución de la función middleware y pasa al siguiente middleware
    next();
}

// Configura el servidor para que utilice la función middleware que permite el acceso a recursos de otros dominios
app.use(allowCrossDomain);

// Configura el servidor para que utilice la función middleware para convertir JSON en objetos de JavaScript
// Que responden a req.body, req.params, req.query, etc. en las peticiones HTTP
app.use(express.json());

// Puerto en el que escucha el servidor, obtenido de las variables de entorno luego de pasar por app-config.js
const APP_PORT = PORT || 3000;

// Configurar la ruta que van a tener las solicitudes HTTP a los modulos
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);

// Listener del servidor con el puerto donde escucha
app.listen(APP_PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${APP_PORT}`);
})