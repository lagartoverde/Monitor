const express = require('express');
const app = express();
const parseXML = require('xml2js').parseString;


const {prepareSimulation, launchSimulation, stopSimulation, construirCabecera} = require('./logic.js')
const { clientes, tiendas, addLog } = require('./store.js');


const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
const apiController = require('./apiController.js');

app.use(bodyParser.xml({
  verify: function(req, res, buf, encoding) {
    // get rawBody        
    req.rawBody = buf.toString();
}
}));

app.use(express.static('public'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api', apiController);

app.post('/init', (req, res) => {
  // Una tienda/cliente se ha inicializado
  console.log('Emisor IP');
  const ip = req.body.mensaje.emisor[0].direccion[0].ip[0];
  const puerto = req.body.mensaje.emisor[0].direccion[0].puerto[0];
  const rol = req.body.mensaje.emisor[0].rol[0];
  const agente = {
    ip,
    puerto,
    ready: false
  }
  if(rol === 'cliente') {
    añadirCliente(agente);
  } else if(rol === 'tienda'){
    añadirTienda(agente)
  }
  // Mandar xml para que la tienda/cliente sepa que la peticion se ha completado adecuadamente
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

app.get('/patata', (req, res) => {
  var emi = {ip: '192.168.1.1', puerto: '80', rol: 'Comprador'} 
  var rec = {ip: '192.168.1.2', puerto: '80', rol: 'Monitor'}
  construirCabecera(emi, rec, 'patata', '00:00', 'plantillaCabecera', {emisor: emi, receptor: rec, tipo: 'patata', hora: '1234', cuerpo: 'patataaaa'}).then((result) => {
    res.send(result)
  })
  
})
app.post('/log', (req, res) => {
  const mensajeLog = req.body.mensaje.cuerpo[0].contenido[0];
  const emisor = `${mensajeLog.mensaje[0].emisor[0].direccion[0].ip[0]}:${mensajeLog.mensaje[0].emisor[0].direccion[0].puerto[0]} / ${mensajeLog.mensaje[0].emisor[0].rol[0]}`;
  const receptor = `${mensajeLog.mensaje[0].receptor[0].direccion[0].ip[0]}:${mensajeLog.mensaje[0].receptor[0].direccion[0].puerto[0]} / ${mensajeLog.mensaje[0].receptor[0].rol[0]}`;
  const date = new Date()
  const hora = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  const tipo =mensajeLog.mensaje[0].tipo[0];
  const mensaje = getMensaje(req.rawBody);
  const log = {
    emisor,
    receptor,
    hora,
    tipo,
    mensaje
  }
  addLog(log);
  res.json('El mensaje ha sido guardado correctamente');
})

function getMensaje(body) {
  const indexStart = body.search('<contenido>')+ 11;
  const indexEnd = body.search('</contenido>');
  const mensaje = body.substring(indexStart, indexEnd);
  return mensaje;
}


app.listen(3000, ()=> console.log('Server listening in port 3000'));
