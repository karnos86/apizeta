const User = require('../models/User')
const bcrypt = require('bcrypt');

module.exports={
	async create(req, res){
		try{
			let data = req.body;
			data["username"] = req.body.username.toLowerCase()
			let hash = bcrypt.hashSync(infoBack["password"], 10);
            data["password"] = hash;
            let user = await User.create(data);
            res.json(true);
		}catch(error){
			console.log(error)
			res.status(500).json(error);

		}

	},
    async index(req, res){
        try {
            var users = await User.findAll();
            res.json(users)
        } catch (error) {
            res.error(error)
        }
    }
}


