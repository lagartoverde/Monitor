const {clientes, tiendas} = require('./store.js');
const {getCliente, getTienda} = require('./store.js');
const handlebars = require('handlebars');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);


function prepareSimulation(numClientes, numTiendas, numProductos, listaProductos, rango) {

  const factorDesviacion = 10;
  var productosClientes = [];
  var productosTiendas = [];

  // Inicializar los arrays de tiendas y clientes
  var i;
  for (i = 0; i < numTiendas; i++) {
    productosTiendas.push([]);
  }

  for (i = 0; i < numClientes; i++) {
    productosClientes.push([]);
  }

  // Repartir la misma cantidad de productos a cada tienda y a cada cliente
  var indexTienda = 0;
  for (i = 0; i < numProductos; i++) {
    var prod = listaProductos[Math.floor(Math.random() * listaProductos.length)];
    var clienteRand = Math.floor(Math.random() * numClientes);

    addProducto(indexTienda, prod, productosTiendas);
    addProducto(clienteRand, prod, productosClientes);

    indexTienda = (indexTienda + 1) % numTiendas;
  }

  console.log('Simulacion preparada');

  return [productosTiendas, productosClientes];
}

function prodIndex(prod, list) {
    var x;
    var i = 0;
    for (x in list) {
        if (list[x].producto === prod) {
            return true;
        }
        i += 1;
    }

    return -1;
}

function addProducto(id, prod, lista) {

    var ind = prodIndex(prod, lista[id]);

    if (ind == -1) {
      lista[id].push({producto: prod, cantidad: 0});
    } else {
      lista[id][ind].cantidad += 1;
    }
}

function launchSimulation() {

  setTimeout(checkEveryoneIsOn, 10000);
  console.log('Simulacion lanzada');
}

function stopSimulation() {
  console.log('Simulacion parada')
}

async function construirXML(plantilla, datos){
  file = 'xml/' + plantilla +'.hbs'
  const data = await readFile(file,'utf8')
  var template = handlebars.compile(data)
  var html = template(datos);
  return new handlebars.SafeString(html)
}

//Llamar a esta funcion para construir las plantillas
//plantilla es un string con el nombre de la plantilla y datos un diccionario del tipo {param1: dato1...}
async function construirCabecera(emisor, receptor, tipo, plantilla, datos){
  const date = new Date()
  const data = await readFile('xml/plantillaCabecera.hbs','utf8')
  var template = handlebars.compile(data)
  var cuerpo = await construirXML(plantilla, datos)
  var context = {emisor: emisor, receptor: receptor, tipo: tipo, hora: date, cuerpo: cuerpo}
  var html = template(context);
  return html
}

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

module.exports = { prepareSimulation, launchSimulation, stopSimulation, construirCabecera}
