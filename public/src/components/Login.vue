<template>
		<div class="container separadorLogin ">
			<div class="columns">
				<div class="column is-one-third is-offset-one-third">
					<form @submit.prevent="login">
						<div class="field">
  							<label class="label">Username</label>
  							<div class="control">
                  <!-- is-success -->
  							  <input class="input" type="text" placeholder="Escriba usuario adminstrador de wordprress"  v-model="username">
  							</div>
  							<!-- <p class="help is-success">This username is available</p> -->
						</div>
						<div class="field">
						  	<label class="label">Password</label>
						  	<div class="control">
                  <!-- is-danger -->
						    	<input class="input" type="password" placeholder="Escriba clave adminstrador de wordprress" v-model="password">
						 	</div>
						 	<!-- <p class="help is-danger">This email is invalid</p> -->
						</div>
						<div class="field">
		  					<p class="control">
		  					  <button class="button is-info is-fullwidth"  :disabled="!password || !username">
		  					    Login
		  					  </button>
		  					</p>
		  				</div>
		  				<p v-if="error" class="help is-danger">{{message}}</p>
					</form>
				</div>
			</div>
		</div>
</template>
<script>
import axios from 'axios';
import url from '../url';
import bus from '../bus.js'
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
        this.$toastr.info('Valiadando Información!', 'por favor espere ...!');
        let config = {
            headers: {
              'Access-Control-Allow-Origin': '*'

            }
          };
        let data = {username:this.username, password: this.password}
        axios.post('https://zetatijuana.com/wp-json/jwt-auth/v1/token',data)
        .then(done=>{
          console.log(done)
          this.$toastr.success('Valiación Exitosa!', 'Información de acceso correctos');

        })
        .catch(error=>{
          this.$toastr.error('Upps !', 'Información de acceso incorrectos');
          console.log(error)

        })





      	// axios.post(url+'/ctl/login', data)
      	// .then((done)=>{
       //    if(done.data.status === 'error'){
       //      this.$toastr.error('Upps !', 'Información de acceso incorrectos');
       //      this.error = true;
       //      this.message = done.data.message;
       //    }else{
       //      console.log('done',done.data.message)
       //      let cookie = done.data.cookie
       //      localStorage.cookie=cookie
       //      bus.$emit("login");
       //      this.$toastr.success('Valiación Exitosa!', 'Información de acceso correctos');
       //      this.$router.push('/')
       //    }
      	// })
      	// .catch((err)=>{
       //    this.$toastr.error('Upps !', err.message);
       //    console.log(err);
      	// 	this.message =err.message;
      	// 	this.error = true;
       //    setTimeout(()=>{ this.error = false; }, 6000);	
      	// })
      }
    }
  };
</script>
<style>
.error {
  color: red;
}
.separadorLogin{
  margin-top: 6rem;
 }
 .is-background{
    background: rgba(23,45,67, 0.8);
    border-radius: 4px;

 }
 .is-color{
    color:#fff;
 }

</style>