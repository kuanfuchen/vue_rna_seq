<template>
  <div>
    <div class="d-flex justify-end">
      <div class="toggle_expand" @click="toogle_Plot_Screen = true">
        <v-icon icon="fa:fas fa-expand mr-5"></v-icon>
      </div>
    </div>
    <div id="dotPlot_observeGene"></div>
    <div class="d-flex justify-end" style="z-index: 999;">
      <div class="mr-5">
        <p class="d-flex justify-center" style="font-weight: 700;">Color-Name</p>
        <div class="d-flex align-center px-1 py-1 " style=";border:1px solid black">
          <div class="squarePlot " style="width:25px;height: 20px; background: rgb(158,202,225);"></div>
          <p class="ml-1">MF</p>
          <div class="squarePlot ml-1" style="width:25px;height: 20px;background: rgba(255, 127, 15, 0.7)"></div>
          <p class="ml-1">BP</p>
          <div class="squarePlot ml-1" style="width:25px;height: 20px;background: rgba(44, 160, 44, 0.7)"></div>
          <p class="ml-1">CC</p>
        </div>
      </div>
      
      <div class=" mr-5">
        <p class="d-flex justify-center" style="font-weight: 700;">Strength</p>
        <div class="d-flex align-center px-1 py-1" style="width:95px;border:1px solid black">
          <div class="roundPlot" style="width:10px;height: 10px;"></div>
          <div class="roundPlot ml-1" style="width:15px;height: 15px;"></div>
          <div class="roundPlot ml-1" style="width:20px;height: 20px;"></div>
          <div class="roundPlot ml-1" style="width:27px;height: 27px;"></div>
        </div>
      </div>
    </div>
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
    xaxis:{title:{ text:`-log<span style="font-size:10">10</span>(FDR)`,font:{size:14,weight:'bold'}}},
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
    if(info.length === 0 )return;
    const dotPlot_observeGene = document.getElementById('dotPlot_observeGene');
    Plotly.purge(dotPlot_observeGene);
    const infoArr = info;
    const sortInfoArr = infoArr.sort((a,b)=>{if( b.FDR > a.FDR)return -1})
    const plotX = [];
    const plotY = [];
    const plotName = [];
    const dotsSize = [];
    const markerColor = [];
    for(let i = 0 ; sortInfoArr.length > i ; i++){
      // plotY.push(sortInfoArr[i].name);
      plotY.push(sortInfoArr[i].desc);
      // plotX.push(sortInfoArr[i].data);
      // color.push(sortInfoArr[i].FDR);
      const descName = `(${sortInfoArr[i].data}, ${sortInfoArr[i].name}, ${sortInfoArr[i].category})`;
      dotsSize.push(parseInt(sortInfoArr[i].data * 100));
      plotX.push(sortInfoArr[i].FDR);
      markerColor.push(sortInfoArr[i].color);
      // plotName.push(sortInfoArr[i].name);
      plotName.push(descName);
    }
    plotData.y = plotY;
    plotData.x = plotX;
    plotData.marker.color= markerColor;
    const evaluateValueMax = Math.max(...dotsSize);
    if(evaluateValueMax > 55){
      const calcDotsSize = dotsSize.map((item)=>{return item / 1.5});
      plotData.marker.size = calcDotsSize;
    }else if(evaluateValueMax > 33){
      const calcDotsSize = dotsSize.map((item)=> item / 1.5);
      plotData.marker.size = calcDotsSize;
    }else{
      plotData.marker.size = dotsSize;
    }
    // plotData.marker.color = color;
    plotData.text = plotName;
    // plotData.text = plotDesc;
    layout.yaxis.tickvals = plotY;
    image_config.filename = 'Dot plot Function enrichment';
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
    if(newVal.length === 0) return;
    const val = JSON.parse(JSON.stringify(newVal))
    handleDotPlotInfo(val)
  })
  const close_dialog = (val) => toogle_Plot_Screen.value = val;
</script>
<style scope>
  .toggle_expand{
    cursor: pointer;
  }
  .squarePlot{
    border: 1px solid black;
  }
  .roundPlot{
    border: 1px solid black;
    border-radius: 50%;
    /* background: #7b9daf; */
  }
</style>