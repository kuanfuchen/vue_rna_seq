<template>
  <div>
    <div id="dotPlot_observeGene"></div>
  </div>
</template>
<script setup>
  import {ref, watch} from 'vue';
  import Plotly from 'plotly.js-dist-min';
  const props = defineProps(['fe_Dot_Plot']);
  import {image_config, imageCapture} from '../../utils/image_download';
  const layout ={
    title:'Dot Plot',
    xaxis:{title:{ text:'Strength',font:{size:14,weight:'bold'}}},
    yaxis:{
      tickformat:'none',
      tickmode: 'array',
    }
  }
  const plotData = {
    x:[],
    y:[],
    type:'scatter',
    mode: 'markers',
    // orientation:'h',
    // textposition: 'auto',
    marker:{
      color:[],
      size:16,
      colorscale:'RdBu',
      // colorscale:'Bluered',
      colorbar:{
        // title:
      },
      line:{
        width:1,
        color:'black'
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
    const sortInfoArr = infoArr.sort((a,b)=>{if( b.data > a.data)return -1});
    const color = [];
    const plotX = [];
    const plotY = [];
    const plotDesc = [];
    for(let i = 0 ; sortInfoArr.length > i ; i++){
      plotY.push(sortInfoArr[i].name);
      plotX.push(sortInfoArr[i].data);
      color.push(sortInfoArr[i].FDR);
      plotDesc.push(sortInfoArr[i].desc)
    }
    plotData.y = plotY;
    plotData.x = plotX;
    plotData.marker.color = color;
    plotData.text = plotDesc;
    layout.yaxis.tickvals = plotY;
    setTimeout(()=>{
      Plotly.newPlot(dotPlot_observeGene, [plotData], layout, plotConfig)
    })
  }
  watch(props.fe_Dot_Plot,(newVal)=>{
    if(!newVal.length === 0) return;
    handleDotPlotInfo(newVal)
  })
</script>