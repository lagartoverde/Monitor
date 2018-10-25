const express = require('express')
const router = express.Router()
const { clientes, tiendas, logs, getLog } = require('./store');

router.get('/agentes',(req,res) => {
  let clientesConRol = clientes.map((cliente) => {
    cliente.rol = 'cliente'
    return cliente
  })
  tiendasConRol = tiendas.map((tienda) => {
    tienda.rol = 'tienda'
    return tienda
  })
  let agentes = clientesConRol.concat(tiendasConRol);
  res.json(agentes);
});

router.get('/logs', (req,res) => {
  res.json(logs);
})

router.get('/logs/:id', (req,res) => {
  const id = req.params.id;
  res.json({ mensaje: getLog(id).mensaje });
})

module.exports = router