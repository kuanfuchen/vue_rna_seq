<template>
  <div>
    <div class="d-flex justify-end">
      <div class="toggle_expand" @click="toogle_Plot_Screen = true">
        <v-icon icon="fa:fas fa-expand mr-5"></v-icon>
      </div>
    </div>
    <div  id="observeGenePlot"></div>
    <div class="d-flex justify-end" v-if="toggle_Color_category">
      <div class="mr-5">
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
    </div>
    <v-dialog v-model="toogle_Plot_Screen"  width="90vw" >
      <v-card class="bg-white" style="overflow-y: hidden;">
        <v-card-text >
          <h5 class="text-h5" style="font-weight: 700;">
            Bar Plot
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
import { ref, watch } from 'vue';
import Plotly from 'plotly.js-dist-min';
import {image_config, imageCapture} from '../../utils/image_download';
import Dialog_plot from '../Dialog_Plot.vue';
const props = defineProps(['fe_obsergene_data']);
const transfer_FullScreen_data = ref({});
const toogle_Plot_Screen = ref(false);
const toggle_Color_category = ref(true);
const layout = {
  title: 'Bar Plot',
  xaxis:{title:{ text:`-log<span style="font-size:10">10</span>(FDR)`,font:{size:14,weight:'bold'}}},
  // 
  showlegend: false,
  hovermode:'closest',
  yaxis:{
    tickmode: 'array',
    automargin:true,
  },
};
const plotData = {
  x: [],
  y: [],
  type: 'bar',
  orientation:'h',
  textposition: 'none',
  hoverinfo: 'x+y+text',
  text: [],
  mode: 'markers',
  marker: {
    // colorscale:'RdBu',
    // colorbar:{},
    color: 'rgb(158,202,225)',
    opacity: 0.6,
    line: {
      color: 'rgb(8,48,107)',
      width: 1.5
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
const handlePlotInfo = (info)=>{
  const observeGenePlot = document.getElementById('observeGenePlot');
  Plotly.purge(observeGenePlot);
  const infoArr = info;
  const plotX = [];
  const plotY = [];
  const plotDesc = [];
  const markerColor = [];
  const sortInfoArr = infoArr.sort((a,b)=>{if( b.FDR > a.FDR)return -1});
  for(let i = 0 ; sortInfoArr.length > i ; i++){
    if(sortInfoArr[0].category === 'KEGG')toggle_Color_category.value = false;
    const descName = `(${sortInfoArr[i].data}, ${sortInfoArr[i].name}, ${sortInfoArr[i].category})`;
    plotY.push(sortInfoArr[i].desc);
    plotX.push(sortInfoArr[i].FDR);
    markerColor.push(sortInfoArr[i].color);
    plotDesc.push(descName);
  }
  image_config.filename = 'Bar plot Function enrichment';
  plotData.y = plotY;
  plotData.x = plotX;
  plotData.marker.color= markerColor;
  plotData.text = plotDesc;
  layout.yaxis.tickvals = plotY;
  transfer_FullScreen_data.value = {
    data:[plotData],
    plotConfig,
    layout,
    colorBlock:toggle_Color_category.value,
    blockArea:true,
    blockStrength:false
  }
  setTimeout(()=>{
    Plotly.newPlot(observeGenePlot, [plotData], layout, plotConfig);
  })
};
const close_dialog = (val) => toogle_Plot_Screen.value = val;
watch(props.fe_obsergene_data,(newVal)=>{
  if(newVal.length === 0) return;
  const val = JSON.parse(JSON.stringify(newVal))
  handlePlotInfo(val);
})
</script>
<style scope>
  .toggle_expand{
    cursor: pointer;
  }
</style>