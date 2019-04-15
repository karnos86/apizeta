<template>
	 <div class="container separadorNews">
      <div class="columns">
        <div class="column is-offset-1">
          <div class="title is-5">
            <label class="label">Nuevo semanario</label>
          </div>
        </div>
      </div>
  		<form @submit.prevent="newspaper">
          <div class="columns">
            <div class="column is-4 is-offset-1">
              <div class="field">
                <label class="label">Código Semanario</label>
                <div class="control">
                  <input class="input" type="text" placeholder="ejemplo: A3241"  v-model="codigo">
                </div>
              </div>
            </div>
            <div class="column is-4">
              <div class="field">
                <label class="label">Fecha Semanario</label>
                  <div class="control">
                    <input class="input" type="text" placeholder="ejemplo: 02-2019"  v-model="fecha">
                  </div>
              </div>
            </div>
            <div class="column is-1">
              <p class="control">
                <button class="button is-primary crear" v-bind:class="{'is-loading': create == true }">
                  Crear
                </button>
              </p>
            </div>  
          </div>
  		</form>
  	</div>
</template>
<script>
  import axios from 'axios'
  import url from '../url'
  import bus from '../bus.js'
export default{
	data(){
		return{
			codigo: null,
			fecha: null,
      create:false,
		}
	},
  methods:{
    newspaper(){
      this.create=true;
      let config = {
        headers: {
          'Authorization': 'Bearer ' + localStorage.cookie
        }
      }; 
      let data = {code:this.codigo, date:this.fecha};
      axios.post(url+'/create/edition', data, config)
      .then((done)=>{
        this.create=false;
        this.$toastr.success('Operacion exitosa', 'Semanario creado');
        this.refresh()
      })
      .catch((error)=>{
        console.log(error)
        this.create=false;
        this.$toastr.error('Upss...!', 'Problemas al crear semanario');
      })
    },
    refresh() {
      this.codigo=null;
      this.fecha=null;
      bus.$emit("refresh");
    }

  }
};
</script>
<style>
  .crear{
    margin-top:2rem ;
  }
  .separadorNews{
    margin-bottom: 1rem;
    
  }
</style>