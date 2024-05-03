<template>
  <div>
    <div id="dotPlot_observeGene"></div>
  </div>
</template>
<script setup>
  import {ref, watch} from 'vue';
  import Plotly from 'plotly.js-dist-min';
  const props = defineProps(['fe_Dot_Plot']);
  // var trace1 = {
  //   x: [1, 2, 3, 4, 5],
  //   y: [1, 6, 3, 6, 1],
  //   mode: 'markers',
  //   type: 'scatter',
  //   name: 'Team A',
  //   text: ['A-1', 'A-2', 'A-3', 'A-4', 'A-5'],
  //   marker: { size: 12 }
  // };
  const layout ={
    title:'Dot Plot',
    // barmode: 'stack'
  }
  const plotData = {
    x:[],
    y:[],
    type:'scatter',
    mode: 'markers',
    orientation:'h',
    textposition: 'auto',
  }
  const handleDotPlotInfo = (info)=>{
    const dotPlot_observeGene = document.getElementById('dotPlot_observeGene');
    Plotly.purge(dotPlot_observeGene)
    console.log(info, 'info')
    const dataKeys = Object.keys(info.data);
    const dataValues = Object.values(info.data);
    plotData.x = dataValues;
    plotData.y = dataKeys;
    plotData.text = dataValues.map(String);
    setTimeout(()=>{
      Plotly.newPlot(dotPlot_observeGene, [plotData], layout)
    })
  }
  watch(props.fe_Dot_Plot,(newVal)=>{
    if(!newVal.data || Object.keys(newVal.data).length === 0) return;
    handleDotPlotInfo(newVal)
  })
</script>