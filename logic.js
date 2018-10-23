const {clientes, tiendas} = require('./store.js');

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

module.exports = { prepareSimulation, launchSimulation, stopSimulation}