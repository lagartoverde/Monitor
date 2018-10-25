const clientes = [];

const tiendas = [];

const logs = [];

let LogID = 0;
function addLog(log) {
  log.id = LogID;
  logs.push(log)
  LogID++;
}

function getLog(id) {
  return logs.find((log) => log.id == id)
}

module.exports = { clientes, tiendas, logs, addLog, getLog };