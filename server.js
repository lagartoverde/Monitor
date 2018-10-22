const express = require('express');
const app = express();
const parseXML = require('xml2js').parseString;

const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);

app.use(bodyParser.xml());

app.use(express.static('public'));

app.post('/init', (req, res) => {
  // Una tienda/cliente se ha inicializado
  console.log('Emisor IP');
  console.log(req.body.mensaje.emisor[0].direccion[0].ip[0]);
  console.log('Rol')
  console.log(req.body.mensaje.emisor[0].rol[0]);
  res.end('El monitor sabe que te has inicializado');
})

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


function prepareSimulation() {
  console.log('Simulacion preparada');
}

function launchSimulation() {
  console.log('Simulacion lanzada');
}

function stopSimulation() {
  console.log('Simulacion parada')
}