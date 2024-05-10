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
  // 
  showlegend: false,
  // barmode: 'stack',
  // annotations:[],
};
const plotData = {
  x: [],
  y: [],
  type: 'bar',
  orientation:'h',
  // textposition: 'auto',
  hoverinfo: 'x+y',
  text: [],
  marker: {
    color: 'rgb(158,202,225)',
    opacity: 0.6,
    line: {
      color: 'rgb(8,48,107)',
      width: 1.5
    }
  },
  line:{
    showscale:true
  }
};

const handlePlotInfo = (info)=>{
  const observeGenePlot = document.getElementById('observeGenePlot');
  console.log(info,'info')
  Plotly.purge(observeGenePlot);
  const infoKeys = Object.keys(info.data);
  const infoValues = Object.values(info.data);
  // const infoDesc = Object.values(info.desc)
  // const infoVal = Object.entries(info.data);
  const infoFDR =  Object.values(info.FDR);
  const caluFDR = [];
  infoFDR.forEach((item) => caluFDR.push(Number(item)*1000000));
  plotData.y = infoKeys;
  plotData.x = infoValues;
  // plotData.text = infoDesc.map(String);
  setTimeout(()=>{
    Plotly.newPlot(observeGenePlot, [plotData], layout);
  })
}
watch(props.fe_obsergene_data,(newVal)=>{
  if( !newVal.data || Object.keys(newVal.data).length === 0) return;
  handlePlotInfo(newVal);
})
</script>