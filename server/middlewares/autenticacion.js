const jwt = require('jsonwebtoken');

// =================
// Verificar Token
// =================
let verificarToken = (req, res, next) => {
  // .get() obtiene los headers de la petición
  let token = req.get('token');
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: 'Token no válido'
        }
      });
    }
    req.usuario = decoded.usuario;
    next();
  });
  // res.json({
  //   token
  // });
};

// ====================
// Verifica AdminRole
// ====================

let verificaAdminRole = (req, res, next) => {
  let usuario = req.usuario;
  if (usuario.role === 'ADMIN_ROLE') {
    next();
  } else {
    return res.json({
      ok: false,
      err: {
        message: 'El usuario no es administrador'
      }
    });
  }
};

module.exports = {
  verificarToken,
  verificaAdminRole
};
