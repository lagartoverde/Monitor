const express = require('express');
const app = express();
const ip = require('ip');
const parseXML = require('xml2js').parseString;
const validator = require('xsd-schema-validator');
var prepared = false
var go = false
var productosClientes = []
var tiendasConocidas = []

const { prepareSimulation, launchSimulation, stopSimulation, construirXML, firstUpperCase} = require('./logic.js')
const { addLog, addCliente, addTienda, clientes } = require('./store.js');
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

// Permitimos todas las conexiones de todos los origenes
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Delegamos la ruta /api al controlador apiController
app.use('/api', apiController);

// la ruta /init permita a un agente inicializarse 
app.post('/init', (req, res) => {
  // Una tienda/cliente se ha inicializado
  //console.log('Emisor IP');
  console.log(req.body)
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
    validator.validateXML(result, 'SistemasMultiagentes2018/Grupos/G6/Schemas/SchemaACKInicio.xsd', function(err, result) {
      //console.log(err)
      //console.log(result.valid)// true
    });
    res.send(result)
  })

})


/**
 * Funcion de preparar tienda. Cuando se llama desde la interfaz web, envia un XML a cada agente en la
 * lista de clientes y de tiendas con los XML adecuados para su inicializacion
 */
app.get('/prepare',(req, res) => {
  prepared = true
  const result = prepareSimulation()
  productosClientes = result[0]
  tiendasConocidas = result[1]
  res.send('El monitor prepara la simulacion')
})

// Ruta /prepareCliente permite el uso de polling para determinar cuando un agente
// debe prepararse
app.post('/prepareCliente', async (req, res) => {
  console.log(req.body.mensaje.emisor[0].direccion)
  const ip = req.body.mensaje.emisor[0].direccion[0].ip[0];
  const puerto = req.body.mensaje.emisor[0].direccion[0].puerto[0];
  const id = req.body.mensaje.emisor[0].direccion[0].id[0];
  const rol = 'Comprador'

  var rec = { ip: ip, puerto: puerto, rol: rol, id: id}

  if (!prepared){
    construirXML(emi, rec, 'evento', 'plantillaNotReady').then((result) => {
      // validator.validateXML(result, 'SistemasMultiagentes2018/Grupos/G6/Schemas/SchemaACKInicio.xsd', function(err, result) {
      //   console.log(err)
      //   console.log(result.valid)// true
      // });
      res.send(result)
    })
  }else{
    clientes.forEach((cliente, index) => {
      console.log('indice ' + index)
      console.log('id ' + id)
      if (index == id){
        console.log('Entra en el bucle')
        console.log(productosClientes[index])
        console.log(tiendasConocidas[index])
        construirXML(emi, rec, 'inicializacion', 'plantillaInicializacionCliente', {productos: productosClientes[index], tiendas: tiendasConocidas[index]}).then((result) => {
          res.send(result)
        });
        
      }
    })
  }
})
/**
 * Funcion que inicializa la simulacion. Cuando se llama desde la interfaz web, manda un mensaje XML broadcast
 * para que todos los agentes empiecen a funcionar
 */
app.get('/go', (req, res) => {
  // El monitor lanza la simulacion
  go = true;
  launchSimulation();
  res.send('El monitor lanza la simulacion');
})

// Ruta /goCliente permite el uso de polling para determinar cuando un agente
// debe empezar con la simulacion
app.post('/goCliente', (req, res) => {
  const ip = req.body.mensaje.emisor[0].direccion[0].ip[0];
  const puerto = req.body.mensaje.emisor[0].direccion[0].puerto[0];
  const id = req.body.mensaje.emisor[0].direccion[0].id[0];
  const rol = 'Comprador'

  var rec = { ip: ip, puerto: puerto, rol: rol, id: id}
  if(!go) {
    construirXML(emi, rec, 'evento', 'plantillaNotReady').then((result) => {
      // validator.validateXML(result, 'SistemasMultiagentes2018/Grupos/G6/Schemas/SchemaACKInicio.xsd', function(err, result) {
      //   console.log(err)
      //   console.log(result.valid)// true
      // });
      res.send(result)
    })
  } else {
    construirXML(emi, rec, 'evento', 'plantillaGo').then((result) => {
      // validator.validateXML(result, 'SistemasMultiagentes2018/Grupos/G6/Schemas/SchemaACKInicio.xsd', function(err, result) {
      //   console.log(err)
      //   console.log(result.valid)// true
      // });
      res.send(result)
    })
  }
  
})

app.get('/test', (req, res) => {
  // El monitor lanza la simulacion
  res.send([productosClientes, tiendasConocidas]);
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

