<template>
  <div>
    <div id="dotPlot_observeGene"></div>
  </div>
</template>
<script setup>
  import {ref, watch} from 'vue';
  import Plotly from 'plotly.js-dist-min';
  const props = defineProps(['fe_Dot_Plot']);
  const layout ={
    title:'Dot Plot',
  }
  const plotData = {
    x:[],
    y:[],
    type:'scatter',
    mode: 'markers',
    orientation:'h',
    textposition: 'auto',
    marker:{size:16}
  }
  const handleDotPlotInfo = (info)=>{
    const dotPlot_observeGene = document.getElementById('dotPlot_observeGene');
    Plotly.purge(dotPlot_observeGene);
    const dataKeys = Object.keys(info.data);
    const dataValues = Object.values(info.data);
    const infoDesc = Object.values(info.desc)
    plotData.x = dataValues;
    plotData.y = dataKeys;
    plotData.text = infoDesc.map(String);
    setTimeout(()=>{
      Plotly.newPlot(dotPlot_observeGene, [plotData], layout)
    })
  }
  watch(props.fe_Dot_Plot,(newVal)=>{
    if(!newVal.data || Object.keys(newVal.data).length === 0) return;
    handleDotPlotInfo(newVal)
  })
</script>