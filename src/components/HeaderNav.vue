<template>
  <v-app-bar color="blue" >
    <template v-slot:image>
      <v-img  gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"></v-img>
    </template>
    <template v-slot:prepend>
      <v-icon icon="fa:fas fa-list" @click="toggleDrawer()" class="ml-2"></v-icon>
    </template>
    <v-app-bar-title style="cursor: default;">
        <v-icon icon="fa:fas fa-dna" class="mx-2 rotateIcon">
      </v-icon>
      <span class="mr-3">CGMMRC</span><span>RNA-seq</span>
      <!-- </router-link> -->
    </v-app-bar-title>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>
<script setup>
  import { ref } from 'vue';
  const leftDrawer = ref(true);
  const emits = defineEmits(['handleLeftDrawers']);
  const toggleDrawer = ()=>{
    leftDrawer.value = !leftDrawer.value;
    emits('handleLeftDrawers', leftDrawer.value)
  }

</script>
<style lang="scss">
  .rotateIcon{
    transform: rotate(90deg);
    color:#BBDEFB;
    font-size: 20px;
  }
</style>