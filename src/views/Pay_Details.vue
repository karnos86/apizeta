<template>
    <div class="details_pay">
        <h1 class="subheading grey--text ">Details</h1>
        <v-container fluid class="my-3">
            <v-layout class="my-3">
              <v-flex>
                <v-btn flat class="info--text" @click="back">
                  <v-icon class="pr-2">keyboard_arrow_left</v-icon>
                  <span class="subheading text-none">Ir atras</span>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-layout>
                <v-flex>
                    <v-card flat>
                        <v-alert :value="alert"  :type="type_alert" transition="scale-transition">
                          {{message_alert}}
                        </v-alert>
                    </v-card>
                </v-flex>
            </v-layout>
            <v-layout v-show="weit == true">
                <v-flex>
                    <h1>Espere-.....</h1>
                </v-flex>
            </v-layout>
            <v-layout v-show="weit ==false">
                <v-flex>
                    <v-card v-if="method== 'TDC'" flat>
                        <v-card  color="grey lighten-4">
                            <v-layout class=" pa-2">
                                <v-flex>
                                  <span class="title">Información de Usuario</span>
                                </v-flex>
                            </v-layout>
                            <v-layout class=" pa-2">
                                <v-flex class="xs12 md-2 pl-1"> 
                                    <div class="caption grey--text mb-2">Identificador</div>
                                    <span class="body-1">{{personal.id}}</span> 
                                </v-flex>
                                <v-flex class="xs12 md-2 pl-1"> 
                                    <div class="caption grey--text mb-2">Nombre</div>
                                    <span class="body-1">{{personal.name}}</span> 
                                </v-flex>
                                <v-flex class="xs12 md-2 pl-1"> 
                                    <div class="caption grey--text mb-2">Emial</div>
                                    <span class="body-1">{{personal.email}}</span> 
                                </v-flex>
                                <v-flex class="xs12 md-2 pl-1"> 
                                    <div class="caption grey--text mb-2">Telefono</div>
                                    <span class="body-1">{{personal.phone}}</span> 
                                </v-flex>
                            </v-layout>
                        </v-card>
                        <v-card class="my-4" color="grey lighten-4"> 
                            <v-layout class=" pa-2">
                                <v-flex>
                                  <span class="title">Metodo de pago</span>
                                </v-flex>
                            </v-layout>
                            <v-layout v-for="card in payment_sources" :key="card.id">
                                <v-flex class="xs12 md-2 pl-1"> 
                                    <div class="caption grey--text mb-2">Identificador</div>
                                    <span class="body-1">{{card.id}}</span> 
                                </v-flex>
                                <v-flex class="xs12 md-2 pl-1"> 
                                    <div class="caption grey--text mb-2">Numero de Tarjeta</div>
                                    <span class="body-1"><span class="caption"></span>**** {{card.last4}}</span> 
                                </v-flex>
                                <v-flex class="xs12 md-2 pl-1"> 
                                    <div class="caption grey--text mb-2">Vence</div>
                                    <span class="body-1">{{card.exp_month}}/{{card.exp_year}}</span> 
                                </v-flex>
                                <v-flex class="xs12 md-2 pl-1"> 
                                    <div class="caption grey--text mb-2">Tarjeta</div>
                                    <v-img class="my-1" :src="require(`@/assets/${card.brand}.png`)"  max-height="20" max-width="45"  position="center"></v-img>
                                </v-flex>
                                <v-flex class="xs12 md-2 pl-1">
                                    <div class="caption grey--text mb-2">Tarjeta habilitante</div>
                                    <span class="body-1"><span class="caption"></span>{{card.name}}</span> 
                                </v-flex>
                            </v-layout>
                        </v-card>
                        <v-card class="my-4" color="grey lighten-4">
                            <v-layout>
                                <v-flex>
                                    <span class="title">Comprobante de pago</span>
                                </v-flex>
                            </v-layout>
                            <v-layout>
                                <v-flex class="xs12 md-2 pl-1"> 
                                    <div class="caption grey--text mb-2">Comprobante</div>
                                    <span class="body-1">{{membership.charge_id}}</span> 
                                </v-flex>
                                <v-flex class="xs12 md-2 pl-1"> 
                                    <div class="caption grey--text mb-2">Debitado el</div>
                                    <span class="body-1"><span class="caption"></span>{{dataTimes(membership.created_at)}}</span> 
                                </v-flex>
                                <v-flex class="xs12 md-2 pl-1"> 
                                    <div class="caption grey--text mb-2">Membresía</div>
                                    <span class="body-1">{{membership.plan_id}}</span> 
                                </v-flex>
                                <v-flex class="xs12 md-2 pl-1"> 
                                    <div class="caption grey--text mb-2">Inicia</div>
                                    <span class="body-1">{{dataTimes(membership.billing_cycle_start)}}</span>
                                </v-flex>
                                <v-flex class="xs12 md-2 pl-1">
                                    <div class="caption grey--text mb-2">Finaliza</div>
                                    <span class="body-1"><span class="caption"></span>{{dataTimes(membership.billing_cycle_end)}}</span> 
                                </v-flex>
                            </v-layout>
                        </v-card> 
                    </v-card>
                    <v-card v-if="method == 'OXXO'" flat>
                        <v-card  color="grey lighten-4">
                            <v-layout class=" pa-2">
                                <v-flex>
                                  <span class="title">Información de Usuario</span>
                                </v-flex>
                            </v-layout>
                            <v-layout class=" pa-2">
                                <v-flex class="xs12 md-2 pl-1"> 
                                    <div class="caption grey--text mb-2">Identificador</div>
                                    <span class="body-1">{{personal.customer_id}}</span> 
                                </v-flex>
                                <v-flex class="xs12 md-2 pl-1"> 
                                    <div class="caption grey--text mb-2">Nombre</div>
                                    <span class="body-1">{{personal.name}}</span> 
                                </v-flex>
                                <v-flex class="xs12 md-2 pl-1"> 
                                    <div class="caption grey--text mb-2">Emial</div>
                                    <span class="body-1">{{personal.email}}</span> 
                                </v-flex>
                                <v-flex class="xs12 md-2 pl-1"> 
                                    <div class="caption grey--text mb-2">Telefono</div>
                                    <span class="body-1">{{personal.phone}}</span> 
                                </v-flex>
                            </v-layout>
                        </v-card>
                        <v-card class="my-4" color="grey lighten-4"> 
                            <v-layout class=" pa-2">
                                <v-flex>
                                  <span class="title">Metodo de pago</span>
                                </v-flex>
                            </v-layout>
                            <v-layout>
                                <v-flex class="xs12 md-2 pl-1"> 
                                    <div class="caption grey--text mb-2">Identificador</div>
                                    <span class="body-1">{{payment_sources.reference}}</span> 
                                </v-flex>
                                <v-flex class="xs12 md-2 pl-1"> 
                                    <div class="caption grey--text mb-2">Refence</div>
                                    <v-img class="my-1" :src="payment_sources.barcode_url"  max-height="20" max-width="45"  position="center"></v-img>
                                </v-flex>
                                <v-flex class="xs12 md-2 pl-1"> 
                                    <div class="caption grey--text mb-2">Metodo</div>
                                    <v-img class="my-1" :src="require(`@/assets/oxxo.png`)"  max-height="20" max-width="45"  position="center"></v-img>
                                </v-flex>
                                   <v-flex class="xs12 md-2 pl-1"> 
                                    <div class="caption grey--text mb-2">Expira</div>
                                    <span class="body-1"><span class="caption"></span>{{dataTimes(payment_sources.expires_at)}}</span> 
                                </v-flex>
                            </v-layout>
                        </v-card>
                        <v-card color="grey lighten-4">
                            <v-layout>
                                <v-flex>
                                    <span class="title">Comprobante de pago</span>
                                </v-flex>
                            </v-layout>
                             <v-layout>
                                <v-flex class="xs12 md-2 pl-1"> 
                                    <div class="caption grey--text mb-2">Comprobante</div>
                                    <span class="body-1">{{membership.id}}</span> 
                                </v-flex>
                                <v-flex class="xs12 md-2 pl-1"> 
                                    <div class="caption grey--text mb-2">Pagado el</div>
                                    <span class="body-1"><span class="caption"></span>{{dataTimes(membership.paid_at)}}</span> 
                                </v-flex>
                                 <v-flex class="xs12 md-2 pl-1"> 
                                    <div class="caption grey--text mb-2">Monto</div>
                                    <span class="body-1">{{membership.amount}} {{membership.currency}}</span> 
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>
<script>
import axios from 'axios'
import {backend} from '../plugins/url'
import {auth} from '../plugins/headers'
export default {
    props:{
        'info':Object , 
        'search':String
    },
    data(){
        return{
            message_alert:null,
            alert:false,
            type_alert:null,
            infoConek:{},
            weit:true,
            personal:{},
            method:null,
            payment_sources:null,
            membership:{},
            options: { month: 'short', year: 'numeric', day: 'numeric' },
        }
    },
    created(){
        if(this.info == null){
            this.$router.back();
        }
        this.searchDetails()
    },
    methods:{
        back(){
            this.$router.push({name:'pay', params:{info:this.search} });
        },
        searchDetails(){
            let data={idConekt:this.info.idConekt,
             method:this.info.method,
             reference:this.info.reference}
            axios.post(backend+'/subscriptions/conekta', data, auth )
            .then((done=>{
                this.weit=false;
                if(done.data.method=="TDC"){
                    this.method= done.data.method
                    this.personal=done.data.data
                    this.payment_sources = done.data.data.payment_sources.data
                    this.membership = done.data.data.subscription
                }else{
                    this.method= done.data.method
                    this.personal=done.data.data._json.customer_info,
                    this.payment_sources = done.data.data._json.charges.data[0].payment_method
                    this.membership = done.data.data._json.charges.data[0]
                }
            }))
            .catch(()=>{
                this.weit = !this.weit
                this.alert=true;
                this.type_alert="error"
                this.message_alert="Upps! intente nuevamente!"
                setTimeout(()=>{this.alert =! this.alert},3000);
                this.$router.back()
            })
        },
        dataTimes(times){
            var today = new Date((times*1000))
            return today.toLocaleDateString("es-MX", this.options).toUpperCase();
        },

    }
    
};
</script>
