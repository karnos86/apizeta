<template>
	 <div id="news">
  		<!-- <div class="columns">
  			<div class="column is-one-third is-offset-one-third">
  				<form @submit.prevent="newspaper">
  					<div class="field">
  						<label class="label">Código Semanario</label>
  						<div class="control">
  							<input class="input" type="text" placeholder="ejemplo: A3241"  v-model="codigo">
  						</div>
  					</div>
  					<div class="field">
  						<label class="label">Fecha Semanario</label>
  						<div class="control">
  							<input class="input" type="text" placeholder="ejemplo: 02/2019"  v-model="fecha">
  						</div>
  					</div>
  					<div class="field">
		  				<p class="control">
		  				  <button class="button is-primary">
		  				    Crear
		  				  </button>
		  				</p>
		  			</div>

  				</form>
  			</div>
  		</div> -->
  		<create></create>
  		<index></index>



  	</div>
</template>
<script>
	import Create from './createNews';
	import Index from './listNews';
	export default{
		name:'news',
		data(){
			return{

			}
		},
		components:{
			Create,
			Index,
		}
	}
</script>