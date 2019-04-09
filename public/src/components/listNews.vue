<template>
	<div class="column  is-offset-2">
		<table class="table is-striped">
			<thead>
				<tr>
					<td><b>N°</b></td>
					<td><b>Semanario</b></td>
					<td><b>Mes - Año</b></td>
					<td><b>Portada</b></td>
					<td><b>Semanario</b></td>
					<td></td>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(newspaper, index) in newspapers">
					<td><span>{{index+1}}</span></td>
					<td>{{newspaper.code}}</td>
					<td>{{newspaper.date}}</td>
					<td >
						<div class ="front" v-show="newspaper.front != null">
  							<button class="delete is-small" v-on:click="removeFront(newspaper.code)"></button>
  							<figure class="image is-64x64 ">
  								<img :src="newspaper.front">
							</figure>
						</div>
						<div class="file" v-show="newspaper.front == null" v-on:click="resetFront(index)">
  							<label class="file-label">
    							<input class="file-input" type="file"  id="front" ref="front" v-on:change="handleFrontUpload(index)"/>
    							<span class="file-cta">
    							  <span class="file-icon">
    							    <i class="fas fa-upload"></i>
    							  </span>
    							  <span class="file-label">
    							    Choose a file…
    							  </span>
    							</span>
  							</label>
						</div>
						<div v-if="isvisible == index" class="botones">
							<button class="button is-success is-small" v-on:click="uploadFront(newspaper.code, index)"  >
								Guardar
							</button>
							<button class="button is-info is-small" v-on:click="resetFront(index)" >
								cancelar
							</button>
						</div>

					</td>
					<td>
						<div class="front" v-show="newspaper.document != null">
  							<button class="delete is-small"  v-on:click="removeDocument(newspaper.code)"></button>
  							<figure class="image is-64x64 ">
  								<img src="../assets/imagen/logo_pdf.jpg">
							</figure>
						</div>	
						<div class="file" v-show="newspaper.document == null"  v-on:click="resetSemanario(index)" >
  							<label class="file-label" >
    							<input class="file-input" type="file" id="document" ref="document" v-on:change="handleSemanarioUpload(index)"/>
    							<span class="file-cta">
    							  <span class="file-icon">
    							    <i class="fas fa-upload"></i>
    							  </span>
    							  <span class="file-label">
    							    Choose a file…
    							  </span>
    							</span>
  							</label>
						</div>
						<div v-if="isvisibleD == index" class="botones">
							<button class="button is-success is-small" v-on:click="uploadSemanario(newspaper.code, index)"  >
								Guardar
							</button>
							<button class="button is-info is-small" v-on:click="resetSemanario(index)" >
								cancelar
							</button>
						</div>
					</td>
					<td>
  						<button class="is-small is-danger button" v-on:click="removeNewspaper(newspaper.code)"> Elliminar</button>
					</td>
				</tr>
			</tbody>
		</table>	
	</div>
