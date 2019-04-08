const path = require('path');
const fs = require('fs');
const Newspaper = require('../models/Newspaper');

module.exports ={
	async uploadFile(req, res){
		try{
			var userIP = req.socket.remoteAddress;
			let EDFile = req.files.file;
			let proceso = EDFile.name.split(".");
			let ext =proceso.pop()
			var targetHost = process.env.CNAME_API;
			let code = await Newspaper.findById(req.params.code);
			switch(req.files.file.mimetype){
				case "application/pdf":
    				await EDFile.mv(path.resolve(".")+'/documents/semanario/'+ req.params.code +'.'+ ext)
    				await code.update({document:targetHost+'/api/downloadFile/'+ req.params.code +'.'+ ext})
    				res.status(200).send({ message : 'File upload' })
					break;
				case "image/jpeg":

					await EDFile.mv(path.resolve(".")+ '/documents/imagen/'+ req.params.code +'.'+ ext)
					await code.update({front:targetHost+'/api/downloadImagen/'+ req.params.code  +'.'+ ext})
					res.status(200).send({ message : 'File upload' })
					break;
				case "image/png":

					await EDFile.mv(path.resolve(".")+'/documents/imagen/'+ req.params.code +'.'+ ext)
					await code.update({front:targetHost+'/api/downloadImagen/'+ req.params.code  +'.'+ ext})
					res.status(200).send({ message : 'File upload' })
					break;
				default:
					res.status(403).send({ message : 'formanto no permitido' })
					break
			}
		}catch(error){
			console.log(error)
				res.status(500).send(error)
		}
	},
	async downloadFile(req, res){
		try{
			var fileName = req.params.file;
			var file =  path.join(path.resolve("."), 'documents/semanario/',fileName)
			if(fileExists(file)) {
    			res.download(file)
  			}
		}catch(error){
			console.log(error)
			if(error.code === "ENOENT"){
				res.status(404).json({mesaage:'archivo no existe'})
			}
			res.status(500).send(error)
		}	
	},

	async downloadImagen(req, res){
		try{
			var fileName = req.params.filename;
			var file =  path.join(path.resolve("."), 'documents/imagen/',fileName)
			if(fileExists(file)) {
    			res.download(file)
  			}
		}catch(error){
			console.log(error)
			if(error.code === "ENOENT"){
				res.status(404).json({mesaage:'archivo no existe'})
			}
			res.status(500).send(error)
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


