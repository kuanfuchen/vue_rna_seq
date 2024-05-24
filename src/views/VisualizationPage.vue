<template>
  <div class="px-3 py-5">
    <v-card>
      <div class="d-flex justify-space-between">
        <v-tabs v-model="useStyleTab" color="primary" >
          <v-tab v-for="(item, i) in displayStyle" color="primary" :key="i" class="text-none" >
            {{ item }}
          </v-tab>
        </v-tabs>
        <div class="d-flex justify-end mt-2" v-if="useStyleTab === 0">
          <div class="toggle_cols" @click="changed_plot_size(6, 550)">
            <v-icon icon="fa:fas fa-table-columns mr-5"></v-icon>
          </div>
          <div class="toggle_cols" @click="changed_plot_size(12, 700)" v-if="useStyleTab === 0">
            <v-icon icon="fa:far fa-square mr-5"></v-icon>
          </div>
        </div>
      </div>
    <v-card-text>
      <v-window v-model="useStyleTab">
        <v-window-item value="QC Graph">
          <v-row class="pb-1">
            <v-col :cols="plot_cols">
              <v-card class="px-2" width="100%">
                <div class="scatterPlotCompareStyle">
                  <div class="compareStyle">
                    <p class="text-center text-h6 mr-2">Sample1</p>
                    <v-select v-model="sample1Item" @update:modelValue="changeSample1" density="compact"
                    :items="selctedSampleItem" variant="outlined" class="compareSelect"></v-select>
                  </div>
                  <div class="text-h6 mx-5 gapTitle">V.S</div>
                  <div class="compareStyle">
                    <p class="text-center  text-h6 mr-2">Sample2</p>
                    <v-select v-model="sample2Item" @update:modelValue="changeSample2" density="compact"
                      :items="selctedSampleItem" variant="outlined" class="compareSelect"></v-select>
                  </div>
                </div>
                <!--  -->
                <template v-slot:title>
                  <span class="font-weight-bold">Scatter Plot</span>
                </template>
                <ScatterPlot :plot_size="plot_height"  :scatterGraphInfo="selectedSampleTitle" ></ScatterPlot>
              </v-card>
            </v-col>
          <!-- </v-row> -->
          <v-col :cols="plot_cols">
            <v-card class="px-3 plotStyle" width="100%">
              <template v-slot:title>
                <span class="font-weight-bold" >Box Plot</span>
              </template>
              <BoxPlot :plot_size="plot_height" ></BoxPlot>
            </v-card>
          </v-col>
          <v-col :cols="plot_cols">
            <v-card class="px-3" width="100%">
              <template v-slot:title>
                <p class="pr-3 font-weight-bold d-flex">PCA Plot<span style="font-size: 14px;">( Color by condition )</span></p>
              </template>
              <PCA_plot :plot_size="plot_height"></PCA_plot>
            </v-card>
          </v-col>
          <v-col :cols="plot_cols">
            <v-card class="px-3" width="100%">
              <template v-slot:title>
                <span class="font-weight-bold pr-3">Heatmap Plot (top 100 variance)</span>
              </template>
              <Dendrograms  :heatmapHeight="plot_height"></Dendrograms>
            </v-card>
          </v-col>
        </v-row>
        </v-window-item>
        <v-window-item value="Table">
          
          <v-card class="visual_Data_Table">
            <Visualization_Table></Visualization_Table>
          </v-card>
        </v-window-item>
      </v-window>
    </v-card-text>
    </v-card>
  </div>
