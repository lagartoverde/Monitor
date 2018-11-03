const express = require('express');
const app = express();
const ip = require('ip');
const parseXML = require('xml2js').parseString;

const {prepareSimulation, launchSimulation, stopSimulation, construirCabecera} = require('./logic.js')
const { addLog, addCliente, addTienda, clientes, tiendas } = require('./store.js');
var emi = {ip: ip.address(), puerto: '3000', rol: 'Monitor'}


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
  const rol = req.body.mensaje.emisor[0].rol[0].toLowerCase()
  const agente = {
    ip,
    puerto,
    ready: false,
    rol
  }
  if(rol === 'comprador') {
    addCliente(agente)
  } else if(rol === 'tienda'){
    addTienda(agente)
  }
  var rec = {ip: agente.ip, puerto: agente.puerto, rol: agente.rol} 

  construirCabecera(emi, rec, 'evento', 'plantillaACKInicio', {}).then((result) => {
    res.send(result)
  })

})

app.get('/prepare', (req, res) => {
  // El monitor tiene que preparar la simulacion
  /******
   * 
   * for(let cliente of clientes) {
   * var rec = {ip : cliente.ip, puerto: cliente.puerto, rol: 'Comprador'}
        var XML = await construirCabecera(emi, rec, 'evento', 'plantillaInicializacionCliente', {producto: {nombre: 'nombre1', cantidad: 2}, tienda: {ip: '123.123.123.123', puerto: '1234'}})
        Aqui enviar XML. Consultar con tiendas y clientes en clase
     } 

     for(let tienda of tiendas) {
   * var rec = {ip : tienda.ip, puerto: tienda.puerto, rol: 'Tienda'}
        var XML = await construirCabecera(emi, rec, 'evento', 'plantillaInicializacionTienda', {producto: {nombre: 'nombre1', cantidad: 2}})
        Aqui enviar XML. Consultar con tiendas y clientes en clase
     }
   * 
   * 
   * 
   * 
   */
  res.send('El monitor prepara la simulacion')
})

app.get('/go', (req, res) => {
  // El monitor lanza la simulacion
  launchSimulation();
  res.send('El monitor lanza la simulacion');
})


app.get('/stop', (req, res) => {
  // El monitor para la simulacion
  stopSimulation()
  res.send('El monitor para la simulacion');
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

