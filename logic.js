const {clientes, tiendas} = require('./store.js');
const {getCliente, getTienda} = require('./store.js');
const handlebars = require('handlebars');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const ip = require('ip');
const parseXML = require('xml2js').parseString;
const fetch = require('node-fetch');


function firstUpperCase(string){
  return string.charAt(0).toUpperCase() + string.slice(1)
}
function prepareSimulation() {
  const productos = ['zanahoria', 'patata', 'coliflor', 'manzana', 'platano', 'pimiento', 'lechuga', 'tomate']
  const [productosTiendas, productosClientes, tiendasConocidas] = repartirProductos(clientes.length, tiendas.length, 100, productos, 2);
  for(let i = 0; i<tiendas.length; i++){
    prepararTienda(tiendas[i], productosTiendas[i]);
  }
  return [productosClientes, tiendasConocidas]
}

/**
 * Inicialización de las tiendas y los clientes. A cada tienda se le da una cantidad aleatoria de productos, 
 * de forma que todas tengan la misma cantidad total (si es posible). Luego, a cada cliente se le da 
 * una cantidad aleatoria de productos, sin importar por ahora que las cantidades totales sean iguales. 
 * Por último, para aleatorizar más, se ceden objetos de unas tiendas a otras (dentro de un rango especificado).
 * 
 * @param {el número de clientes a los que repartir productos} numClientes 
 * @param {el número de tiendas a las que repartir productos} numTiendas 
 * @param {la cantidad total de productos a repartir al azar} numProductos 
 * @param {lista de posibles productos a repartir} listaProductos 
 * @param {cantidad máxima de productos que una tienda puede ceder a otra} rango 
 *  Retorno:
 *	- Un array con tres arrays: los dos primeros son para tiendas para clientes. Cada uno de ellos contiene un array por
 *    tienda o por cliente, los cuales contienen la lista de productos de dicha tienda o cliente. El último array indica
 *    qué tiendas conoce cada cliente de antemano.
 */
function repartirProductos(numClientes, numTiendas, numProductos, listaProductos, rango) {
  const factorDesviacion = 10;
  var productosClientes = [];
  var productosTiendas = [];
  var tiendasConocidas = [];

  // Inicializar los arrays de tiendas y clientes
  var i;
  for (i = 0; i < numTiendas; i++) {
    productosTiendas.push([]);
  }

  for (i = 0; i < numClientes; i++) {
    productosClientes.push([]);
	  tiendasConocidas.push([]);
  }

  // Repartir la misma cantidad de productos a cada tienda y a cada cliente
  var indexTienda = 0;
  for (i = 0; i < numProductos; i++) {
    var prod = listaProductos[Math.floor(Math.random() * listaProductos.length)];
    var clienteRand = Math.floor(Math.random() * numClientes);

    addProducto(productosTiendas[indexTienda], prod);
    addProducto(productosClientes[clienteRand], prod);

    indexTienda = (indexTienda + 1) % numTiendas;
  }

  // Entre pares aleatorios de tiendas, dar productos de una a otra hasta el rango como máximo
  // Hacer "factorDesviación" veces. Se puede cambiar el valor para controlar el nivel de aleatoriedad

  var idsTiendas = [];
  for (i = 0; i < numTiendas; i++) {
    idsTiendas.push(i);
  }

  i = 0;
  while (idsTiendas.length > 1 || i <= factorDesviacion) {
    var rndPos1 = Math.floor(Math.random() * idsTiendas.length);
    var id1 = idsTiendas[rndPos1];
    idsTiendas.splice(rndPos1, 1);

    var rndPos2 = Math.floor(Math.random() * idsTiendas.length);
    var id2 = idsTiendas[rndPos2];
    idsTiendas.splice(rndPos2, 1);

    cederProds (productosTiendas[rndPos1], productosTiendas[rndPos2], rango);
    i += 1;
  }
  
  // Por último, dar a cada cliente dos tiendas al azar que conoce
  // TODO: cambiar en el futuro para evitar deadlocks
  for (i = 0; i < numClientes; i++) {
	  var t1 = Math.floor(Math.random() * numTiendas);
    var t2 = Math.floor(Math.random() * numTiendas);
    while (t1 == t2) {
      t2 = Math.floor(Math.random() * numTiendas);
    }
	  
	  tiendasConocidas[i].push(getTienda(t1));
	  tiendasConocidas[i].push(getTienda(t2));
  }

  console.log('Simulacion preparada');

  return [productosTiendas, productosClientes, tiendasConocidas];
}



// Acepta dos tiendas y una cantidad máxima de productos a ceder de una tienda a otra.
// Transfiere productos al azar de una tienda a otra.
function cederProds(tienda1, tienda2, rango) {

    var i;

    for (i = 0; i < rango; i++) {
      var indiceProdRnd = Math.floor(Math.random() * tienda1.length);
      
      if (tienda1.length == 0) {
	  return;
      }
      var prodRnd = tienda1[indiceProdRnd].nombre;
      deleteProducto(tienda1, prodRnd);
      addProducto(tienda2, prodRnd);
    }
 
    return;
}

// Devuelve la posición de un producto en un array de productos (como en el de una tienda o cliente).
// Si no existe, devuelve -1.
function prodIndex(prod, list) {
    var elem;
    var i = 0;
    for (elem in list) {
        if (list[elem].nombre === prod) {
            return i;
        }
	
	i += 1;
    }
    return -1;
}