</template>
<script setup >
  /* eslint-disable */
  import { ref, reactive, shallowRef  } from 'vue';
  import { dataService } from '../service/data_service.js';
  import { dataFolder_RNAseq } from '../service/rna_seq_dataservice.js';
  import { Subject, takeUntil, debounceTime } from 'rxjs';
  import BoxPlot from '../components/poltly/BoxPlot.vue';
  import ScatterPlot from '../components/poltly/ScatterPlot.vue';
  import PCA_plot from '../components/poltly/PCAPlot.vue';
  import Dendrograms from '../components/poltly/Dendrogram.vue';
  import Visualization_Table from '../components/table/Visualization_Table.vue';
  const comSubject$ = new Subject();
  // const tableComponentInfo = ref({});
  // const itemsPerPage = ref(25);
  // let miRNATables = {};
  // const headers = [];
  // const conditionHeaders = ref([]);
  // const condition_header = ref(0);
  const selctedSampleItem = ref([]);
  const sample1Item = ref('');
  const sample2Item = ref('');
  const selectedSampleTitle = reactive([]);
  const displayStyle = ref(['QC Graph', 'Table']);
  const useStyleTab = ref(0);
  // const dataTable_height = ref('');
  // const search_RNAname = ref('');
  // const dataTableLoading = shallowRef(false);
  // let table_RNAseq = {}
  const plot_height = reactive({
    height:550
  });
  const plot_cols = ref(6);
  // const tableHeader_RNA_seq = [
  //   // {title: 'Gene Symbol', align: 'center', sortable: true, key: 'title'},
  //   {title: 'Gene ID', align: 'center', sortable: true, key: 'gene_id'},
  //   {title: 'Gene Symbol', align: 'center', sortable: true, key: 'gene_name'},
  //   {title: 'Gene Type', align: 'center', sortable: true, key: 'gene_type'},
  //   {title: 'NormalizedCount', align: 'center', sortable: true, key: 'normalizedCount'},
  //   {title: 'Readcount', align: 'center', sortable: true, key: 'readcount'},
  //   {title: 'Chromosome', align: 'center', sortable: true, key: 'Chromosome'},
  //   {title: 'Length', align: 'center', sortable: true, key: 'Length'},
  //   {title: 'Start', align: 'center', sortable: true, key: 'Start'},
  //   {title: 'Stop', align: 'center', sortable: true, key: 'Stop'},
  //   {title: 'Strand', align: 'center', sortable: true, key: 'Strand'},
  //   // {title: 'Gene name', align: 'center', sortable: true, key: 'gene_name'},
    
  // ];
  // const pageItemsOptions = ref([
  //   {value: 10, title: '10'},
  //   {value: 25, title: '25'},
  //   {value: 50, title: '50'},
  //   {value: 100, title: '100'},
  //   {value: 1000, title: '1000'}
  // ]);
  // dataFolder_RNAseq.RNAseq_handleRawReadsFolder$.pipe(takeUntil(comSubject$),debounceTime(300)).subscribe((rowReads_normalizedData)=>{
  //   createdRNAseqTable(rowReads_normalizedData);
  // })
  // const createdRNAseqTable = (rowReads_normalizedData)=>{
  //   if( !rowReads_normalizedData.globalData || rowReads_normalizedData.globalData.length === 0) return;
  //   conditionHeaders.value = rowReads_normalizedData.sampleNameTitle.sort();
  //   const sampleNameIndex = rowReads_normalizedData.globalTitle.indexOf('Gene Symbol');
  //   const tabsRNA_Data = {};
  //   for(let i = 0 ; rowReads_normalizedData.sampleNameTitle.length > i ; i++){
  //     if(!tabsRNA_Data[rowReads_normalizedData.sampleNameTitle[i]]){ 
  //       tabsRNA_Data[rowReads_normalizedData.sampleNameTitle[i]] = {}
  //     }
  //     for(let j = 0 ; rowReads_normalizedData.globalData.length > j ; j++){
  //       if(!tabsRNA_Data[rowReads_normalizedData.sampleNameTitle[i]][rowReads_normalizedData.globalData[j][sampleNameIndex]]){
  //         tabsRNA_Data[rowReads_normalizedData.sampleNameTitle[i]][rowReads_normalizedData.globalData[j][sampleNameIndex]] = {};
  //         tabsRNA_Data[rowReads_normalizedData.sampleNameTitle[i]][rowReads_normalizedData.globalData[j][sampleNameIndex]].title = rowReads_normalizedData.globalData[j][sampleNameIndex];
  //         tabsRNA_Data[rowReads_normalizedData.sampleNameTitle[i]][rowReads_normalizedData.globalData[j][sampleNameIndex]].readcount = Number(rowReads_normalizedData.rowReadsData[j][i]);
  //         tabsRNA_Data[rowReads_normalizedData.sampleNameTitle[i]][rowReads_normalizedData.globalData[j][sampleNameIndex]].normalizedCount = Number(rowReads_normalizedData.normalizedData[j][i]);
  //         for(let k = 0 ; rowReads_normalizedData.globalTitle.length > k ; k++){
  //           if(!tabsRNA_Data[rowReads_normalizedData.sampleNameTitle[i]][rowReads_normalizedData.globalData[j][sampleNameIndex]][rowReads_normalizedData.globalTitle[k]]){
  //             let transformNumber;
  //             if(rowReads_normalizedData.globalTitle[k] === 'Start' || rowReads_normalizedData.globalTitle[k] === 'Stop' || rowReads_normalizedData.globalTitle[k] === 'Length' ){
  //               transformNumber = Number( rowReads_normalizedData.globalData[j][k] );
  //             }else{
  //               transformNumber = rowReads_normalizedData.globalData[j][k];
  //             }
  //             tabsRNA_Data[rowReads_normalizedData.sampleNameTitle[i]][rowReads_normalizedData.globalData[j][sampleNameIndex]][rowReads_normalizedData.globalTitle[k]] =  transformNumber;
  //           }
  //         }
  //       }
  //     }
  //   }
  //   table_RNAseq = tabsRNA_Data;
  //   const windowInnerheight = window.innerHeight;
  //   dataTable_height.value =  Math.ceil((windowInnerheight - 340)/ windowInnerheight * 100) + 'vh';
  //   displayRNAseqTable();
  // }
  // const displayRNAseqTable = ()=>{
  //   dataTableLoading.value = true;
  //   const selectedHeaderName = conditionHeaders.value[condition_header.value];
  //   const displayTableArr = [];
  //   const select_RNAseq_name = Object.keys(table_RNAseq[selectedHeaderName]);
  //   for(let i  = 0 ; select_RNAseq_name.length > i ; i++){
  //     const collect_RNAseq = table_RNAseq[selectedHeaderName][select_RNAseq_name[i]];
  //     collect_RNAseq.title = select_RNAseq_name[i];
  //     displayTableArr.push(collect_RNAseq);
  //   }
  //   tableComponentInfo.value.headers = tableHeader_RNA_seq;
  //   tableComponentInfo.value.body = displayTableArr;
  //   setTimeout(()=>{ dataTableLoading.value = false; },2000)
  // }
  dataFolder_RNAseq.RNAseq_visual_scatter_sampleName$.pipe(takeUntil(comSubject$),debounceTime(100)).subscribe((visualization_info)=>{
    const tempSampleList = [];
    for(let i = 0 ; visualization_info.headers.length > i ; i++){
      tempSampleList.push(visualization_info.headers[i])
    };
    selctedSampleItem.value = tempSampleList.sort();
    if(visualization_info.headers.length > 1){
      sample1Item.value = visualization_info.headers[0];
      sample2Item.value = visualization_info.headers[1];
      selectedSampleTitle.length = 0;
      selectedSampleTitle.push(visualization_info.headers[0], visualization_info.headers[1]);
    }
  })
  const changed_plot_size = (colNum, plotSize)=>{
    plot_cols.value = colNum; 
    plot_height.height = plotSize;
  }
  const changeSample1 = (ev)=> {
    sample1Item.value = ev;
    selectedSampleTitle.length = 0;
    selectedSampleTitle.push(sample1Item.value, sample2Item.value)
  };
  const changeSample2 = (ev)=> {
    sample2Item.value = ev;
    selectedSampleTitle.length = 0;
    selectedSampleTitle.push(sample1Item.value, sample2Item.value)
  };
  // const exportXlsxFile = ()=>{
  //   const miRNATables_Obj_Keys = Object.keys(miRNATables);
  //   const visual_table = [];
  //   for(let i = 0 ; miRNATables_Obj_Keys.length > i ; i++){
  //     visual_table[i] = [];
  //     const miRNATables_Obj_Keys_num_key = Object.keys(miRNATables[miRNATables_Obj_Keys[i]]);
  //     let headers_title_Index = -1;
  //     let headers = [];
  //     for(let j = 0 ; miRNATables_Obj_Keys_num_key.length > j ; j++){
  //       visual_table[i][j]=[];
  //       const miRNA_val = miRNATables[miRNATables_Obj_Keys[i]][miRNATables_Obj_Keys_num_key[j]];
  //       if( j===0){
  //         headers = Object.keys(miRNA_val);
  //         headers.unshift('microRNA ID');
  //         headers_title_Index = headers.indexOf('title');
  //         if(headers_title_Index > -1) headers.splice(headers_title_Index, 1);
  //       }
  //       const miRNA_Table_values = Object.values(miRNA_val);
  //       miRNA_Table_values.unshift(miRNATables_Obj_Keys_num_key[j]);
  //       if(headers_title_Index > -1) miRNA_Table_values.splice(headers_title_Index, 1);
  //       visual_table[i][j] = miRNA_Table_values;
  //     }
  //     visual_table[i].unshift(headers);
  //   }
  //   dataService.exportXlsx(visual_table, 'visualization', miRNATables_Obj_Keys);

  // }
</script>
<style lang="scss">
  .v-table .v-data-table__th,  .v-table .v-data-table__td{
    font-weight: 600 !important;
  }
  .download_xlsx, .toggle_cols{
    cursor: pointer;
  }
  .scatterPlotCompareStyle{
    height:100px;
    display: flex;
    justify-content: center;
    .gapTitle{
      display:block
    }
    .compareStyle{
      display: block;
    }
  }
  @media(max-width: 1200px){
    .scatterPlotCompareStyle{
      display: block;
      height:100px;
      .compareSelect{
        width:100%;
        margin-right: 50px;
      }
      .gapTitle{
        display:none
      }
      .compareStyle{
        display: flex;
        
      }
    }
  }
</style>