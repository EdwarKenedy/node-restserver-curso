const express = require('express');
let {
  verificarToken,
  verificaAdminRole
} = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// =============================
// Mostrar todas las categorías
// =============================

app.get('/categoria', verificarToken, (req, res) => {
  console.log(req);
  Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, categorias) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      res.json({
        ok: true,
        categorias
      });
    });
});

// =============================
// Mostrar una categoría por ID
// =============================

app.get('/categoria/:id', verificarToken, (req, res) => {
  let id = req.param('id');
  Categoria.findById(id, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!categoriaDB) {
      return res.status(500).json({
        ok: false,
        err: {
          message: 'El ID no es correcto'
        }
      });
    }
    res.json({
      ok: true,
      categoria: categoriaDB
    });
  });
});

// =============================
// Crear nueva categoría
// =============================

app.post('/categoria', verificarToken, (req, res) => {
  // regresa la nueva categoría
  // req.usuario._id
  let body = req.body;
  console.log(req);
  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id
  });
  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    res.json({
      ok: true,
      categoria: categoriaDB
    });
  });
});

// =============================
// Actualizar categoría
// =============================

app.put('/categoria/:id', verificarToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;
  let descripcionCategoria = {
    descripcion: body.descripcion
  };
  Categoria.findByIdAndUpdate(
    id,
    descripcionCategoria,
    { new: true, runValidators: true },
    (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      res.json({
        ok: true,
        usuario: categoriaDB
      });
    }
  );
});

// =============================
// Eliminar categoría
// =============================

app.delete(
  '/categoria/:id',
  [verificarToken, verificaAdminRole],
  (req, res) => {
    // Solo un administrador puede borrar categorías
    // Categoría.findByIdAndRemove
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'El ID no existe'
          }
        });
      }
      res.json({
        ok: true,
        message: 'Categoría borrada'
      });
    });
  }
);

module.exports = app;
