const express = require('express')
const app = express()
const port = 3000
var fs = require('fs')
app.set('view engine', 'ejs');
app.set('views', './views');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";

// interprete la requete entrant (incoming request) JSON
app.use(express.json())
app.use(express.static('public'))

app.get('/', async function(req, res) {
	
	const client = await MongoClient.connect(url);
	const dbo = client.db('webschool');
	const users = await dbo.collection("users").find({}).toArray();
	console.log(users)
	res.status(200).json(users)
	
})

// exposer un fichier html sur une route particuliere
app.get('/me-contacter', (req,res) => {
	res.sendFile(__dirname + '/public/contact.html');
})

app.get('/ma-gallerie', (req,res) => {
	res.sendFile(__dirname + '/public/gallerie.html');
})

// creation d'un fichier html dynamique a partir de la list users.
app.get('/mes-utilisateurs', (req,res) => {
	res.render('utilisateurs',{users})
})


// METHOD HTTP | CHEMIN | TRAITEMENT 
// req => request => utilisateur il renvoie ses info a notre server
// res => response => reponse du server a l'utilisateur.
app.get('/contact/:name', (req, res) => {
	res.json({ name: req.params.name, phone: "0568392822" })
})

// Ajouter un utilisateur
app.post('/users', async (req, res) => {
	const user = req.body

	
	let client = await MongoClient.connect(url);
	let dbo = client.db('webschool');
	let count = await dbo.collection("users").countDocuments();
	
	// Gestion des id dans mon application.
	if (count == 0) user.id = 1
	else user.id = users.length + 1

	const userInserted = await dbo.collection("users").insertOne(user);
	console.log(userInserted)
	if(userInserted.acknowledged){
		res.status(201).json({ message: "User added!", user: user })
	} else {
		res.status(400).json({message: "Error when inserted."})
	}
})

// Lister tous les utilisateurs
app.get('/users', (req, res) => {
	res.status(200).json({ users: [...users] })
})

// Recuperer un utilisateur specifique.
app.get('/users/:id', (req, res) => {
	const { id } = req.params

	const user = users.filter(function (user) {
		if (parseInt(user.id) == parseInt(id)) return user
	})
	if (user.length != 0) res.status(200).json({ user: user[0] })
	else res.status(404).json({ message: "User not found !" })
})

// Supprimer un utilisateur
app.delete('/users/:id', (req, res) => {
	const { id } = req.params

	// recuperer l'utilisateur qu'on supprime
	const user = users.filter(function (user) {
		if (parseInt(id) === parseInt(user.id)) {
			return user;
		}
	})

	// on eneleve l'utilisateur de notre tableau
	users = users.filter(function (user) {
		if (parseInt(user.id) !== parseInt(id)) {
			return user;
		}
	})
	console.log(users)
	if (user.length !== 0) {
		saveUsersToFile()
		res.status(200).json({ message: "User removed with success !", user: user[0] })
	}
	else res.status(404).json({ message: "User not found !" })
})

// Modifier un utilisateur
app.put('/users/:id', (req, res) => {
	const { id } = req.params
	const { email } = req.body


	// recuperer l'utilisateur
	const user = users.filter(function (user) {
		if (parseInt(user.id) === parseInt(id)) {
			return user;
		}
	})

	if (user.length !== 0) {

		// modifier juste l'email du user demandee
		users.map(function (user) {
			if (parseInt(user.id) == parseInt(id)) {
				user.email = email;
			}
			return user;
		})
		saveUsersToFile()
		res.status(200).json({ message: "User updated with success !", user: user[0] })
	}
	else res.status(404).json({ message: "User not found !" })
})


// FAITES ATTENTION AU METHOD: GET, DELETE, PUT, POST
// 1. afficher tous les utilisateurs
// 2. supprimer les utilisateurs
// 3. update: modifier juste le mail de l'utilisateur
// 4. afficher un utilisateur en fonction du paramms: /users/2 recuperer l'utilisateur avec l'ID 2

// string: splice, slice, indexOf, substring, tolocaleLowerCase, toUpperCase
// array: map, filter, forEach, sort, every, some.
// condition: ternary: const isShowed = show ? true : false
// 					   isShowed ?? false
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})