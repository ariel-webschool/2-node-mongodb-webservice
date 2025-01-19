const express = require('express')
const app = express()
const port = 3000
var fs = require('fs')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
var router = require('./router.js')
var cors = require('./middleware/cors.js')
app.use(express.json())
app.use(cors)
app.use('/', router);

app.get('/', async function(req, res) {
	
	const client = await MongoClient.connect(url);
	const dbo = client.db('webschool');
	const users = await dbo.collection("users").find({}).toArray();
	console.log(users)
	res.status(200).json(users)
	
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})