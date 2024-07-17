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
                <template v-slot:title>
                  <span class="font-weight-bold">Scatter Plot</span>
                </template>
                <ScatterPlot :plot_size="plot_height"  :scatterGraphInfo="selectedSampleTitle" ></ScatterPlot>
              </v-card>
            </v-col>
          <v-col :cols="plot_cols">
            <v-card class="px-3 plotStyle" width="100%">
              <template v-slot:title>
                <span class="font-weight-bold" >Box Plot</span>
              </template>
              <BoxPlot :plot_size="plot_height" ></BoxPlot>
            </v-card>
          </v-col>
          <v-col :cols="plot_cols">
            <v-card class="px-3" width="100%" height="650px">
              <template v-slot:title>
                <p class="pr-3 font-weight-bold d-flex">PCA Plot<span style="font-size: 14px;">( Color by condition )</span></p>
              </template>
              <PCA_plot :plot_size="plot_height"></PCA_plot>
            </v-card>
          </v-col>
          <v-col :cols="plot_cols">
            <v-card class="px-3" width="100%" height="650px">
              <template v-slot:title>
                <span class="font-weight-bold pr-3">Heatmap Plot (top 100 variance)</span>
              </template>
              <div  style="height: 100%;" class="d-flex align-center">
                <Dendrograms  ></Dendrograms>
              </div>
              
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
  import { dataFolder_RNAseq } from '../service/rna_seq_dataservice.js';
  import { Subject, takeUntil, debounceTime } from 'rxjs';
  import BoxPlot from '../components/poltly/BoxPlot.vue';
  import ScatterPlot from '../components/poltly/ScatterPlot.vue';
  import PCA_plot from '../components/poltly/PCAPlot.vue';
  import Dendrograms from '../components/poltly/Dendrogram.vue';
  import Visualization_Table from '../components/table/Visualization_Table.vue';
  const comSubject$ = new Subject();
  const selctedSampleItem = ref([]);
  const sample1Item = ref('');
  const sample2Item = ref('');
  const selectedSampleTitle = reactive([]);
  const displayStyle = ref(['QC Graph', 'Table']);
  const useStyleTab = ref(0);
  const plot_height = reactive({
    height:550
  });
  const plot_cols = ref(6);
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