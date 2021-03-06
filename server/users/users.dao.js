const mongo = require('../mongo')

async function getAll (data) {
  	return mongo.all("users", data)
}

async function get (data) {
  	return mongo.get("users", data)
}

async function set (data) {
  	return mongo.insert("users", data)
}

async function update (id, data) {
  	return mongo.update("users", id, data)
}

async function updateAll (id, data) {
  	return mongo.updateAll("users", id, data)
}

async function remove (data) {
  	return mongo.remove("users", data)
}

async function join (model, query, data) {
  	return mongo.join("users", model, query, data)
}

module.exports = {
  	getAll, get, set, update, updateAll, remove, join
}
