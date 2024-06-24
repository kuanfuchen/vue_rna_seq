<template>
  <div style="display: block;">
    <div class="d-flex justify-space-between" style="height:21px;margin-bottom: 9.5px;">
      <div class="pl-5 btn-icon" @click="downloadHeatmapImage">
          <v-icon icon="fa:fas fa-download"></v-icon>
          <span class="ml-2">Download image</span>
      </div>
      <div class="btn-icon"  @click="showHeatmap()">
        <v-icon icon="fa:fas fa-expand mr-5"></v-icon>
      </div>
    </div>
    <!-- zoomist-container -->
    <div class="d-flex align-center" style="height: 550px;">
      <div class="zoomist-container" >
        <div class="zoomist-wrapper">
          <div class="zoomist-image">
            <img :src="getHeatmapImg()" id="heatmapPicture"  />
            <!-- :style="{ height:heatmapHight }" -->
          </div>
        </div>
      </div>
    </div>
    <!-- <v-btn color="primary">+</v-btn>
    <v-btn color="yellow" class="ml-2">-</v-btn> -->
  </div>
  <v-dialog v-model="toggle_Heatmap"  width="95vw" >
    <v-card class="bg-white" style="height: 92vh;">
      <v-card-text>
        <div class="d-flex justify-space-between align-center py-2">
        <h5 class="text-h5 ml-2" style="font-weight: 700;">
          Heatmap Plot
        </h5>  
        <div class="d-flex align-center mr-3">
          <v-btn density="comfortable" rounded="lg" color="red-darken-1" variant="outlined" @click="toggle_Heatmap = false"
            icon="$close">
          </v-btn>
        </div>
      </div>
      </v-card-text>
      <v-card-text>
        <div class="zoomist-dialogContainer" >
          <div class="zoomist-wrapper">
            <div class="zoomist-image">
              <img :src="getHeatmapImg()"  />
              <!-- :style="{width:`${dialogHeatmapWidth}%`,height:`${dialogHeatmapHight}vh`}" -->
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<style scope>
 @import "zoomist/css";
  .heatmapStyle{
    width:100%;
    /* height: 544.5px; */
    /* height:100%; */
  }
  .btn-icon{
    cursor: pointer;
  }
  .heatmapDialogStyle{
    width: 100%;
    height: 80vh;
  }
.v-input .v-input__details{
  display: none;
}
.zoomist-container {
  width: 100%;
}

.zoomist-image {
  width: 100%;
  /* aspect-ratio: 16 / 9; */
}

.zoomist-image img {
  width: 100%;
  /* height: 544.5px; */
  /* object-fit: cover;
  object-position: center; */
}
.zoomist-wrapper{
  background-color:#fff;
}
</style>
<script setup>
  import { ref, watch, onMounted } from 'vue';
  import Zoomist from 'zoomist'; 
  // import html2canvas from 'html2canvas';
  const toggle_Heatmap = ref(false);
  // const definedProps = defineProps(['heatmapHeight']);
  // import { saveAs } from 'file-saver';
  const heatmapHight = ref('535px');
  // const dialogHeatmapHight = ref(80);
  // const dialogHeatmapWidth = ref(100);
  // const getHeatmapImg = ()=> new URL('@/assets/miRNA-seq/Bowtie2/heatmap.png', import.meta.url).href;
  const getHeatmapImg = ()=> new URL('@/assets/Partek_Flow/For_report_html/04. normalized reads/heatmap.png', import.meta.url).href;
  const downloadHeatmapImage = () => {
    try{
      const href = new URL('@/assets/Partek_Flow/For_report_html/04. normalized reads/heatmap.png', import.meta.url).href;
      window.open(href, '_blank','width=100vw')
    }catch(err){
      console.log(err)
    }
  };
  const showHeatmap = async()=>{
    toggle_Heatmap.value = true;
    setTimeout(() => {
      new Zoomist('.zoomist-dialogContainer', {
        maxScale: 6,
        bounds: true,
        // zoomer: true
      })
    },50);
  }
  // watch(definedProps.heatmapHeight, (newVal)=>{
  //   console.log(newVal, 'newVal')
  //   if(newVal.height === 550){
  //     heatmapHight.value = '535px';
  //   }else{
  //     heatmapHight.value = '100%'
  //   }
  // });
  const openZoomist = ()=>{
    new Zoomist('.zoomist-container', {
      maxScale: 6,
      bounds: true,
      // zoomer: true
    })
  }
  onMounted(async() => {
    await openZoomist()
  })
</script>
