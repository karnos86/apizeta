<template>
  <v-container>
    <h1 class="subheading grey--text">Ediciones</h1>
      <v-card flat class="pa-3">
        <v-layout row wrap>
          <v-flex x12 md6 >
            <v-btn color="info"  @click=" create = !create">
              <v-icon class="pr-1">add</v-icon>
              <span class="caption font-weight-thin"> nueva edición</span>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card>
      <v-card flat>
          <v-alert :value="alert.value"  :type="alert.type" transition="scale-transition">
            {{alert.message}}
          </v-alert>
      </v-card>
      <v-card v-show="create==true" >
        <v-layout row wrap justify-center>
          <v-flex  xs12 md4 class="pl-2">
            <v-text-field v-model="semanario" :counter="10" label="Numero de semanario" required onkeyup="javascript:this.value=this.value.toUpperCase();"></v-text-field>
          </v-flex>
          <v-flex xs12  md4 class="pl-2">
            <v-menu ref="menu" v-model="menu"  :close-on-content-click="false"  :nudge-right="40" :return-value.sync="date" lazy
              transition="scale-transition"  offset-y  full-width  max-width="290px"  min-width="290px" >
              <template v-slot:activator="{ on }">
    
                <v-text-field v-model="computedDateFormatted" label="Seleccione fecha" prepend-icon="event"  readonly   v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="date" type="month" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
              </v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs12  md2 class="pl-2">
              <v-btn color="success" :loading="loading"  :disabled="loading"  @click="createdNews()" >
                <v-icon class="pr-1 font-weight-thin">save</v-icon>
                <span class="caption font-weight-thin"> Guardar</span>
              </v-btn>
          </v-flex>
        </v-layout>
      </v-card >
      <v-card flat>
        <v-layout row wrap justify-end>
          <v-flex  xs12 md4 class="pl-2">
            <v-text-field class="px-3" v-model="search"   label="busqueda de semanario" single-line append-icon="search" clearable>
            </v-text-field>
          </v-flex>
        </v-layout>
      </v-card>
      <v-layout row wrap justify-center>
        <v-flex xs12 sm10 md8 >
          <v-data-table :headers="headers" :items="desserts"  class="elevation-1" :search="search" :key="username">
            <template v-slot:items="props">
              <td>{{ props.item.code }}</td>
              <td class="text-xs-center">{{ props.item.date }}</td>
              <td class="text-xs-center">
                <v-btn v-show="props.item.front == null" color="primary" flat @click="showFront(props.item.code)" >
                  <v-icon>cloud_upload</v-icon>
                </v-btn>
                <v-card class="my-1" v-if="props.item.front != null" flat>
                  <v-layout row wrap justify-center  align-center>
                    <v-flex xs5 md5 >
                      <v-img class="my-1" :src=props.item.front  max-width="70" max-widtstateless position="center"></v-img>
                    </v-flex>
                    <v-flex xs1 md1 class="ml-3"> 
                      <v-icon small color="grey" @click="removeFront(props.item.code)"> clear  </v-icon>
                    </v-flex>
                  </v-layout>
                </v-card>
              </td>
              <td class="text-xs-center"> 
                <v-btn v-show="props.item.document == null" color="primary" flat @click="showDocument(props.item.code)" >
                  <v-icon>cloud_upload</v-icon>
                </v-btn>
                <v-card class="my-1" v-show="props.item.document != null" flat>
                  <v-layout row wrap justify-center  align-center>
                    <v-flex xs5 md5 >
                      <v-img class="my-1" :src="require('@/assets/logo_pdf.jpg')" max-width="70"  position="center"></v-img>
                    </v-flex>
                    <v-flex xs1 md1 class="ml-3" >
                      <v-icon small color="grey" @click="removeDocument(props.item.code)"> clear  </v-icon>
                    </v-flex>
                  </v-layout>
                  </v-card>
              </td>
              <td >
                <v-icon   @click="showDelete(props.item.code)" >
                  delete
                </v-icon>
              </td> 
            </template>
            <template v-slot:no-data>
              <v-alert :value="true" color="warning" icon="warning">
                No hay registro disponibles
              </v-alert>
            </template>
            <template v-slot:no-results>
              <v-alert :value="true" color="error" icon="warning">
                El semanario " {{ search }} " no esta registrado
              </v-alert>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    <!-- modal de carga de imagenes y pdf -->
    <v-dialog v-model="front.value" max-width="600" :key="code">
      <v-card>
        <v-card-title class="headline">Seleccione la imagen de la Portada</v-card-title>
        <v-card-text>
         {{front.code}}
         <v-text-field label="Seleccione imagenes .JPG .PNG .JPEG " prepend-icon="attach_file" v-model="filename" @click="$refs.front.click()"></v-text-field>
          <input v-show="false" ref="front" type="file" @change="handleFrontUpload" accept="image/*">
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="info" flat @click="cancel" >
            Cancelar
          </v-btn>
          <v-btn color="info" flat @click="upload(front.code)" :disabled="!filename">
            Subir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="document.value" max-width="600" :key="code">
      <v-card>
        <v-card-title class="headline">Seleccione el PDF del semanario {{document.code}}</v-card-title>
        <v-card-text>
         <v-text-field label="Seleccione el Pdf" prepend-icon="attach_file" v-model="filename" @click="$refs.document.click()"></v-text-field>
          <input v-show="false" ref="document" type="file" @change="handleSemanarioUpload" accept="application/pdf" >
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="info" flat @click="cancel" >
            Cancelar
          </v-btn>
          <v-btn color="info" flat @click="upload(document.code)" :disabled="!filename">
            Subir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirm.value" max-width="600" :key="code">
      <v-card>
        <v-card-title class="headline">Eliminar Semanario {{confirm.code}}</v-card-title>
        <v-card-text>
          <span class="body-2"> Escribar la Palabra <b>ELIMINAR</b> para continuar.</span>
         <v-text-field label="" prepend-icon="delete" v-model="option"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="info" flat @click="cancel" >
            Cancelar
          </v-btn>
          <v-btn color="info" flat @click="removeNewspaper(confirm.code)" :disabled="validateInfo">
            Acceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import axios from 'axios'
