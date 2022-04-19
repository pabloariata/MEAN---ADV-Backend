require ('dotenv').config();
const path = require('path');

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Crear el servidor de express
const app = express();

// Configurar CORS
app.use(cors());

// Lectura y parseo del body de las peticiones
app.use(express.json());

// Base de datos
dbConnection();

// Directorio público
app.use(express.static('public'));

// console.log(process.env);

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/upload', require('./routes/uploads'));

// Lo último, para redirigir cualquier peticion que no sea de las anteriores, que redirija al index.html
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
})


app.listen(process.env.PORT, () => {

    console.log('Servidor corriendo en puerto ' + process.env.PORT);

})

