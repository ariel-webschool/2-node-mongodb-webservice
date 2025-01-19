var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";


class Users {

	static async store(user) {
		try {
			let client = await MongoClient.connect(url);
			let dbo = client.db('webschool');
			let count = await dbo.collection("users").countDocuments();
	
			// Gestion des id dans mon application.
			if (count == 0) user.id = 1
			else user.id = count + 1
	
			const userInserted = await dbo.collection("users").insertOne(user);
			client.close()
			if (userInserted.acknowledged) {
				return { code: 201,message: "User added!", user: user };
			} else {
				return { code: 400, message: "Error when inserted." }
			}
		} catch (error) {
			return { code: 500, message: "Error when inserted." }
		}
	}

	async update(id,user) {

	}

	async delete(id) {

	}

	async all() {

	}

	async findOne(id) {

	}

}

module.exports = Users