const Newspaper = require('../models/Newspaper');
const path = require('path');
const fs = require('fs');
module.exports={
	async createNewspaper(req, res){
		try{
			let news = req.body
			let done = await Newspaper.create(news);
			res.json("Done...");
		}catch(error){
			console.log(error)
			res.status(500).json(error)
		}
	},
	async indexNewspaper(req, res){
		try{
			let index = await Newspaper.findAll({where:{front:{$ne: null}, document:{$ne: null}} , order:[['code','DESC']], limit: 4 });
			res.json(index)
		}catch(error){
			console.log(error)
			res.status(500).json(error)
		}
	},
	async imagenSplash(req, res){
		try{
			let imagen = await Newspaper.findAll({where:{front:{$ne: null}}, attributes: {exclude:['document'] },order:[['code','DESC']], limit: 1 });
			res.json(imagen)
		}catch(error){
			res.status(500).json(error)
		}
	},	
	async searchMonth(req, res){
		try{
			let data = req.body
			let index = await Newspaper.findAll({where:{date:data.date, front:{$ne: null}, document:{$ne: null}}, order:[['code','ASC']]});
			res.json(index)
		}catch(error){
			res.status(500).json(error)
		}
	},
	async indexAll(req, res){
		try{
			let index = await Newspaper.findAll({order:[['code','DESC']]});
			res.json(index)
		}catch(error){
			console.log(error)
			res.status(500).json(error)
		}
	}, 
	async deleteNewspaper(req, res){
		try{
			let code= req.params.code
			let newspaper = await Newspaper.findById(code)
			if(newspaper.front != null){
				var fileName = newspaper.front.split("/");
				var file =  path.join(path.resolve("."), 'documents/imagen/',fileName.pop())
				if(fileExists(file)) {
    				fs.unlinkSync(file);	
  				}
			}
			if(newspaper.document != null){
				var fileName2 = newspaper.document.split("/");
				var file2 =  path.join(path.resolve("."), 'documents/semanario/',fileName2.pop())
				if(fileExists(file)) {
					fs.unlinkSync(file2);
    			}
			}
			await newspaper.destroy();
			res.json(true)
		}catch(error){
			console.log(error)
			res.status(500).json(error)
		}
	},
	async deleteFront(req,res){
		try{
			let code= req.params.code
			let newspaper = await Newspaper.findById(code)
			if(newspaper.front != null){
				var fileName = newspaper.front.split("/");
				var file =  path.join(path.resolve("."), 'documents/imagen/',fileName.pop())
				if(fileExists(file)) {
    				fs.unlinkSync(file);
    				await newspaper.update({front:null});
    				res.json(true)
  				}
			}

		}catch(error){
			console.log(error);
			res.status(500).json(error)
		}
	}, 
	async deleteDocument(req,res){
		console.log("controlador");
		try{
			let code= req.params.code
			let newspaper = await Newspaper.findById(code)
			if(newspaper.document != null){
				var fileName = newspaper.document.split("/");
				var file =  path.join(path.resolve("."), 'documents/semanario/',fileName.pop())
				if(fileExists(file)) {
    				fs.unlinkSync(file);
    				await newspaper.update({document:null});
    				res.json(true)
  				}
			}

		}catch(error){
			console.log(error);
			res.status(500).json(error)
		}
	}
}
async function fileExists(filename){
  try{
    fs.accessSync(filename)
    return true;
  }catch(e){
    return false;
  }
}