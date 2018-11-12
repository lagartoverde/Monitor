const express = require('express');
const app = express();
const ip = require('ip');
const parseXML = require('xml2js').parseString;


const { prepareSimulation, launchSimulation, stopSimulation, construirXML, mockPrepareTienda, mockPrepareCliente, firstUpperCase } = require('./logic.js')
const { addLog, addCliente, addTienda, clientes, tiendas } = require('./store.js');
var emi = { ip: ip.address(), puerto: '3000', rol: 'Monitor' }

const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
const apiController = require('./apiController.js');

app.use(bodyParser.xml({
  verify: function (req, res, buf, encoding) {
    // get rawBody        
    req.rawBody = buf.toString();
  }
}));

app.use(express.static('public'));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api', apiController);

app.post('/init', (req, res) => {
  // Una tienda/cliente se ha inicializado
  console.log('Emisor IP');
  //Se obtienen los parámetros correspondientes para añadirlos del XML
  const ip = req.body.mensaje.emisor[0].direccion[0].ip[0];
  const puerto = req.body.mensaje.emisor[0].direccion[0].puerto[0];
  const rol = firstUpperCase(req.body.mensaje.emisor[0].rol[0].toLowerCase())
  const agente = {
    ip,
    puerto,
    ready: false,
    rol
  }

  //Se comprueba el rol para diferenciar a la hora de preparar la simulacion
  if (rol === 'Comprador') {
    addCliente(agente)
  } else if (rol === 'Tienda') {
    addTienda(agente)
  }
  var rec = { ip: agente.ip, puerto: agente.puerto, rol: agente.rol }
  //Se construye el XML que será enviado como ACK de la inicializacion donde se entregara el ID
  construirXML(emi, rec, 'evento', 'plantillaACKInicio', { id: agente.id }).then((result) => {
    
    res.send(result)
  })

})


/**
 * Funcion para enviar un mensaje de preparacion de tienda. Provisional, solo para probar
 * conectividad entre dispositivos
 */
app.get('/prepareStore', (req, res) => {
  var datos = mockPrepareTienda()
  var rec = { ip: '192.0.0.0', puerto: '80', rol: 'Tienda' }
  construirXML(emi, rec, 'evento', 'plantillaInicializacionTienda', datos).then((result) => {
    res.send(result)
  })
})

/**
 * Funcion para enviar un mensaje de preparacion de cliente. Provisional, solo para probar
 * conectividad entre dispositivos
 */
app.get('/prepareClient', (req, res) => {
  var datos = mockPrepareCliente()
  var rec = { ip: '192.0.0.0', puerto: '80', rol: 'Tienda' }
  construirXML(emi, rec, 'evento', 'plantillaInicializacionCliente', datos).then((result) => {
    res.send(result)
  })
})


/**
 * Funcion de preparar tienda. Cuando se llama desde la interfaz web, envia un XML a cada agente en la
 * lista de clientes y de tiendas con los XML adecuados para su inicializacion
 */
app.get('/prepare', async (req, res) => {
  prepareSimulation()
  res.send('El monitor prepara la simulacion')
})

/**
 * Funcion que inicializa la simulacion. Cuando se llama desde la interfaz web, manda un mensaje XML broadcast
 * para que todos los agentes empiecen a funcionar
 */
app.get('/go', (req, res) => {
  // El monitor lanza la simulacion
  launchSimulation();
  res.send('El monitor lanza la simulacion');
})

/**
 * Funcion que para la simulacion. Cuando se llama desde la interfaz web, manda un mensaje XML broadcast
 * para que todos los agentes dejen de funcionar
 */
app.get('/stop', (req, res) => {
  // El monitor para la simulacion
  stopSimulation()
  res.send('El monitor para la simulacion');
})

/**
 * Función que genera los log basicos y los muestra en la interfaz web
 */
app.post('/log', (req, res) => {
  //Mensaje XML copiado por el agente
  const mensajeLog = req.body.mensaje.cuerpo[0].contenido[0];
  //Datos del emisor y receptor
  const emisor = `${mensajeLog.mensaje[0].emisor[0].direccion[0].ip[0]}:${mensajeLog.mensaje[0].emisor[0].direccion[0].puerto[0]} / ${mensajeLog.mensaje[0].emisor[0].rol[0]}`;
  const receptor = `${mensajeLog.mensaje[0].receptor[0].direccion[0].ip[0]}:${mensajeLog.mensaje[0].receptor[0].direccion[0].puerto[0]} / ${mensajeLog.mensaje[0].receptor[0].rol[0]}`;
  const date = new Date()
  const hora = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  const tipo = mensajeLog.mensaje[0].tipo[0];
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

/**
 * Funcion que parsea el cuerpo de un mensaje XML para mostrar lo necesario
 * @param {Cuerpo del mensaje} body 
 */
function getMensaje(body) {
  const indexStart = body.search('<contenido>') + 11;
  const indexEnd = body.search('</contenido>');
  const mensaje = body.substring(indexStart, indexEnd);
  return mensaje;
}

app.listen(3000, () => console.log('Server listening in port 3000'));

