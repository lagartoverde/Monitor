const express = require('express')
const router = express.Router()
const { clientes, tiendas, logs, getLog } = require('./store');


// ruta /api/agentes obtiene un array de todos los agentes
// implicados en la simulacion
router.get('/agentes',(req,res) => {
  let clientesConRol = clientes.map((cliente) => {
    cliente.rol = 'comprador'
    return cliente
  })
  tiendasConRol = tiendas.map((tienda) => {
    tienda.rol = 'tienda'
    return tienda
  })
  let agentes = clientesConRol.concat(tiendasConRol);
  res.json(agentes);
});

// ruta /api/logs obtiene un listado de todos los logs
// generados durante la simulacion
router.get('/logs', (req,res) => {
  res.json(logs);
})

// ruta /api/logs/:id obtiene un log concreto mediante su id
router.get('/logs/:id', (req,res) => {
  const id = req.params.id;
  res.json({ mensaje: getLog(id).mensaje });
})

// ruta /api/products/:id obtiene los productos repartidos a una tienda
// identificandola por su id
router.get('/products/:id', (req,res) => {
  const id = req.params.id;
  res.json(tiendas[id].productos);
})

module.exports = router