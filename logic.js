const {clientes, tiendas} = require('./store.js');
const {getCliente, getTienda} = require('./store.js');
const handlebars = require('handlebars');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

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
function prepareSimulation(numClientes, numTiendas, numProductos, listaProductos, rango) {

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
	  
	  tiendasConocidas[i].push(getTienda[t1]);
	  tiendasConocidas[i].push(getTienda[t2]);
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
      var prodRnd = tienda1[indiceProdRnd].producto;
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
        if (list[elem].producto === prod) {
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

/**
 * Lanza la simulacion, realizando un envio broadcast de los mensajes a los agentes
 */
function launchSimulation() {

  setTimeout(checkEveryoneIsOn, 10000);
  console.log('Simulacion lanzada');
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
  const data = await readFile('xml/plantillaCabecera.hbs','utf8')
  var template = handlebars.compile(data)
  var cuerpo = await construirCuerpo(plantilla, datos)
  var context = {emisor: emisor, receptor: receptor, tipo: tipo, hora: date, cuerpo: cuerpo}
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

/**
 * Devuelve un array con el formato necesario para crear el XML de inicio de Tienda, para propositos
 * de comprobacion de conexion
 */
function mockPrepareTienda(){
  return {producto: [{nombre: 'p1', cantidad: '1'}, {nombre: 'p2', cantidad: '2'}, {nombre: 'p3', cantidad: '3'}, {nombre: 'p4', cantidad: '4'}]}
}

/**
 * Devuelve un array con el formato necesario para crear el XML de inicio de Cliente, para propositos
 * de comprobacion de conexion
 */
function mockPrepareCliente(){
  var productos = [{nombre: 'p1', cantidad: '1'}, {nombre: 'p2', cantidad: '2'}, {nombre: 'p3', cantidad: '3'}, {nombre: 'p4', cantidad: '4'}]
  var tiendas = [{ip: '192.168.1.1', puerto: '80', id: '1'}, {ip: '192.168.1.2', puerto: '80', id: '2'}, {ip: '192.168.1.3', puerto: '80', id: '3'}, {ip: '192.168.1.4', puerto: '80', id: '4'}]
  return {producto: productos, tienda: tiendas}
}

module.exports = { prepareSimulation, launchSimulation, stopSimulation, construirXML, mockPrepareTienda, mockPrepareCliente}
