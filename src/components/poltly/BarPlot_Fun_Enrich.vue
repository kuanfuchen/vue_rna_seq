<template>
  <div>
    <div id="observeGenePlot"></div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue';
import Plotly from 'plotly.js-dist-min';
const props = defineProps(['fe_obsergene_data']);
const layout = {
  title: 'Bar Plot',
  barmode: 'stack'
}
const plotData = {
  x: [],
  y: [],
  type: 'bar',
  orientation:'h',
  // text: [],
  textposition: 'auto',
  hoverinfo: 'none',
  marker: {
    color: 'rgb(158,202,225)',
    opacity: 0.6,
    line: {
      color: 'rgb(8,48,107)',
      width: 1.5
    }
  }
}

const handlePlotInfo = (info)=>{
  const observeGenePlot = document.getElementById('observeGenePlot');
  Plotly.purge(observeGenePlot);
  const infoKeys = Object.keys(info.data);
  const infoValues = Object.values(info.data);
  // const infoVal = Object.entries(info.data);
  const infoFDR =  Object.values(info.FDR);
  const caluFDR = [];
  infoFDR.forEach((item)=>caluFDR.push(Number(item)*1000000));
  console.log(caluFDR, 'caluFDR');
  plotData.y = infoKeys;
  // plotData.y = caluFDR;
  plotData.x = infoValues;
  plotData.text = infoValues.map(String);
  setTimeout(()=>{
    Plotly.newPlot(observeGenePlot, [plotData], layout);
  })
}
watch(props.fe_obsergene_data,(newVal)=>{
  if( !newVal.data || Object.keys(newVal.data).length === 0) return;
  handlePlotInfo(newVal);
})
</script>