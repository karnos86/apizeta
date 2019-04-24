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
  			<button class="delete" v-on:click="close()"></button>
		</modal>
		<!-- <button class="button is-primary" v-on:click="show()"> abrir</button> -->
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
				axios.get(url+'/customer/search/worpress/'+id, config)
				.then(done=>{
					console.log(done)
					this.$modal.show('dialog');
				})
				.catch(error=>console.log(error))
			}

		}
		
	};
</script>