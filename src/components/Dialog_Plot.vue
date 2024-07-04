<template>
  <v-row>
    <v-col cols="12">
      <div class="d-flex justify-end mb-3">
        <v-btn density="comfortable" rounded="lg" color="red-darken-1" variant="outlined" @click="cancel_Dialog(false)"
        icon="$close">
        </v-btn>
      </div>
      <div id="dialog_poltly" class="plotLayout mx-auto"></div>
      <!--  -->
      <div class="d-flex justify-end" style="z-index: 999;" v-if="toogle_block">
        <div class="mr-5" v-if="toggle_Color_category">
          <p class="d-flex justify-center" style="font-weight: 700;">Category-Name</p>
          <div class="d-flex align-center px-1 py-1 " style=";border:1px solid black">
            <div class="squarePlot " style="width:25px;height: 20px; background: rgb(158,202,225);"></div>
            <p class="ml-1">MF</p>
            <div class="squarePlot ml-1" style="width:25px;height: 20px;background: rgba(255, 127, 15, 0.7)"></div>
            <p class="ml-1">BP</p>
            <div class="squarePlot ml-1" style="width:25px;height: 20px;background: rgba(44, 160, 44, 0.7)"></div>
            <p class="ml-1">CC</p>
          </div>
        </div>
        
        <div class=" mr-5" v-if="toggle_strength">
          <p class="d-flex justify-center" style="font-weight: 700;">Strength</p>
          <div class="d-flex align-center px-1 py-1" style="width:95px;border:1px solid black">
            <div class="roundPlot" style="width:10px;height: 10px;"></div>
            <div class="roundPlot ml-1" style="width:15px;height: 15px;"></div>
            <div class="roundPlot ml-1" style="width:20px;height: 20px;"></div>
            <div class="roundPlot ml-1" style="width:27px;height: 27px;"></div>
          </div>
        </div>
      </div>
      <!--  -->
    </v-col>
  </v-row>
</template>
<script setup>
  import { onMounted, ref } from 'vue';
  // const dialog = ref(false);
  import Plotly from 'plotly.js-dist-min';
  const toggle_Color_category = ref(false);
  const toogle_block = ref(false);
  const toggle_strength = ref(false);
  const props = defineProps(['listen_plot_data']); 
  const emit = defineEmits(['toggle_tranfer_dialog_plot']);
  const cancel_Dialog = (val) => emit('toggle_tranfer_dialog_plot', val);
  onMounted(() => {
    const plot_info = props.listen_plot_data;
    if(plot_info.colorBlock)toggle_Color_category.value = plot_info.colorBlock;
    if(plot_info.blockArea)toogle_block.value = plot_info.blockArea;
    if(plot_info.blockStrength) toggle_strength.value = plot_info.blockStrength;
    console.log(plot_info, 'plot_info');
    Plotly.newPlot('dialog_poltly', plot_info.data, plot_info.layout, plot_info.plotConfig);
  });
</script>
<style lang="scss">
  .plotLayout{
    width: 80vw;
    height:80vh;
  }
</style>