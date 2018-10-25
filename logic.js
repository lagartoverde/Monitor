const {clientes, tiendas} = require('./store.js');
const handlebars = require('handlebars');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);


function prepareSimulation() {
  console.log('Simulacion preparada');
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
async function construirCabecera(emisor, receptor, tipo, hora, plantilla, datos){
  const data = await readFile('xml/plantillaCabecera.hbs','utf8')
  var template = handlebars.compile(data)
  var cuerpo = await construirXML(plantilla, datos)
  var context = {emisor: emisor, receptor: receptor, tipo: tipo, hora: hora, cuerpo: cuerpo}
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