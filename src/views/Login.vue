<template>
   <!--  <v-container >
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
    </v-container> -->

<form action="" method="POST" id="card-form">
  <span class="card-errors"></span>
  <div>
    <label>
      <span>Nombre del tarjetahabiente</span>
      <input type="text" size="20" data-conekta="card[name]">
    </label>
  </div>
  <div>
    <label>
      <span>Número de tarjeta de crédito</span>
      <input type="text" size="20" data-conekta="card[number]">
    </label>
  </div>
  <div>
    <label>
      <span>CVC</span>
      <input type="text" size="4" data-conekta="card[cvc]">
    </label>
  </div>
  <div>
    <label>
      <span>Fecha de expiración (MM/AAAA)</span>
      <input type="text" size="2" data-conekta="card[exp_month]">
    </label>
    <span>/</span>
    <input type="text" size="4" data-conekta="card[exp_year]">
  </div>
  <button type="submit">Crear token</button>
</form>




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
        // this.$forceUpdate();
        this.tokenizar();
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
        },

        tokenizar(){
              Conekta.setPublicKey('key_CjGKTquFrsNBSwgsecHDvPw');

  var conektaSuccessResponseHandler = function(token) {
    var $form = $("#card-form");
    //Inserta el token_id en la forma para que se envíe al servidor
     $form.append($('<input type="text" name="conektaTokenId" id="conektaTokenId">').val(token.id));
    // $form.get(0).submit(); //Hace submit
  };
  var conektaErrorResponseHandler = function(response) {
    var $form = $("#card-form");
    $form.find(".card-errors").text(response.message_to_purchaser);
    $form.find("button").prop("disabled", false);
  };

  //jQuery para que genere el token después de dar click en submit
  $(function () {
    $("#card-form").submit(function(event) {
      var $form = $(this);
      // Previene hacer submit más de una vez
      $form.find("button").prop("disabled", true);
      Conekta.Token.create($form, conektaSuccessResponseHandler, conektaErrorResponseHandler);
      return false;
    });
  });

        }
    }
};
</script>

