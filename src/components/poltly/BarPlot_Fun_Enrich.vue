<template>
  <div>
    <div id="observeGenePlot"></div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue';
import Plotly from 'plotly.js-dist-min';
import {image_config, imageCapture} from '../../utils/image_download';
const props = defineProps(['fe_obsergene_data']);
const layout = {
  title: 'Bar Plot',
  xaxis:{title:{ text:'Observed gene count',font:{size:14,weight:'bold'}}},
  // 
  showlegend: false,
  hovermode:'closest',
  yaxis:{
    tickformat:'none',
    tickmode: 'array',
  }
  // barmode: 'stack',
  // annotations:[],
};
const plotData = {
  x: [],
  y: [],
  z:[],
  type: 'bar',
  orientation:'h',
  textposition: 'none',
  hoverinfo: 'x+y+text',
  text: [],
  mode: 'markers',
  marker: {
    colorscale:'RdBu',
    colorbar:{},
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
  const color = [];
  const plotX = [];
  const plotY = [];
  const plotDesc = []
  const sortInfoArr = infoArr.sort((a,b)=>{if( b.data > a.data)return -1});
  for(let i = 0 ; sortInfoArr.length > i ; i++){
    plotY.push(sortInfoArr[i].name);
    plotX.push(sortInfoArr[i].data);
    color.push(sortInfoArr[i].FDR);
    plotDesc.push(sortInfoArr[i].desc);
  }

  plotData.y = plotY;
  plotData.x = plotX;
  plotData.marker.color = color;
  plotData.text = plotDesc;
  layout.yaxis.tickvals = plotY;
  setTimeout(()=>{
    Plotly.newPlot(observeGenePlot, [plotData], layout, plotConfig);
  })
}
watch(props.fe_obsergene_data,(newVal)=>{
  if( newVal.length === 0) return;
  handlePlotInfo(newVal);
})
</script>