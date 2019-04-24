<template>
	<div class="column  is-offset-2">
		<table class="table is-striped">
			<thead>
				<tr>
					<td><b>Usuario</b></td>
					<td><b>Refencia</b></td>
					<td><b>Pago</b></td>
					<!--<td><b>Suscripción</b></td>
					 <td><b>Inicio</b></td>
					<td><b>Fin</b></td> -->
					<td><b>Estado</b></td>
					
				</tr>
			</thead>
			<tbody>
				<tr v-for="(membership, index) in memberships">
					<td><span>{{membership.idWordPress}}</span></td>
					<td><span>{{membership.reference}}</span></td>
					<td>
						<figure class="image is-64x64" v-show="membership.method==='OXXO'">
  								<img src="../assets/imagen/oxxo.png">
						</figure>
						<figure class="image is-64x64" v-show="membership.method==='TDC'">
  								<img src="../assets/imagen/mastercard.png">
						</figure>
					</td>
					<!-- <td>{{membership.subscription}}</td>
					<td >{{ membership.start | moment("DD/MM/YYYY, h:mm:ss a") }}</td>
					<td >{{ membership.end | moment("DD/MM/YYYY, h:mm:ss a") }}</td> -->
					<td >{{membership.status}}</td>
					<td ><button class="button is-info" v-on:click="info(membership, index)"> detalle</button></td>
				</tr>
			</tbody>
		</table>
		<modal name="dialog">
  			<header class="modal-card-head">
    			<p class="modal-card-title">Detalle de Suscripción</p>
    			<button class="delete" aria-label="close" v-on:click="close()"></button>
    		</header>
    		<section class="modal-card-body">
      			<div class="customer">
					<div class="columns">
						<div class="column has-text-centered">
							<span class="title is-5">Informacion del Suscriptor</span>
						</div>
					</div>
					<div class="columns">
						<div class="column is-4">
  							<label class="label">Id worpress</label>
    						<input class="input" type="text" disabled v-model="details_Wordpress.id" >
						</div>
						<div class="column is-4">
  							<label class="label">Usuario</label>
    						<input class="input" type="text" disabled v-model="details_Wordpress.nickname" >
						</div>
						<div class="column is-4">
  							<label class="label">Display Name</label>
    						<input class="input" type="text" disabled v-model="details_Wordpress.displayname" >
						</div>
					</div>
					  

				</div> 
    		</section>
    		<footer class="modal-card-foot">
    		  <button class="button is-success">Save changes</button>
    		  <button class="button">Cancel</button>
    		</footer>	
		</modal>
		</div>
</template>
<script>
	import axios from 'axios'
	import url from '../url'
	import moment from 'moment'
	export default{
		data(){
			return{
				memberships:[],
				index:null,
				details_Wordpress:{
					avatar: null,
					displayname: null,
					firstname: null,
					id: null,
					lastname: null,
					nicename: null,
					nickname: null,
					status: null,
					url: null,
				},
				details_oxxo:{},
				details_tdc:{}

			}
		},
		created: function(){
			this.indexMemberships();
		},
		methods:{
			indexMemberships(){
				let config = {
    				headers: {
      					'Authorization': 'Bearer ' + localStorage.cookie
    				}
  				}
				console.log(url+'/subscription/index')
				axios.get(url+'/subscription/index', config)
				.then((done)=>{
					console.log(done.data)
					this.memberships=done.data
				})
				.catch((error)=>{

				})
			},
			info(detalle, posicion){
				console.log(detalle);
				console.log(posicion);
				this.customer(detalle.idWordPress)
				this.conekta(detalle)
				
			},
			close(){
				this.$modal.hide('dialog');
			},
			customer(id){
				console.log("if");
				let config = {
    				headers: {
      					'Authorization': 'Bearer ' + localStorage.cookie
    				}
  				}
				axios.get(url+'/customer/search/worpress/'+id , config)
				.then(done=>{
					this.details_Wordpress = done.data;
					this.$modal.show('dialog');
				})
				.catch(error=>console.log(error))
			},
			conekta(info){
				let config = {
    				headers: {
      					'Authorization': 'Bearer ' + localStorage.cookie
    				}
  				}
				axios.post(url+'/subscriptions/Conekta',info,config)
				.then(done=>{
					console.log(done.data);
				})
				.catch(error=>console.log(error))
			}

		}
		
	};
</script>