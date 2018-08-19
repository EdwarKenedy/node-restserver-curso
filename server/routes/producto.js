const express = require('express');
const _ = require('underscore');
const { verificarToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

// ============================
// Obtener todos los productos
// ============================
app.get('/producto', verificarToken, (req, res) => {
  // trae todos los productos
  // populate: usuario categoría
  // paginado
  let desde = Number(req.query.desde || 0);
  let hasta = Number(req.query.hasta || 5);
  Producto.find({ disponible: true })
    .populate('usuario')
    .populate('categoria')
    .skip(desde)
    .limit(hasta)
    .exec((err, productosDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      res.json({
        ok: true,
        productos: productosDB
      });
    });
});

// ============================
// Obtener un producto por ID
// ============================
app.get('/producto/:id', verificarToken, (req, res) => {
  // populate: usuario categoría
  let id = req.params.id;
  Producto.findById(id)
    .populate('usuario')
    .populate('categoria')
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'El ID no es correcto'
          }
        });
      }
      res.json({
        ok: true,
        producto: productoDB
      });
    });
});

// ============================
// Buscar productos
// ============================
app.get('/producto/buscar/:termino', verificarToken, (req, res) => {
  let termino = req.params.termino;
  let regex = new RegExp(termino, 'i');
  Producto.find({ nombre: regex })
    .populate('categoria')
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({ ok: true, err });
      }
      res.json({
        ok: true,
        productos
      });
    });
});

// ============================
// Crear un nuevo producto
// ============================
app.post('/producto', verificarToken, (req, res) => {
  // grabar el usuario
  // grabar una categoría del listado
  let body = _.pick(req.body, [
    'nombre',
    'precioUni',
    'descripcion',
    'categoria'
  ]);
  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    categoria: body.categoria,
    usuario: req.usuario._id
  });
  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    res.status(201).json({
      ok: true,
      producto: productoDB
    });
  });
});

// ============================
// Modificar un producto
// ============================
app.put('/producto/:id', verificarToken, (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, [
    'nombre',
    'precioUni',
    'descripcion',
    'categoria',
    'disponible'
  ]);
  Producto.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, productoDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Producto no encontrado'
          }
        });
      }
      res.json({
        ok: true,
        producto: productoDB
      });
    }
  );
});

// ============================
// Borrar un producto
// ============================
app.delete('/producto/:id', verificarToken, (req, res) => {
  // cambiar la propiedad disponible
  let id = req.params.id;
  Producto.findByIdAndUpdate(
    id,
    { disponible: false },
    { new: true },
    (err, productoBorrado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      if (!productoBorrado) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Usario no encontrado'
          }
        });
      }
      res.json({
        ok: true,
        producto: productoBorrado
      });
    }
  );
});

module.exports = app;
