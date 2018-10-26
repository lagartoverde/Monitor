const clientes = [];

let clienteID = 0;
function addCliente(cliente) {
  cliente.id = clienteID;
  clientes.push(cliente);
  clienteID++;
}

function getCliente(id) {
  return clientes.find((cliente) => cliente.id == id);
}

const tiendas = [];

let tiendaID = 0;
function addTienda(tienda) {
  tienda.id = tiendaID;
  tiendas.push(tienda);
  tiendaID++;
}

function getTienda(id) {
  return tiendas.find((tienda) => tienda.id == id);
}


const logs = [];

let logID = 0;
function addLog(log) {
  log.id = logID;
  logs.push(log)
  logID++;
}

function getLog(id) {
  return logs.find((log) => log.id == id)
}

module.exports = { clientes, tiendas, logs, addLog, getLog, addCliente, getCliente, addTienda, getTienda };