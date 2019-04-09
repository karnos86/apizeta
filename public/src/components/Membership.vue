<template>
	<div class="column  is-offset-2">
		<table class="table is-striped">
			<thead>
				<tr>
					<td><b>Code</b></td>
					<td><b>Pago</b></td>
					<td><b>Suscripción</b></td>
					<td><b>Inicio</b></td>
					<td><b>Fin</b></td>
					<td><b>Estado</b></td>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(membership, index) in memberships">
					<td><span>{{membership.idConekt}}</span></td>
					<td>{{membership.method}}</td>
					<td>{{membership.subscription}}</td>
					<td >{{ membership.start | moment("DD/MM/YYYY, h:mm:ss a") }}</td>
					<td >{{ membership.end | moment("DD/MM/YYYY, h:mm:ss a") }}</td>
					<td >{{membership.paid}}</td>
				</tr>
			</tbody>
		</table>
		<modal name="dialog">
  			<button class="delete" v-on:click="close()"></button>
		</modal>
		<button class="button is-primary" v-on:click="show()"> abrir</button>
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
				console.log(url+'/subscription/index')
				axios.get(url+'/subscription/index')
				.then((done)=>{
					console.log(done.data)
					this.memberships=done.data
				})
				.catch((error)=>{

				})
			},
			show(){
				this.$modal.show('dialog');
			},
			close(){
				this.$modal.hide('dialog');
			}
		}
		
	};
</script>