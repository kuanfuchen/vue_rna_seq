<template>
  <div class="pt-3">
    <v-card >
      <template v-slot:title>
        <p class="text-h4 text-teal">Function Enrichment KEGG Analysis</p>
      </template>
      <v-card-text>
        <!-- <p class="mb-2 pl-4 py-2" style="background: #90CAF9;border-radius: 5px;">
          Condition {{ dispalyCondition }}
        </p> -->
        <div class="mb-2 ml-3 py-2" style="background: #90CAF9;border-radius: 5px;">
          <p class="ml-3">Filtered by {{ dispalyCondition }}</p> 
          <p class="ml-3">DEGs: <span>{{ up_RNA_seq_num + down_RNA_seq_num }}</span></p>
          <p class="ml-3" style="color: #B71C1C;">Up:<span class="ml-2">{{ up_RNA_seq_num }}</span></p>
          <p class="ml-3" style="color:#3F51B5">Down:<span class="ml-2">{{ down_RNA_seq_num }}</span></p>
        </div>
        <div class="mt-4">
          <v-row no-gutters>
            <v-col cols="6">
              <!-- <span class="font-weight-bold text-right">Compare</span> -->
              <v-select class="ml-3" label="Select compare" :items="compare_de_title_group" v-model="compare_de_title"
                variant="outlined" density="compact"></v-select>
            </v-col>
          </v-row>
        </div>
        <div class="d-flex mt-3">
          <div class="px-3" style="width:30vw">
            <v-select label="Select Regular" :items="['UP','DOWN']" 
              v-model="select_kegg_Regular" variant="outlined" density="compact">
            </v-select>
          </div>
          <div class="px-3" style="width:30vw">
            <v-select density="compact" label="Show quantity" :items="['10','20','30','50']" variant="outlined"
              v-model="display_KEGG_BarNum">
            </v-select>
          </div>
        </div>
        <div class="mt-2 ml-3">
          <v-btn color="indigo-darken-3" class="text-none" @click="handleFe_KEGG()" >Enter</v-btn>
        </div>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <BarPlot_FE :fe_obsergene_data="data_KEGG_obseredGeneCollect"></BarPlot_FE>
          </v-col>
          <v-col cols="6">
            <DotPlot_FE :fe_Dot_Plot="data_KEGG_strengthCollect"></DotPlot_FE>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <!-- <div class="">
          <span>up-regulation DEGs</span>
          <span>down-regulation DEGs</span>
        </div> -->
        <FeTable :feheaders="kegg_headers" :feTableData="fe_KEGG_TableBody" />
      </v-card-text>
    </v-card>
  </div>
