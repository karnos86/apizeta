<template>
	<section>
		<div class="container">
			<div class="columns">
				<div class="column is-one-third is-offset-one-third">
					<form @submit.prevent="login">
						<div class="field">
  							<label class="label">Username</label>
  							<div class="control">
  							  <input class="input is-success" type="text" placeholder="Ingrese usuario"  v-model="username">
  							</div>
  							<p class="help is-success">This username is available</p>
						</div>
						<div class="field">
						  	<label class="label">Password</label>
						  	<div class="control">
						    	<input class="input is-danger" type="password" placeholder="password" v-model="password">
						 	</div>
						 	<p class="help is-danger">This email is invalid</p>
						</div>
						<div class="field">
		  					<p class="control">
		  					  <button class="button is-primary">
		  					    Login
		  					  </button>
		  					</p>
		  				</div>
		  				<p v-if="error" class="error">{{message}}</p>
					</form>
				</div>
			</div>
		</div>
	</section>
</template>
<script>
import axios from 'axios';
import url from '../url';
  export default {
    data () {
      return {
        username: '',
        password: '',
        error: false,
        message:''
      }
    },
    methods: {
      login () {
        let data = {username:this.username, password: this.password}
      	axios.post(url+'/ctl/login', data)
      	.then((done)=>{
      		console.log(done.data)
          if(done.data.status === "error"){
            this.error = true;
            this.message =done.data.message;
          }else{
            console.log('done',done.data.message)
            let cookie = done.data.cookie
            localStorage.cookie=cookie
            console.log('cookie', cookie)
            this.$router.push('/')
          }
      	})
      	.catch((err)=>{
          console.log(err);
      		this.message =err.message;
      		this.error = true;
      		
      	})
      }
    }
  };
</script>
<style>
.error {
  color: red;
}
</style>