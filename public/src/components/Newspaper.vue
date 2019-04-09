<template>
	 <div id="news">
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
	};
</script>