<template>
  <div>
    <div id="de_bar_plot"></div>
  </div>
</template>
<script setup>
  import Plotly from 'plotly.js-dist-min';
  import { imageCapture} from '../../utils/image_download';
  import { onMounted } from 'vue';
  const props = defineProps(['de_bar_plot_data']);
  const layout = {
    // height:definedProps.plot_size.height,
    // xaxis: { title: {text:'Sample', font:{ size:16, weight:'bold' }}, automargin:'height',tickformat:'none' },
    // yaxis:{title:{ text:`log<span style="font-size:12px">10</span>(Normalized Count)`, font:{ size:16, weight:'bold' }},tickformat:'none' },
    font:{ size:12}, 
    margin:{ t:70,},
    // title:'Normalized Read Counts distribution of sample'
  };
  const plotConfig = {
    responsive: true, 
    displaylogo: false,
    modeBarButtonsToRemove: ['pan2d','select2d','lasso2d','zoom', 'toImage'],
    modeBarButtonsToAdd:[imageCapture],
    displayModeBar: true
  }
  const handle_DE_Bar = () => {
    const de_bar_plot_data = props.de_bar_plot_data;
    const de_bar_plot = document.getElementById('de_bar_plot');
    Plotly.purge(de_bar_plot);
    const de_bar_data = [{
      x:['Up-regulated', 'Down-regulated'],
      y:[de_bar_plot_data.positive, de_bar_plot_data.neightive],
      type:'bar',
      marker:{
        color:['red','blue']
      }
    }]
    setTimeout(()=>{
      Plotly.newPlot(de_bar_plot, de_bar_data, layout, plotConfig );
    })
  }
  onMounted(()=>{
    setTimeout(async()=>{
      await handle_DE_Bar();
    },500)
  })
</script>