// Acepta una tienda/cliente y un producto
// Añade a dicha tienda/cliente el producto si no existe con cantidad 1. Si existe, aumenta la cantidad en 1.
function addProducto(lista, prod) {

    var ind = prodIndex(prod, lista);

    if (ind == -1) {
      lista.push({nombre: prod, cantidad: 1});
    } else {
      lista[ind].cantidad += 1;
    }
}

// Acepta una tienda y el nombre de un producto. Borra una unidad de dicho producto de la tienda.
// Si ya no quedan unidades, borra el producto de la tienda.
function deleteProducto(tienda, producto) {
    
    var ind = prodIndex(producto, tienda);

    if (ind == -1) {
      return;
    } else {
      if (tienda[ind].cantidad == 1) {
	      tienda.splice(ind, 1);
      } else {
	      tienda[ind].cantidad -= 1;
      }
    }
    return;
}

async function prepararTienda(tienda, productos) {
  tienda.productos = productos
  var emi = { ip: ip.address(), puerto: '3000', rol: 'Monitor' }
  var rec = { ip: tienda.ip, puerto: tienda.puerto, rol: 'Tienda', id: tienda.id }
  var XML = await construirXML(emi, rec, 'inicializacion', 'plantillaInicializacionTienda', {productos});
  fetch(`http://${tienda.ip}:${tienda.puerto}`,{
    method: 'POST',
    headers: {
      'content-Type': 'application/xml'
    },
    body: XML
  }).then((response) => {
    response.text()
    tienda.ready = true
  }).catch((error) => {
    console.log(error)
  })
}

async function prepararCliente(cliente, productos, tiendas) {
  var emi = { ip: ip.address(), puerto: '3000', rol: 'Monitor' }
  var rec = { ip: cliente.ip, puerto: cliente.puerto, rol: 'Cliente', id:cliente.id }
  var XML = await construirXML(emi, rec, 'inicializacion', 'plantillaInicializacionCliente', {productos, tiendas});
  fetch(`http://${cliente.ip}:${cliente.puerto}`,{
    method: 'POST',
    headers: {
      'content-Type': 'application/xml'
    },
    body: XML
  }).then((response) => {
    console.log(response)
  }).catch((error) => {
    console.log(error)
  })
}

/**
 * Lanza la simulacion, realizando un envio broadcast de los mensajes a los agentes
 */
function launchSimulation() {
  setTimeout(checkEveryoneIsOn, 10000);
  for(let cliente of clientes) {
    goAgent(cliente, 'Comprador');
  }
  for(let tienda of tiendas) {
    goAgent(tienda, 'Tienda');
  }
  console.log('Simulacion lanzada');
}

async function goAgent(agente, rol) {
  var emi = { ip: ip.address(), puerto: '3000', rol: 'Monitor' }
  var rec = { ip: agente.ip, puerto: agente.puerto, rol }
  var XML = await construirXML(emi, rec, 'evento', 'plantillaGo');
  fetch(`http://${agente.ip}:${agente.puerto}`,{
    method: 'POST',
    headers: {
      'content-Type': 'application/xml'
    },
    body: XML
  }).then((response) => {
    console.log(parseXML(response));
  }).catch((error) => {
    console.log(error)
  })
}

/**
 * Detiene la simulacion, realizando un envio broadcast de los mensajes a los agentes
 */
function stopSimulation() {
  console.log('Simulacion parada')
}

/**
 * Dada una plantilla, esta funcion construye el XML necesario.
 * Para ello, utiliza las plantillas dinamicas Handlebars que rellenan automaticamente
 * los datos necesarios, que se pasan por parametro.
 * Esta funcion rellena el cuerpo de un mensaje XML que se enviara a un agente
 * @param {Nombre de la plantilla Handlebars} plantilla 
 * @param {Diccionario con los datos que requiere la plantilla} datos 
 */
async function construirCuerpo(plantilla, datos){
  file = 'xml/' + plantilla +'.hbs'
  const data = await readFile(file,'utf8')
  var template = handlebars.compile(data)
  var html = template(datos);
  return new handlebars.SafeString(html)
}

//Llamar a esta funcion para construir las plantillas
//plantilla es un string con el nombre de la plantilla y datos un diccionario del tipo {param1: dato1...}
/**
 * Esta funcion construye el XML que se enviara a cada agente. Para ello coge los parametros necesarios del
 * emisor y receptor, y el contenido del cuerpo. 
 * @param {Diccionario con los datos del emisor, que siempre sera el propio Monitor} emisor 
 * @param {Diccionario con los datos del receptor: ip, puerto, rol, id} receptor 
 * @param {Tipo de mensaje a enviar (ACK, evento...)} tipo 
 * @param {Nombre de la plantilla a rellenar} plantilla 
 * @param {Datos necesarios para la construccion de la plantilla} datos 
 */
async function construirXML(emisor, receptor, tipo, plantilla, datos){
  const date = new Date()
  var today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  var hour = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
  const data = await readFile('xml/plantillaCabecera.hbs','utf8')
  var template = handlebars.compile(data)
  var cuerpo = await construirCuerpo(plantilla, datos)
  var context = {emisor: emisor, receptor: receptor, tipo: tipo, fecha: today, hora: hour, cuerpo: cuerpo}
  var xml = template(context);
  return xml
}

/**
 * Comprueba que todos los agentes estan preparados para iniciar la simulacion, si no
 * la detiene
 */
function checkEveryoneIsOn() {
  for(let cliente of clientes) {
    if(!cliente.ready) {
      return stopSimulation()
    }
  }
  for(let tienda of tiendas) {
    if(!tienda.ready) {
      return stopSimulation();
    }
  }
}

module.exports = { prepareSimulation, launchSimulation, stopSimulation, construirXML, firstUpperCase}
