<template>
	<div class=" container separadorList">
		<div class="columns ">
        	<div class="column is-one-third is-offset-1">
          		<div class="field">
            		<label class="label">Semanario publicados</label>
          		</div>
    		</div>
    	</div>
	<div class="column  is-offset-2">
		<table class="table is-striped">
			<thead>
				<tr>
					<td class="is-2"><b>N°</b></td>
					<td class="is-2"><b>Semanario</b></td>
					<td  class="is-3"><b>Mes - Año</b></td>
					<td class="is-2" ><b>Portada</b></td>
					<td   class="is-2"><b>Semanario</b></td>
					<td  class="is-2" ></td>
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
  						<button class="is-small is-danger button" v-on:click="removeNewspaper(newspaper.code, index)"  v-bind:class="{'is-loading': delSemanario == index }"> Eliminar</button>
					</td>
				</tr>
			</tbody>
		</table>	
	</div>
		
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
				isvisibleD:null, 
				upFront:null,
				upDocument:null,
				delSemanario:null,
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
  				console.log('config=',config)
				axios.get(url+'/list/edition', config)
				.then((done)=>{
					this.newspapers=done.data;
					this.portada = Array(done.data.length).fill(null);
					this.document = Array(done.data.length).fill(null);
			
				})
				.catch((error)=>{
					console.log(error);
				})

			},
			removeNewspaper(id, index){
				this.delSemanario=index;
				console.log(this.delSemanario);
				let config = {
    				headers: {
      					'Authorization': 'Bearer ' + localStorage.cookie
    				}
  				}
				axios.get(url+'/remove/edition/'+id, config)
				.then((done)=>{
					this.$toastr.success('Operacion exitosa', 'Se eliminio semanario con exito!');
					this.indexNews();
				})
				.catch((error)=>{
					this.$toastr.error('Upss...', 'Problemas para eliminar semanario');
					this.delSemanario=null;
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
            	axios.post(url+'/uploadFile/'+code,formData, {headers:{'Content-Type': 'multipart/form-data',  'Authorization': 'Bearer ' + localStorage.cookie}})
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
            	axios.post(url+'/uploadFile/'+code,formData, {headers:{'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + localStorage.cookie}})
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
            	let config = {
    				headers: {
      					'Authorization': 'Bearer ' + localStorage.cookie
    				}
  				}
            	axios.get(url+'/remove/document/'+code, config)
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
	.separadorList{
		margin-top: 1rem;
		/*border-top: 1px solid black;*/
	}
	.separadorList .columns{
			margin-top: 1rem;
		}
	
</style>
