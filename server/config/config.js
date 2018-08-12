// ========================
// Puerto
// ========================

process.env.PORT = process.env.PORT || 3000;

// ==================
// Entorno
// ==================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ================
// Base de datos
// ================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/cafe';
} else {
  urlDB = 'mongodb://cafe-user:Odiotrabajar1@ds119732.mlab.com:19732/cafe';
}

process.env.URLDB = urlDB;
