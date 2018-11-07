//Estructura interna de la interfaz web, donde almacenar consumidores, tiendas y logs
const clientes = [];
let clienteID = 0;

/**
 * Se especifica un id unico para cada consumidor y se añade al array de clientes
 * @param {Agente cliente} cliente 
 */
function addCliente(cliente) {
  cliente.id = clienteID;
  clientes.push(cliente);
  clienteID++;
}

/**
 * Dado el ID unico del consumidor, se puede recuperar el consumidor de la lista
 * @param {ID unico del consumidor} id 
 */
function getCliente(id) {
  return clientes.find((cliente) => cliente.id == id);
}

const tiendas = [];
let tiendaID = 0;

/**
 * Se especifica un id unico para cada tienda y se añade al array de tiendas
 * @param {Agente tienda} tienda 
 */
function addTienda(tienda) {
  tienda.id = tiendaID;
  tiendas.push(tienda);
  tiendaID++;
}

/**
 * Dado el ID unico de la tienda, se puede recuperar la tienda de la lista
 * @param {ID unico de la tienda} id 
 */
function getTienda(id) {
  return tiendas.find((tienda) => tienda.id == id);
}


const logs = [];
let logID = 0;

/**
 * Se especifica un id unico para cada log y se añade al array de logs
 * @param {Mensaje de log} tienda 
 */
function addLog(log) {
  log.id = logID;
  logs.push(log)
  logID++;
}

/**
 * Dado el ID unico del log, se puede recuperar el log de la lista
 * @param {ID unico del log} id 
 */
function getLog(id) {
  return logs.find((log) => log.id == id)
}

module.exports = { clientes, tiendas, logs, addLog, getLog, addCliente, getCliente, addTienda, getTienda };