</template>
<script>
	import axios from 'axios'
	import url from '../url'
	import bus from '../bus.js'

	export default {
		data(){
			return {
				newspapers:[],
				document:[],
				portada:[],
				isvisible:null,
				isvisibleD:null
			}
		},
		created: function(){
			this.indexNews()
			this.refreshIndex()
		},
		methods: {
			indexNews(){
				console.log(url+'/list/edition')
				let config = {
    				headers: {
      					'Authorization': 'Bearer ' + localStorage.cookie
    				}
  				}
				axios.get(url+'/list/edition', config)
				.then((done)=>{
					console.log(done.data);
					this.newspapers=done.data;
					this.portada = Array(done.data.length).fill(null);
					this.document = Array(done.data.length).fill(null);
			
				})
				.catch((error)=>{
					console.log(error);
				})

			},
			removeNewspaper(id){
				axios.get(url+'/remove/edition/'+id)
				.then((done)=>{
					this.$toastr.success('Operacion exitosa', 'Se eliminio semanario con exito!');
					this.indexNews();
				})
				.catch((error)=>{
					this.$toastr.error('Upss...', 'Problemas para eliminar semanario');
					console.log(error);
				})
			},
			refreshIndex() {
                bus.$on('refresh', ($event) => {
                    this.indexNews(); //update todo
                })
            },
            handleFrontUpload(i){    
            	if(this.$refs.front[i].files[0].type=="image/jpeg" || this.$refs.front[i].files[0].type=="image/png"){
            		this.portada[i]= this.$refs.front[i].files[0];
            		this.isvisible=i
            	}else{
            		this.$toastr.warning('Upss...', 'Tipo Archivo no permitido');
            	}

            },
            uploadFront(code, i){
            	let formData = new FormData();
            	formData.append('file', this.portada[i]);
            	console.log(formData)
            	axios.post(url+'/uploadFile/'+code,formData, {headers:{'Content-Type': 'multipart/form-data'}})
            	.then((done)=>{
            		this.indexNews()
 					this.$toastr.success('Operacion exitosa', 'Se cargo archivo con exito!');
 					this.resetFront()
 					

				})
				.catch((error)=>{
				 	this.$toastr.errpr('Upss...', 'Problemas para cargar archivo');
				 	this.resetFront()
				});
            },
            resetFront(i){
            	this.portada[i]=null;
            	this.isvisible=null;
            },
            handleSemanarioUpload(i){ 
          		console.log(this.$refs.document[i].files[0])   	
            	if(this.$refs.document[i].files[0].type=="application/pdf"){
            		this.document[i] = this.$refs.document[i].files[0];
            		this.isvisibleD = i
            	}else{
            		this.$toastr.error('Upss...', 'Tipo Archivo no permitido');
            	}

            },
            uploadSemanario(code, i){
 
            	let formData = new FormData();
            	formData.append('file', this.document[i]);
            	axios.post(url+'/uploadFile/'+code,formData, {headers:{'Content-Type': 'multipart/form-data'}})
            	.then((done)=>{
            		this.indexNews()
 					this.$toastr.success('Operacion exitosa', 'Se cargo archivo con exito!');
 					this.resetSemanario()
 					

				})
				.catch((error)=>{
				 	this.$toastr.error('Upss...', 'Problemas para cargar archivo');
				 	this.resetSemanario()
				});
            },
            resetSemanario(i){
            	this.document[i]=null;
            	this.isvisibleD=null;
            },
            removeFront(code){
            	axios.get(url+'/remove/front/'+code)
            	.then((done=>{
            		this.indexNews()
            		this.$toastr.success('Operacion exitosa', 'Se eliminio archivo con exito!');
            		

            	}))
            	.catch((error)=>{
            		this.$toastr.error('Upss...', 'Problemas para eliminar archivo');
            	})
            },
            removeDocument(code){
            	axios.get(url+'/remove/document/'+code)
            	.then((done=>{
            		this.$toastr.success('Operacion exitosa', 'Se eliminio archivo con exito!');
            		this.indexNews()

            	}))
            	.catch((error)=>{
            		this.$toastr.error('Upss...', 'Problemas para eliminar archivo');
            	})	
            }
		}
	};
</script>
<style>
	.botones{
		margin-top: 0.5rem;
		margin-left: 1rem;
	}
	.front{
		display: flex;
	}	
	figure{
		padding-left: 0.3rem;
	}
	
</style>


<!-- 	<div class="container">
		<div class="colums is-12"> <h3 class="title"> Lista de semanario</h3></div>
		<div class="columns" v-for="newspaper in newspapers">
			<div class="column is-2 "><span>{{newspaper.code}}</span></div>
			<div class="column is-2"><span>{{newspaper.date}}</span></div>
			<div class="column is-3">
				<span v-show="newspaper.document == null">{{newspaper.front}}</span>
				<button is-danger >Cargar</button>

			</div>
			<div class="column is-3"><span v-show="newspaper.document != null">Documento cargado</span></div>
			<div class="column is-1" v-on:click="removeNewspaper(newspaper.code)">X</div>
		</div>	
	</div> -->