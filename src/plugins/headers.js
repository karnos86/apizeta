module.exports={
    basic:{
        headers: {
            'Content-Type': 'application/json ',
            'charset':'UTF-8'
        }
    },
    auth:{
        headers:{
            'Content-Type': 'application/json ',
            'charset':'UTF-8',
            'Authorization': 'Bearer '+localStorage.cookie
        }
    },
    authFile:{
        headers:{
            'Content-Type': 'multipart/form-data', 
            'Authorization': 'Bearer '+localStorage.cookie
        }
    }

}