</template>
<script setup>
  import { Subject, takeUntil,debounceTime } from 'rxjs';
  import { papaDate } from '../../service/papaResolve_getData';
  import { ref, reactive } from 'vue';
  import FeTable from '../../components/table/Function_EnrichmentTable.vue';
  import BarPlot_FE from '../../components/poltly/BarPlot_Fun_Enrich.vue';
  import DotPlot_FE from '../../components/poltly/DotPlot_Func_Enrich.vue';
  import filter_RNA_num from '../../utils/filterRNA_seq_num.js';
  import { dataFolder_RNAseq } from '../../service/rna_seq_dataservice.js';
  const comSubject$ = new Subject();
  const dispalyCondition = ref('q-value ≤ 0.05, -1 ≤ log2 fold change ≤ 1');
  // const KEGG = ref(false);
  const select_kegg_Regular = ref('UP');
  const display_KEGG_BarNum = ref(10);
  const data_KEGG_obseredGeneCollect = reactive([]);
  const data_KEGG_strengthCollect = reactive([])
  const kegg_headers = reactive([]);
  const fe_KEGG_TableBody = reactive({items:[], data:[]});
  const compare_de_title_group = ref([]);
  const compare_de_title = ref('');
  const up_RNA_seq_num = ref(0);
  const down_RNA_seq_num = ref(0);
  let fe_KEGG_Table = [];
  const gene_KEGG_FDR = {};
  dataFolder_RNAseq.RNAseq_DE_Folder_Info$.pipe(takeUntil(comSubject$), debounceTime(300)).subscribe(async(deFolderData)=>{
    compare_de_title_group.value = deFolderData.title_Group;
    if(deFolderData.title_Group.length > 0 ) compare_de_title.value = deFolderData.title_Group[0];
    const rna_num = await filter_RNA_num(0, deFolderData);
    await display_filter_RNA_num(rna_num);
  });
  papaDate.papaFun_enrichment$.pipe(takeUntil(comSubject$),debounceTime(300)).subscribe(async(papaData) => {
    fe_KEGG_Table = papaData;
    await handleHeaders(papaData.headers);
    await handleFe_KEGG();
  });
  const display_filter_RNA_num = (RNA_seq_num)=>{
    up_RNA_seq_num.value = RNA_seq_num.positive_position_number;
    down_RNA_seq_num.value = RNA_seq_num.negative_position_number;
  };
  const handleHeaders = (feheaders)=>{
    for(let i = 0 ; feheaders.length > i ; i++){
      kegg_headers.push({
        key:feheaders[i],
        title:feheaders[i],
        align:'start',
        sortable: true
      })
    };
  }
  const handleFe_KEGG = async()=>{
    fe_KEGG_TableBody.items.length = 0;
    fe_KEGG_TableBody.data.length = 0;
    data_KEGG_obseredGeneCollect.length = 0;
    data_KEGG_strengthCollect.length = 0;
    const tableInfo = [];
    fe_KEGG_TableBody.regulation = select_kegg_Regular.value;
    // fe_KEGG_Table.data = data
    const selectArrow = select_kegg_Regular.value.toLowerCase();
    const selectedTableData = fe_KEGG_Table.data[selectArrow]['KEGG'].data;
    for(let i = 0 ; selectedTableData.length > i ; i++ ){
      if(Object.keys(selectedTableData[i]).length > 1){
        selectedTableData[i].category = 'KEGG';
        tableInfo.push(selectedTableData[i])
      }
    }
    fe_KEGG_TableBody.items = ['KEGG'];
    fe_KEGG_TableBody.data = tableInfo;
    drawPlotKEGG_info(tableInfo)
  }
  const drawPlotKEGG_info = (tableInfo)=>{
    const obseredGeneCollect_KEGG = {};
    const strengthCollect_KEGG = {};
    const desc_RNA_seq_KEGG = {};
    for(let i = 0; tableInfo.length > i ; i++){
      if(!obseredGeneCollect_KEGG[tableInfo[i]['#term ID']]) obseredGeneCollect_KEGG[tableInfo[i]['#term ID']] = tableInfo[i]['observed gene count'];
      if(!strengthCollect_KEGG[tableInfo[i]['#term ID']])strengthCollect_KEGG[tableInfo[i]['#term ID']] = tableInfo[i].strength;
      if(!gene_KEGG_FDR[tableInfo[i]['#term ID']]){
        const log10_FDR = Math.log10(Number(tableInfo[i]['false discovery rate']))* -1;
        gene_KEGG_FDR[tableInfo[i]['#term ID']] = log10_FDR;
      };
      if(!desc_RNA_seq_KEGG[tableInfo[i]['#term ID']]) desc_RNA_seq_KEGG[tableInfo[i]['#term ID']] = tableInfo[i]['term description'];
    }
    const obseredGeneCollect_KEGG_keys = Object.keys(obseredGeneCollect_KEGG);
    for(let i = 0 ; obseredGeneCollect_KEGG_keys.length > i ; i++){
      if(i < display_KEGG_BarNum.value){
        data_KEGG_obseredGeneCollect.push({
          name:obseredGeneCollect_KEGG_keys[i],
          data:Number(obseredGeneCollect_KEGG[obseredGeneCollect_KEGG_keys[i]]),
          FDR:gene_KEGG_FDR[obseredGeneCollect_KEGG_keys[i]],
          desc:desc_RNA_seq_KEGG[obseredGeneCollect_KEGG_keys[i]],
        });
        data_KEGG_strengthCollect.push({
          name:obseredGeneCollect_KEGG_keys[i],
          data:Number(strengthCollect_KEGG[obseredGeneCollect_KEGG_keys[i]]),
          FDR:gene_KEGG_FDR[obseredGeneCollect_KEGG_keys[i]],
          desc:desc_RNA_seq_KEGG[obseredGeneCollect_KEGG_keys[i]]
        });
      }
    }
  }
</script>