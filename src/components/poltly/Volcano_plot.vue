<template>
  <div>
    
    <div class="d-flex justify-space-between">
      <div class="ml-3" style="font-weight: 700;font-size: 15px;">
        {{ valcanoTitle }}
      </div>
      <!-- <div class="d-flex">
        <div class="toggle_cols" @click="changedContentSize(6, 220, 650)">
          <v-icon icon="fa:fas fa-table-columns mr-5"></v-icon>
        </div>
        <div class="toggle_cols" @click="changedContentSize(12, 0, 650)" >
          <v-icon icon="fa:far fa-square mr-5"></v-icon>
        </div>
      </div> -->
    </div>
    <v-row class="d-flex justify-space-between mt-1">
      <v-col :cols="contentCols">
        <v-card style="height:700px">
          <v-card-text>
            <DE_Bar_Plot  :de_bar_plot_data="deBarPlotData"></DE_Bar_Plot>
            <!-- :style="{'height':plot_bar_height + 'vh'}" -->
          </v-card-text>
        </v-card>
      </v-col>
      <v-col :cols="contentCols">
        <v-card style="height:700px">
          <v-card-text>
            <div class="d-flex justify-space-between mt-1">
            <!-- <div class="ml-5" style="font-weight: 700;font-size: 14px;">
              <p>Total filtered miRNA: {{ total_position_number }}</p>
              <p style="color:#EF5350;margin-left:90px">UP: {{ positive_position_number }}</p>
              <p style="color:#1976D2;margin-left:90px">Down: {{ negative_position_number }}</p>
            </div> -->
              <p class="text-h6 ml-3 text-teal" style="font-weight: 700;">Volcano Plot</p>
              <div class="download_xlsx" @click="toogle_Plot_Screen = true">
                <v-icon icon="fa:fas fa-expand mr-5"></v-icon>
              </div>
            </div>
            <div class="mt-3"  id="displatVolcanoPlot"></div>
            <!-- :style="{'height':plot_height + 'vh'}" -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="toogle_Plot_Screen"  width="90vw" >
      <v-card class="bg-white" style="overflow-y: hidden;">
        <v-card-text >
          <h5 class="text-h5" style="font-weight: 700;">
            {{ valcanoTitle }}
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
  import Plotly from 'plotly.js-dist-min';
  // import { dataService } from '@/service/data_service';
  import { dataFolder_RNAseq } from '../../service/rna_seq_dataservice';
  import { takeUntil, debounceTime, Subject } from 'rxjs';
  import { ref, reactive, watch } from 'vue';
  import Dialog_plot from '../Dialog_Plot.vue';
  import {image_config, imageCapture} from '../../utils/image_download';
  import DE_Bar_Plot from './DE_BarPlot.vue';
  const props = defineProps(['change_volcano_plot', ]);
  // const emit = defineEmits(['maxValYaxis']);
  const toogle_Plot_Screen = ref(false);
  let log2Upper = 1;
  let log2Lower = -1;
  let P_or_Q_value ='P-VALUE';
  let selecte_miRNAs_Name = [];
  let log_SelectStyleNum = 0;
  const negative_position_number = ref(0);
  const positive_position_number = ref(0);
  const total_position_number = ref(0);
  const comSubject$ = new Subject();
  const transfer_FullScreen_data = ref([]);
  const storagedDE_folder = {
    info:[],
    headers:[]
  };
  const removePlotHeight = ref(650);
  const contentCols = ref(6);
  const plot_height = ref(30);
  const plot_bar_height = ref(30);
  const plotConfig = {
    responsive:true, 
    displaylogo: false,
    modeBarButtonsToRemove: ['pan2d','select2d','lasso2d','zoom', 'toImage'],
    modeBarButtonsToAdd:[imageCapture],
    displayModeBar: true
  }
  const valcanoTitle = ref('');
  const deBarPlotData = reactive({
    positive: 0,
    neightive: 0,
    height: 0
  });
  const volcano_plot_plotlyjs_data = {
    x: [],
    y: [],
    mode: 'markers',
    type: 'scatter',
    name: '',
    text: [],
    textfont :{
      size:14,
      weight:"bold"
    },
    marker: { 
      size: 6,
      color:'#EF5350',//1976D2
    }
  };
  const negative_volcano_plot_plotlyjs_data = {
    x: [],
    y: [],
    mode: 'markers',
    type: 'scatter',
    name: '',
    text: [],
    textfont :{
      size:14,
      weight:"bold"
    },
    marker: { 
      size: 6,
      color:'#1976D2',//26A69A

    }
  }
  const selected_volcano__plot_plotlyjs_data = {
    x: [],
    y: [],
    mode: 'markers',
    type: 'scatter',
    name: '',
    text: [],
    textfont :{
      size:14,
      weight:"bold"
    },
    marker: { 
      size: 6,
      color:'#B0BEC5'
    }
  }
  let display_Text_volcano__plot_plotlyjs_data = {
    x:[],
    y:[],
    // mode:'markers+text',
    mode:'markers',
    type: 'scatter',
    name: '',
    text: [],
    textfont :{
      size:14,
      weight:"bold"
    },
    textposition:'bottom',
    marker: {
      size: 6,
      color:[]
      // color:'#EF5350',//1976D2
    }
  }
  const layout = {
    xaxis: { range: [] },
    yaxis: { range: [] },
    margin:{
      t:30
    },
    showlegend: false,
    annotations:[],
    height:600
  };
  // 
  const positiveLine = {
    x: [1, 1],
    y: [0, 15],  // 在 y = 15 的地方畫一條水平線
    mode: 'lines',
    type: 'scatter',
    name: 'Additional Line0',
    line:{
      color:'#FFD600',
      width:2
    }
  };
  const negativeLine = {
    x: [-1, -1],
    y: [0, 10],
    mode: 'lines',
    type: 'scatter',
    name: 'Additional Line1',
    line:{
      color:'#FFD600',
      width:2
    }
  }
  const pvalue_line = {
    x: [-100, 100],
    y: [0, 0],
    mode: 'lines',
    type: 'scatter',
    name: 'Additional Line2',
    line:{
      color:'#FFA726',
      width:2.5
    }
  }
  const DE_folder_data = [ volcano_plot_plotlyjs_data, selected_volcano__plot_plotlyjs_data, negative_volcano_plot_plotlyjs_data, display_Text_volcano__plot_plotlyjs_data, positiveLine, negativeLine, pvalue_line];
  // dataService.DE_Folder_Info$.pipe(takeUntil(comSubject$), debounceTime(300)).subscribe((deFolderData)=>{
  //   storagedDE_folder.info = deFolderData.info;
  //   storagedDE_folder.headers = deFolderData.title_Group;
  //   handleDE_data();
  // });
  dataFolder_RNAseq.RNAseq_DE_Folder_Info$.pipe(takeUntil(comSubject$), debounceTime(300)).subscribe(async(deFolderData)=>{
    storagedDE_folder.info = deFolderData.info;
    storagedDE_folder.headers = deFolderData.title_Group;
    await handleDE_data();
  });
  const reMark_DE_Plot = async(num)=>{
    await Plotly.purge('displatVolcanoPlot');
    volcano_plot_plotlyjs_data.x.length = 0;
    volcano_plot_plotlyjs_data.y.length = 0;
    volcano_plot_plotlyjs_data.text.length = 0;
    negative_volcano_plot_plotlyjs_data.x.length = 0;
    negative_volcano_plot_plotlyjs_data.y.length = 0;
    negative_volcano_plot_plotlyjs_data.text.length = 0;
    selected_volcano__plot_plotlyjs_data.x.length = 0;
    selected_volcano__plot_plotlyjs_data.y.length = 0;
    selected_volcano__plot_plotlyjs_data.text.length = 0;
    display_Text_volcano__plot_plotlyjs_data.x.length = 0;
    display_Text_volcano__plot_plotlyjs_data.y.length = 0;
    display_Text_volcano__plot_plotlyjs_data.text.length = 0;
    display_Text_volcano__plot_plotlyjs_data.marker.color.length = 0;
    layout.xaxis.range.length = 0;
    layout.yaxis.range.length = 0;
    positiveLine.x = [log2Upper, log2Upper];
    negativeLine.x = [log2Lower, log2Lower];
    positive_position_number.value = 0;
    negative_position_number.value = 0;
    total_position_number.value = 0;
    await handleDE_data(num);    
  }
  const handleDE_data = (selectedDataNum = 0) => {
    valcanoTitle.value = storagedDE_folder.headers[selectedDataNum];
    const selected_DE_pValue = [];
    const selected_DE_log2 = [];
    const selected_RNA_name = [];
    const headersUppers = [];
    for(let i = 0; storagedDE_folder.info[selectedDataNum].headers.length > i ; i++){
      const splitHeaders = storagedDE_folder.info[selectedDataNum].headers[i].split(/\(/)[0];
      headersUppers.push(splitHeaders.toUpperCase().trim());
    };
    let p_or_q_value_index = -1;
    if(P_or_Q_value ==='P-VALUE'){
      p_or_q_value_index =  headersUppers.indexOf('P-VALUE');
    }else if( P_or_Q_value === 'Q-VALUE'){
      p_or_q_value_index =  headersUppers.indexOf('FDR STEP UP')
    }
    // const p_or_q_value_index =  headersUppers.indexOf('P-VALUE');
    if(p_or_q_value_index === -1)return;
    const lo2_index = headersUppers.indexOf('LOG2');
    // 
    let index = 0;
    for(let i = 0 ; storagedDE_folder.info[selectedDataNum].body.length > i ; i++){
      if(storagedDE_folder.info[selectedDataNum].body[i][p_or_q_value_index] !== '?'){
        const floatNum = parseFloat(storagedDE_folder.info[selectedDataNum].body[i][p_or_q_value_index]);
        const logCalu = - Math.log10(floatNum);
        // selected_RNA_name.push(storagedDE_folder.info[selectedDataNum].body[i][0]);
        // const geneName = `${storagedDE_folder.info[selectedDataNum].body[i][0]} - ${storagedDE_folder.info[selectedDataNum].body[i][1]}`
        const geneName = storagedDE_folder.info[selectedDataNum].body[i][1];
        selected_RNA_name.push(geneName);
        selected_DE_pValue.push(logCalu);
        // selected_DE_log2.push(storagedDE_folder.info[selectedDataNum].body[i][4]);
        selected_DE_log2.push(storagedDE_folder.info[selectedDataNum].body[i][lo2_index]);
        index ++;
      }
    }
    displatVolcano(selected_DE_pValue, selected_DE_log2, selected_RNA_name);
  }
  const displatVolcano = (p_value, log2, RNA_ID) => {
    return new Promise((resolve, reject) => {
      try{
        layout.annotations.length = 0;
        for(let i = 0 ; log2.length> i ; i++){
          const floatNum = parseFloat(log2[i]);
          const selecte_miRNAs_Name_Index = selecte_miRNAs_Name.indexOf(RNA_ID[i]);
          if( log2Upper <= floatNum &&  p_value[i] >= log_SelectStyleNum){
            if(selecte_miRNAs_Name_Index === -1){
              volcano_plot_plotlyjs_data.y.push(p_value[i]);
              volcano_plot_plotlyjs_data.x.push(log2[i]);
              volcano_plot_plotlyjs_data.text.push(RNA_ID[i]);
            }else{
              display_Text_volcano__plot_plotlyjs_data.x.push(log2[i]);
              display_Text_volcano__plot_plotlyjs_data.y.push(p_value[i]);
              display_Text_volcano__plot_plotlyjs_data.text.push(RNA_ID[i]);
              display_Text_volcano__plot_plotlyjs_data.marker.color.push('#EF5350');
              // 
              layout.annotations.push({
                x:log2[i],
                y:p_value[i],
                text:RNA_ID[i],
                showarrow: true,
                arrowhead: 1,
                ax: 10,
                ay: -80,
                xanchor:'left',
                // yanchor:'bottom',
                bgcolor: 'rgba(224, 247, 250,0.6)',
                borderpad: 4,
                textfont:{
                  size:16
                }
              })
            }
            positive_position_number.value ++;
          }else if( log2Lower >= floatNum && p_value[i] >= log_SelectStyleNum ){
            if(selecte_miRNAs_Name_Index === -1){
              negative_volcano_plot_plotlyjs_data.y.push(p_value[i]);
              negative_volcano_plot_plotlyjs_data.x.push(log2[i]);
              negative_volcano_plot_plotlyjs_data.text.push(RNA_ID[i]);
            }else{
              display_Text_volcano__plot_plotlyjs_data.x.push(log2[i]);
              display_Text_volcano__plot_plotlyjs_data.y.push(p_value[i]);
              display_Text_volcano__plot_plotlyjs_data.text.push(RNA_ID[i]);
              display_Text_volcano__plot_plotlyjs_data.marker.color.push('#1976D2');
              // 
              layout.annotations.push({
                x:log2[i],
                y:p_value[i],
                text:RNA_ID[i],
                showarrow: true,
                arrowhead: 1,
                xanchor:'right',
                // yanchor:'bottom',
                ax: -10,
                ay: -80,
                bgcolor: 'rgba(224, 247, 250,0.6)',
                borderpad: 4,
                textfont:{
                  size:16
                }
              })
            }
            negative_position_number.value ++;
          }
          else{
            if(selecte_miRNAs_Name_Index === -1){
              selected_volcano__plot_plotlyjs_data.y.push(p_value[i]);
              selected_volcano__plot_plotlyjs_data.x.push(log2[i]);
              selected_volcano__plot_plotlyjs_data.text.push(RNA_ID[i]);
            }else{
              display_Text_volcano__plot_plotlyjs_data.x.push(log2[i]);
              display_Text_volcano__plot_plotlyjs_data.y.push(p_value[i]);
              display_Text_volcano__plot_plotlyjs_data.text.push(RNA_ID[i]);
              display_Text_volcano__plot_plotlyjs_data.marker.color.push('#B0BEC5');
              // 
              layout.annotations.push({
                x:log2[i],
                y:p_value[i],
                text:RNA_ID[i],
                showarrow: true,
                arrowhead: 1,
                ax: 0,
                ay: -80,
                bgcolor: 'rgba(224, 247, 250,0.6)',
                borderpad: 4,
                textfont:{
                  size:16
                }
              })
            }
          }
          total_position_number.value = positive_position_number.value + negative_position_number.value;
        };
        const maxValYaxis = Math.max(...p_value)* 1.1;
        const minValYaxis = Math.min(...p_value);
        const maxValXaxis = Math.max(...log2);
        const minValXaxis = Math.min(...log2);
        const absmaxValXaxis = Math.abs(maxValXaxis);
        const absminValXaxis = Math.abs(minValXaxis);
        const maxXaxisRang = absmaxValXaxis > absminValXaxis ? absmaxValXaxis : absminValXaxis;
        const emit_maxXaxisRang = Math.ceil(maxXaxisRang);
        const ceil_max_Xaxis = emit_maxXaxisRang* 1.1;
        // emit('xaxisMaxValue', emit_maxXaxisRang);
        layout.xaxis = {
          range: [ -ceil_max_Xaxis, ceil_max_Xaxis ],
          title:{text:`log<span style="font-size:12px;">2</span>Ratio`, font:{size:20,}}
        };
        layout.yaxis = {
          range:[ minValYaxis, maxValYaxis ],
          // range:[0, 20]
          title: { text:`-log<span style="font-size:12px;">10</span>(${P_or_Q_value==='P-VALUE'?'P-value':'Q-value'})`, font:{size:20}}
        };
        const postitiveYMax = Math.ceil(maxValYaxis);
        positiveLine.y = [ 0, postitiveYMax ];
        negativeLine.y = [ 0, postitiveYMax];
        image_config.filename = `Volcano_plot`;
        const windowInnerheight = window.innerHeight;
        plot_height.value =  Math.ceil(( windowInnerheight - removePlotHeight.value )/ windowInnerheight * 100);
        plot_bar_height.value = Math.ceil(( windowInnerheight - removePlotHeight.value + 46 )/ windowInnerheight * 100);
        // drawBarPlot(positive_position_number.value, negative_position_number.value);
        deBarPlotData.height = plot_height.value;
        deBarPlotData.positive = positive_position_number.value;
        deBarPlotData.neightive = negative_position_number.value;
        setTimeout(()=>{
          const full_layout = JSON.parse(JSON.stringify(layout));
          
          full_layout.height = window.innerHeight * 0.8;
          console.log(full_layout , 'full_layout')
          if(!document.getElementById('displatVolcanoPlot')) return;
          transfer_FullScreen_data.value = {
            data: DE_folder_data,
            // layout,
            layout:full_layout,
            plotConfig
          };
          // transfer_FullScreen_data.value.layout.height = window.innerHeight * 0.8;
          Plotly.newPlot('displatVolcanoPlot', DE_folder_data, layout, plotConfig)
        },100)
      }catch(err){
        reject(err)
      }
    })
  }
  const changedContentSize = (col,changedTableHeight,changePlotHeight)=>{
    if(contentCols.value === col) return;
    contentCols.value = col;
    // deTableSize.value = changedTableHeight;
    plot_height.value = changePlotHeight;
  }
  watch(props.change_volcano_plot, (change_Val)=>{
    const titleIndex = storagedDE_folder.headers.indexOf(change_Val.title);
    if(titleIndex === -1){
      console.log('dont index')
      return
    }
    valcanoTitle.value = change_Val.title;
    log2Upper = change_Val.log2_UpperBound;
    log2Lower = change_Val.log2_LowerBound;
    P_or_Q_value = change_Val.selectType.toUpperCase();
    if(change_Val.displayText && change_Val.displayText.length > 0){
      selecte_miRNAs_Name = JSON.parse(JSON.stringify((change_Val.displayText)));
    }else if(change_Val.displayText.length === 0){
      selecte_miRNAs_Name.length = 0;
    }
    removePlotHeight.value = change_Val.height;
    if(change_Val.selectStyleNum === '') return;
    // if(change_Val.selectStyleNum === '' || change_Val.selectStyleNum === Infinity )return;
    log_SelectStyleNum = - Math.log10(change_Val.selectStyleNum);
    if(log_SelectStyleNum === Infinity || log_SelectStyleNum === '') return;
    pvalue_line.y = [ log_SelectStyleNum, log_SelectStyleNum ];
    reMark_DE_Plot(titleIndex);
  });
  const close_dialog = (val) => toogle_Plot_Screen.value = val;
</script>
<style lang="scss">
  .download_xlsx{
    cursor: pointer;
    // background: rgba(224, 247, 250,0.6);
  }
</style>
