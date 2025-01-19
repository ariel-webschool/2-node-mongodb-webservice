const express = require('express')
const router = express()

var UsersController = require('./controllers/UsersController.js')

router.post('/users', UsersController.store) // Ajouter un utilisateur
router.get('/users', UsersController.find) // Lister tous les utilisateurs
router.get('/users/:id', UsersController.findOne) // Recuperer un utilisateur specifique.
router.delete('/users/:id', UsersController.destroy) // Supprimer un utilisateur
router.put('/users/:id', UsersController.update) // Modifier un utilisateur

module.exports = router