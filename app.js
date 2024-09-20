const express = require('express');
const mysql = require('mysql');
const config = require('./config'); // Importa la configuración
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

// Configuración de la conexión a la base de datos
const db = mysql.createConnection(config.dbConfig);

// Conectar a la base de datos
db.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
});

// Configuración de Multer para subir imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Asegúrate de que esta carpeta exista
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para la imagen
    }
});

const upload = multer({ storage: storage });

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 

// Rutas
app.get('/', (req, res) => {
    db.query('SELECT * FROM productos', (err, resultados) => {
        if (err) throw err;
        console.log(resultados); // Verifica que los resultados contengan la ruta de la imagen
        res.render('index', { productos: resultados });
    });
});

app.get('/crear', (req, res) => {
    res.render('crear_producto');
});

app.post('/crear', upload.single('imagen'), (req, res) => {
    const { nombre, precio, cantidad } = req.body;
    const imagen = `/images/${req.file.filename}`; // Asegúrate de que esto sea correcto

    console.log(`Nombre de la imagen guardada: ${imagen}`); // Verifica el nombre de la imagen

    const sql = 'INSERT INTO productos (nombre, precio, cantidad, imagen) VALUES (?, ?, ?, ?)';
    db.query(sql, [nombre, precio, cantidad, imagen], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});
// Ruta para editar un producto
app.get('/editar/:id', (req, res) => {
    const sql = 'SELECT * FROM productos WHERE id = ?';
    db.query(sql, [req.params.id], (err, resultados) => {
        if (err) throw err;
        res.render('editar_producto', { producto: resultados[0] });
    });
});
// Ruta para actualizar un producto
app.post('/editar/:id', upload.single('imagen'), (req, res) => {
    const { nombre, precio, cantidad } = req.body;
    const imagen = req.file ? `/images/${req.file.filename}` : req.body.imagenActual; // Usar la imagen nueva o la actual

    const sql = 'UPDATE productos SET nombre = ?, precio = ?, cantidad = ?, imagen = ? WHERE id = ?';
    db.query(sql, [nombre, precio, cantidad, imagen, req.params.id], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Ruta para eliminar un producto
app.post('/eliminar/:id', (req, res) => {
    const sql = 'DELETE FROM productos WHERE id = ?';
    db.query(sql, [req.params.id], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});