import {backend} from '../plugins/url'
import {auth, authFile} from '../plugins/headers'
export default {
  data(){
    return{
      headers: [
        { text: 'Semanario', value: 'code' },
        { text: 'Fecha', value: 'date' },
        { text: 'Img Portada', value: 'front' },
        { text: 'Pdf Semanario', value: 'document' },
        { text: 'Acccion', value: 'code', sortable: false }
      ],
      desserts:[],
      front:{value:false, code:''},
      document:{value:false, code:''},
      confirm:{value:false, code:''},
      reset:{value:false, code:'' },
      alert:{value:false, type:null, message:null},
      datafile:{},
      filename:null,
      search:'',
      create:false,
      date:null,
      loading:false,
      option:''
    }
  },
  computed: {
    computedDateFormatted () {
      return this.formatDate(this.date)
    },
    validateInfo(){
      return this.validate()
    }
  },
  created(){
    this.listNewspaper()
  },
  methods:{
    formatDate (date) {
      if (!date) return null
      const [year, month] = date.split('-')
      return `${month}-${year}`
    },
    createdNews(){
        this.loading = !this.loading
        let data = {code:this.semanario, date:this.formatDate(this.date)};
        axios.post(backend+'/create/edition', data, auth)
        .then(()=>{
          this.semanario=null
          this.loading = !this.loading
          this.sendAlert('success', 'El semanario se creo exitosamente!')
          this.listNewspaper()
        })
        .catch(()=>{ 
          this.loading = !this.loading
          this.sendAlert('error', 'Problemas al crear nuevo semanario!')
        })
    },
    listNewspaper(){
      axios.get(backend+'/list/edition', auth)
			.then((done)=>{
        this.desserts=done.data;
			})
			.catch(()=>{
				this.sendAlert('error', 'Problemas al listar semanarios!')
			})
    },
    showFront(data){
      this.front={value:true, code:data}
    },
    showDocument(data){
      this.document={value:true, code:data}
    },
    showDelete(data){
      this.confirm={value:true, code:data}
    },
    validate(){
      if(this.option === 'ELIMINAR'){
        return false
      }else{
        return true
      }
    },
    cancel(){
      this.front=this.reset
      this.document=this.reset
       this.filename=null
       this.confirm==this.reset;
    },
    handleFrontUpload(e){ 
      const data = e.target.files[0]
      if(data.type == "image/jpeg" || data.type=="image/png"){
        this.datafile = data;
        this.filename = data.name;
      }else{
        this.sendAlert('warning', 'Formato no permitido intento nuevamente')
      }
    },
    handleSemanarioUpload(e){ 
      const data = e.target.files[0]
      if(data.type == "application/pdf"){
      	this.datafile = data;
        this.filename = data["name"];
      }
    },
    upload(code){ 
      this.front=this.reset
      this.document=this.reset
      let file = new FormData();
      file.append('file', this.datafile);
      this.datafile={}
      this.filename=null;
      axios.post(backend+'/uploadFile/'+code,file,authFile)
      .then(()=>{
        this.sendAlert('success', 'El archivo se cargo exitosamente!');
        this.listNewspaper()
      })
      .catch(()=>this.sendAlert('error', 'Problemas al cargar el archivo!'))
    },
    removeFront(code){
      axios.get(backend+'/remove/front/'+code, auth)
      .then(()=>{
       
        this.sendAlert('success', 'Imagen se elimino exitosamente!')
        this.listNewspaper()
      })
      .catch(()=>{
        this.sendAlert('error', 'Problemas al eliminar el archivo!')
      })
    },
    removeDocument(code){
      axios.get(backend+'/remove/document/'+code, auth)
      .then(()=>{
        this.sendAlert('success', 'PDF se elimino exitosamente!')
        this.listNewspaper()
      })
      .catch(()=>{
        this.sendAlert('error', 'Problemas al eliminar el archivo!')
      })	
    },
    removeNewspaper(code){
      this.confirm=this.reset
      this.option=''
			axios.get(backend+'/remove/edition/'+code, auth)
			.then(()=>{
        this.sendAlert('success', 'Semanario se elimino exitosamente!')
        this.listNewspaper()
			})
			.catch(()=>{
        this.sendAlert('error', 'Problemas al eliminar el Semanario!')
			})
    },
    sendAlert(type, message){
      this.alert={value:true, type:type, message:message}
      setTimeout(() => {
        this.alert= {value:false, type:null, message:null}
      }, 3000);

    }
  }
}
</script>

