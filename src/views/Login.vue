<template>
    <v-container >
        <v-layout justify-center align-center>
            <v-flex xs12 md5>
                <v-alert v-model="alert.value"  dismissible  :type="alert.type">
                    {{alert.message}}
                </v-alert>
            </v-flex>
        </v-layout>
        <v-layout row wrap justify-center align-end>
            <v-flex d-flex xs12 md5 >
                <v-card min-height="350">
                    <v-layout  row wrap justify-center align-content-center class="grey darken-4">
                        <v-flex md6  >
                            <v-img class="my-2" :src="require('@/assets/ZETA_Logo.png')" max-width="200"  position="center"></v-img>
                        </v-flex>
                    </v-layout>
                    <v-card-text class="my-4">
                        <v-text-field   
                        label="Usuario"   
                        prepend-inner-icon="perm_identity" 
                        :rules="[rules.required, rules.min]"
                        v-model="username"
                        ></v-text-field>
                    
                        <v-text-field
                            v-model="password"
                            :append-icon="show ? 'visibility' : 'visibility_off'"
                            :rules="[rules.required, rules.min]"
                            :type="show ? 'text' : 'password'"
                            name="input-10-1"
                            label="Contraseña"
                            hint="At least 8 characters"
                            counter
                            @click:append="show = !show"
                            prepend-inner-icon="lock"
                        ></v-text-field>
                    </v-card-text>
                    <v-card-accion>
                        <v-btn class="info text-none" block large @click="login">Iniciar sessión</v-btn>
                    </v-card-accion>
                     
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import axios from 'axios'
import {basic} from '../plugins/headers'
import{backend} from '../plugins/url'
export default {
    data(){
        return{
            alert:{value:false, type:null, message:null},
            reset:{value:false, type:null, message:null},
            password:null,
            username:null,
            show:false,
            rules: {
                required: value => !!value || 'Required.',
                // min: v => v.length >= 8 || 'Min 8 characters',
                emailMatch: () => ('The email and password you entered don\'t match')
            }
        }
    },
    created(){
      this.$forceUpdate(); 
    },
    methods:{
        login(){
            this.alert={value:true, type:"info", message:"validando información"}
            let data = {username:this.username, password: this.password}
            axios.post(backend+'/ctl/login', data, basic).then((done)=>{ 
                if(done.data.status === 'error'){
                    this.alert={value:true, type:"error", message:"Información de acceso incorrectos"}
                    this.resetear()
                }else{
                    this.alert={value:true, type:"success", message:"Información de acceso correctos"}
                    this.resetear();
                    this.password=null;
                    this.username=null;
                    let cookie = done.data.cookie;
                    localStorage.cookie=cookie;
                    this.$router.push('/');
                }
      	    }).catch(()=>{
                this.alert={value:true, type:"error", message: "Se presento un error al ingresar"};
                this.resetear();
      	    });
        },
        resetear(){
            
            setTimeout(()=>{ this.alert = this.reset; }, 3000);
        },
        vista(){
             this.$forceUpdate();
        }
    }
};
</script>

