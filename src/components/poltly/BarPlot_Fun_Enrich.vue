<template>
  <div>
    <div class="d-flex justify-end">
      <div class="toggle_expand" @click="toogle_Plot_Screen = true">
        <v-icon icon="fa:fas fa-expand mr-5"></v-icon>
      </div>
    </div>
    <div  id="observeGenePlot"></div>
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
  // z:[],
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
  // line:{
  //   showscale:true
  // }
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
  // const color = [];
  const plotX = [];
  const plotY = [];
  const plotDesc = [];
  // const sortInfoArr = infoArr.sort((a,b)=>{if( b.data > a.data)return -1});
  const sortInfoArr = infoArr.sort((a,b)=>{if( b.FDR > a.FDR)return -1});
  for(let i = 0 ; sortInfoArr.length > i ; i++){
    // plotY.push(sortInfoArr[i].name);
    // plotX.push(sortInfoArr[i].data);
    // color.push(sortInfoArr[i].FDR);
    // plotDesc.push(sortInfoArr[i].desc);
    const descName = `(${sortInfoArr[i].data}, ${sortInfoArr[i].name})`;
    plotY.push(sortInfoArr[i].desc);
    plotX.push(sortInfoArr[i].FDR);
    // plotDesc.push(sortInfoArr[i].name);
    plotDesc.push(descName);
  }
  image_config.filename = 'Bar plot Function enrichment';
  plotData.y = plotY;
  plotData.x = plotX;
  // plotData.marker.color = color;
  plotData.text = plotDesc;
  layout.yaxis.tickvals = plotY;
  transfer_FullScreen_data.value = {
    data:[plotData],
    plotConfig,
    layout
  }
  setTimeout(()=>{
    Plotly.newPlot(observeGenePlot, [plotData], layout, plotConfig);
  })
};
const close_dialog = (val) => toogle_Plot_Screen.value = val;
watch(props.fe_obsergene_data,(newVal)=>{
  if( newVal.length === 0) return;
  handlePlotInfo(newVal);
})
</script>
<style scope>
  .toggle_expand{
    cursor: pointer;
  }
</style>