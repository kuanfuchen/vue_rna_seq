<template>
  <div >
    <div>
      <div class="ml-5" style="font-weight: 700;font-size: 14px;">
        <p class="text-h6 text-teal" style="font-weight: 700;">Bar Plot</p>
        <div id="de_bar_plot" :style="{'height':plot_height + 'vh'}"></div>
        <!-- <p>Total filtered RNA-seq: {{ total_position_number }}</p> -->
        <p>DEGs: {{ total_position_number }}</p>
        <p style="color:#EF5350;">UP: {{ positive_position_number }}</p>
        <p style="color:#1976D2;">Down: {{ negative_position_number }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
  import Plotly from 'plotly.js-dist-min';
  import { imageCapture} from '../../utils/image_download';
  import { watch, ref } from 'vue';
  const plot_height = ref(30);
  const positive_position_number = ref(0);
  const negative_position_number = ref(0);
  const total_position_number = ref(0);
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
    }];
    const _barHeight = de_bar_plot_data.height / 100;
    plot_height.value= Math.ceil((window.innerHeight * _barHeight - 95 ) / window.innerHeight * 100);
    positive_position_number.value = de_bar_plot_data.positive;
    negative_position_number.value = de_bar_plot_data.neightive;
    total_position_number.value = de_bar_plot_data.positive + de_bar_plot_data.neightive;
    setTimeout(()=>{
      Plotly.newPlot(de_bar_plot, de_bar_data, layout, plotConfig );
    })
  }
  watch(props.de_bar_plot_data,(newVal) => {
    if(!newVal.positive && !newVal.positive)return;
    handle_DE_Bar();
  });
</script>