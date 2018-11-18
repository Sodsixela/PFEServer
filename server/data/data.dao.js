const mongoose = require('mongoose')
const DatabaseConnectionError = require('../utils/DatabaseError').DatabaseConnectionError
const DatabaseRequestError = require('../utils/DatabaseError').DatabaseRequestError
const EmptyResultError = require('../utils/DatabaseError').EmptyResultError

let usersDao = require('../users/users.dao')

const schema = mongoose.Schema;
const sensorSchema = new schema({
	x1:{type: String, required: true},
	y1:{type: String, required: true},
	z1:{type: String, required: true},
	x2:{type: String, required: true},
	y2:{type: String, required: true},
	z2:{type: String, required: true}
})
const dataSchema = new schema({
	idUser :{type: String, required: true},
	date   :{type: String, required: true},
	typeId :{type: String, required: true},
	sensors:[sensorSchema]
}, { collection: 'data' })

const modelData = mongoose.model("data", dataSchema);

let getData = async () => {
	return new Promise((resolve, reject) => {
	    try {
	    	modelData.find({}, function (err, data) {
	    		if (data.length < 1) { reject(new EmptyResultError("getData")) }
	      		resolve(data)
			})
	    } catch (e) {
	      reject(new DatabaseRequestError("getData", e.message))
	    }
	})
}

let getDataByIdUser = async (id) => {
	return new Promise((resolve, reject) => {
	    try {
	    	modelData.find({"idUser": id}, function (err, data) {
	    		if (data.length < 1) { reject(new EmptyResultError("getDataByIdUser")) }
	      		resolve(data)
			})
	    } catch (e) {
	      reject(new DatabaseRequestError("getDataByIdUser", e.message))
	    }
	})
}

let setData = async (data) => {
	return new Promise((resolve, reject) => {
	    try {
	    	let giletid =  data.giletid
	    	usersDao.getUserByIdGilet(giletid).then(function(id) {
		    	let idUser =  id.idUser
			    data.global.forEach(function(global) {
			      let date = data.global.date
			      global.data.forEach(function(data) {
			        let event = new modelData({
			          idUser : idUser,
			          date : global.date,
			          typeId : data.typeId,
			          sensors : data.sensors
			        })

			        event.save(function(err) {
			          	if (err) { reject(new DatabaseRequestError("setData", err)) }
		      			resolve("true")
			        })
			      })
			    })
	    	})
	    } catch (e) {
	      reject(new DatabaseRequestError("setData", e.message))
	    }
	})
}

module.exports = {
  getData, getDataByIdUser, setData
}
