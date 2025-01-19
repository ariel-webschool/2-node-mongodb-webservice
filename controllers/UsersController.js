var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
var Users = require('../models/Users.js')

class UsersController {

	static async store(req, res) {
		const user = req.body
		const response = await Users.store(user)
		res.status(response.code).json(response)
	}

	static async find(req, res) {

		let client = await MongoClient.connect(url);
		let dbo = client.db('webschool');
		let users = await dbo.collection("users").find().toArray();
		console.log(users)

		res.status(200).json({ users: users })
	}

	static async findOne(req, res) {
		const { id } = req.params

		let client = await MongoClient.connect(url);
		let dbo = client.db('webschool');
		let user = await dbo.collection("users").findOne({ id: parseInt(id) });

		if (user) res.status(200).json({ user: user })
		else res.status(404).json({ message: "User not found !" })
	}

	static async destroy(req, res) {
		const { id } = req.params
		var client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		let dbo = client.db('webschool');

		try {
			
			console.log({id: parseInt(id)});
			const result = await dbo.collection("users").findOneAndDelete({ id: parseInt(id) });

			
			if (result.id) {  // Si un utilisateur a été supprimé
				res.status(200).json({ message: "User removed with success !", user: result.id });
			} else {  // Si l'utilisateur n'a pas été trouvé
				res.status(404).json({ message: "User not found !" });
			}

		} catch (err) {
			console.log(err)
			res.status(500).json({ message: "Error deleting user..." })
		} finally {
			client.close()
		}
	}

	static async update(req,res) {
		const { id } = req.params
		try {
			let client = await MongoClient.connect(url);
			let dbo = client.db('webschool');
			let userUpdated = await dbo.collection("users").findOneAndUpdate({ id: parseInt(id) },{ $set: {email: req.body.email}});

			if (userUpdated.value) {
				res.status(200).json({ message: "User updated with success !", user: userUpdated.value })
			}
			else res.status(404).json({ message: "User not found !" })

			client.close()
		} catch (err) {
			console.log(err)
			res.status(500).json({ message: "Error updating user..." })
		}
	}
}

module.exports = UsersController