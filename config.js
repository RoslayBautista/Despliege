// config.js

// Verifica si las variables de entorno están definidas
const DB_HOST = process.env.DB_HOST || 'localhost'; // Valor por defecto
const DB_USER = process.env.DB_USER || 'root'; // Valor por defecto
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'nodejs'; // Valor por defecto
const DB_PORT = process.env.DB_PORT || 3307; // Agregar el puerto


module.exports = {
    dbConfig: {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        port: DB_PORT
        
    }
};