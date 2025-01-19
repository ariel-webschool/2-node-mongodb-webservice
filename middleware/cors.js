function cors(req,res,next) {
	  // Autoriser toutes les origines
	  res.header('Access-Control-Allow-Origin', '*');
  
	  // Autoriser les en-têtes spécifiés
	  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	  
	  // Autoriser les méthodes spécifiées
	  if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', '*');
		return res.status(200).json({});
	  }
	  
	  // Passer au middleware suivant
	  next();
}

module.exports = cors