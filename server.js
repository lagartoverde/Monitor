const express = require('express');
const app = express();
const parseXML = require('xml2js').parseString;

const {prepareSimulation, launchSimulation, stopSimulation} = require('./logic.js')
const { clientes, tiendas } = require('./store.js');

const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);

app.use(bodyParser.xml());

app.use(express.static('public'));

app.post('/init', (req, res) => {
  // Una tienda/cliente se ha inicializado
  console.log('Emisor IP');
  const ip = req.body.mensaje.emisor[0].direccion[0].ip[0];
  const puerto = req.body.mensaje.emisor[0].direccion[0].puerto[0];
  const rol = req.body.mensaje.emisor[0].rol[0];
  if(rol === 'cliente') {
    añadirCliente({ip, puerto});
  } else if(rol === 'tienda'){
    añadirTienda({ip, puerto})
  }
  res.json('El monitor sabe que te has inicializado');
})

function añadirCliente(cliente){
  clientes.push(cliente);
}

function añadirTienda(tienda) {
  tiendas.push(tienda);
}

app.get('/prepare', (req, res) => {
  // El monitor tiene que preparar la simulacion
  prepareSimulation();
  res.send('El monitor prepara la simulacion');
})

app.get('/go', (req, res) => {
  // El monitor lanza la simulacion
  launchSimulation();
  res.send('El monitor lanza la simulacion');
})

app.post('/goReceived', (req, res) => {
  // El monitor registra que esa tienda/cliente ha empezado
  res.send('El monitor sabe que has empezado la simulacion');
})

app.get('/stop', (req, res) => {
  // El monitor para la simulacion
  stopSimulation()
  res.send('El monitor para la simulacion');
})

app.listen(3000, ()=> console.log('Server listening in port 3000'));

