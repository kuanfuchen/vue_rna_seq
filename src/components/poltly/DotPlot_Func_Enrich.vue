<template>
  <div>
    <div class="d-flex justify-end">
      <div class="toggle_expand" @click="toogle_Plot_Screen = true">
        <v-icon icon="fa:fas fa-expand mr-5"></v-icon>
      </div>
    </div>
    <div id="dotPlot_observeGene"></div>
    <v-dialog v-model="toogle_Plot_Screen"  width="90vw" >
      <v-card class="bg-white" style="overflow-y: hidden;">
        <v-card-text >
          <h5 class="text-h5" style="font-weight: 700;">
            Dot Plot
          </h5>  
          <div class="ml-auto mr-5">
            <Dialog_plot :listen_plot_data="transfer_FullScreen_data" @toggle_tranfer_dialog_plot="close_dialog" ></Dialog_plot>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
  import {ref, watch} from 'vue';
  import Plotly from 'plotly.js-dist-min';
  const props = defineProps(['fe_Dot_Plot']);
  import {image_config, imageCapture} from '../../utils/image_download';
  import Dialog_plot from '../Dialog_Plot.vue';
  const transfer_FullScreen_data = ref({});
  const toogle_Plot_Screen = ref(false);
  const layout ={
    title:'Dot Plot',
    xaxis:{title:{ text:'False Discovery Rate',font:{size:14,weight:'bold'}}},
    yaxis:{
      tickformat:'none',
      tickmode: 'array',
      automargin:true
    }
  }
  const plotData = {
    x:[],
    y:[],
    type:'scatter',
    mode: 'markers',
    // orientation:'h',
    marker:{
      size:[],
      color: 'rgb(158,202,225)',
      opacity: 0.6,
      // color:[],
      // colorscale:'RdBu',//Bluered
      // colorbar:{},
      line:{
        width:1.5,
        color:'rgb(8,48,107)'
      }
    },
  };
  const plotConfig = {
    responsive:true, 
    displaylogo: false,
    modeBarButtonsToRemove: ['pan2d','select2d','lasso2d','zoom','toImage'],
    modeBarButtonsToAdd:[imageCapture],
    displayModeBar: true
  };
  const handleDotPlotInfo = (info)=>{
    const dotPlot_observeGene = document.getElementById('dotPlot_observeGene');
    Plotly.purge(dotPlot_observeGene);
    const infoArr = info;
    // const sortInfoArr = infoArr.sort((a,b)=>{if( b.data > a.data)return -1});
    const sortInfoArr = infoArr.sort((a,b)=>{if( b.FDR > a.FDR)return -1})
    // const color = [];
    const plotX = [];
    const plotY = [];
    const plotName = [];
    const dotsSize = [];
    for(let i = 0 ; sortInfoArr.length > i ; i++){
      // plotY.push(sortInfoArr[i].name);
      plotY.push(sortInfoArr[i].desc);
      // plotX.push(sortInfoArr[i].data);
      // color.push(sortInfoArr[i].FDR);
      dotsSize.push(sortInfoArr[i].data * 100);
      plotX.push(sortInfoArr[i].FDR)
      plotName.push(sortInfoArr[i].name)
      // plotDesc.push(sortInfoArr[i].desc)
    }
    plotData.y = plotY;
    plotData.x = plotX;
    const evaluateValueMax = Math.max(...dotsSize);
    console.log(evaluateValueMax, 'evaluateValueMax');
    if(evaluateValueMax > 55){
      const calcDotsSize = dotsSize.map((item)=>{return item / 2.8});
      plotData.marker.size = calcDotsSize;
    }else if(evaluateValueMax > 33){
      const calcDotsSize = dotsSize.map((item)=> item / 2);
      plotData.marker.size = calcDotsSize;
    }else{
      plotData.marker.size = dotsSize;
    }
    // plotData.marker.color = color;
    console.log(dotsSize, 'dotSize')
    plotData.text = plotName;
    // plotData.text = plotDesc;
    layout.yaxis.tickvals = plotY;
    transfer_FullScreen_data.value = {
      data:[plotData],
      plotConfig,
      layout
    }
    setTimeout(()=>{
      Plotly.newPlot(dotPlot_observeGene, [plotData], layout, plotConfig)
    })
  }
  watch(props.fe_Dot_Plot,(newVal)=>{
    if(!newVal.length === 0) return;
    handleDotPlotInfo(newVal)
  })
  const close_dialog = (val) => toogle_Plot_Screen.value = val;
</script>
<style scope>
  .toggle_expand{
    cursor: pointer;
  }
</style>