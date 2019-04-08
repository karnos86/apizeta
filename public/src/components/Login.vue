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
// import url from '../url'
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
    	let url = "https://zetatijuana.com/api/user/generate_auth_cookie/?username="+this.username+"&password="+this.password
    	console.log(url);
    	axios.get(url)
    	.then((done)=>{
    		console.log(done)
    		localStorage.token='3212ewqweq'
        this.$router.replace(this.$route.query.redirect || '/')
    	})
    	.catch((err)=>{
            console.log(err);
    		this.message =err.message;
    		this.error = true;
    		localStorage.token='3212ewqweq'
        this.$router.replace(this.$route.query.redirect || '/')
    	})
    }
  }
}
</script>
<style>
.error {
  color: red;
}
</style>