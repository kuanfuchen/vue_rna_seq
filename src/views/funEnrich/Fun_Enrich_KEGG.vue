<template>
  <div class="pt-3">
    <v-card >
      <template v-slot:title>
        <p class="text-h4 text-teal">Function Enrichment KEGG Analysis</p>
      </template>
      <v-card-text>
        <p>
          {{ dispalyCondition }}
        </p>
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
        <div class="">
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
        <div class="">
          <span>up-regulation DEGs</span>
          <span>down-regulation DEGs</span>
        </div>
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
  const comSubject$ = new Subject();
  const dispalyCondition = ref('q-value <= 0.05, -1 <= log2 fold change < =1');
  // const KEGG = ref(false);
  const select_kegg_Regular = ref('UP');
  const display_KEGG_BarNum = ref(10);
  const data_KEGG_obseredGeneCollect = reactive({
    data:[],
    items:['KEGG'],
    FDR:{},
    desc:{}
  });
  const data_KEGG_strengthCollect = reactive({
    data:{},
    items:['KEGG'],
    FDR:{},
    desc:{}
  })
  const kegg_headers = reactive([]);
  const fe_KEGG_TableBody = reactive({items:[], data:[]});
  let fe_KEGG_Table = [];
  const gene_KEGG_FDR = {};
  papaDate.papaFun_enrichment$.pipe(takeUntil(comSubject$),debounceTime(300)).subscribe(async(papaData) => {
    fe_KEGG_Table = papaData;
    await handleHeaders(papaData.headers);
    await handleFe_KEGG();
  });
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
    data_KEGG_obseredGeneCollect.data = {};
    data_KEGG_obseredGeneCollect.FDR = {};
    data_KEGG_obseredGeneCollect.desc = {};
    data_KEGG_strengthCollect.data = {};
    data_KEGG_strengthCollect.FDR = {};
    data_KEGG_strengthCollect.desc = {};
    const tableInfo = [];
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
      if(!gene_KEGG_FDR[tableInfo[i]['#term ID']])gene_KEGG_FDR[tableInfo[i]['#term ID']] = tableInfo[i]['false discovery rate'];
      if(!desc_RNA_seq_KEGG[tableInfo[i]['#term ID']]) desc_RNA_seq_KEGG[tableInfo[i]['#term ID']] = tableInfo[i].desc;
    }
    const obseredGeneCollect_KEGG_keys = Object.keys(obseredGeneCollect_KEGG);
    for(let i = 0 ; obseredGeneCollect_KEGG_keys.length > i ; i++){
      if(i < display_KEGG_BarNum.value){
        if(!data_KEGG_obseredGeneCollect.data[obseredGeneCollect_KEGG_keys[i]]){
          data_KEGG_obseredGeneCollect.data[obseredGeneCollect_KEGG_keys[i]] = obseredGeneCollect_KEGG[obseredGeneCollect_KEGG_keys[i]];
          data_KEGG_obseredGeneCollect.FDR[obseredGeneCollect_KEGG_keys[i]] = gene_KEGG_FDR[obseredGeneCollect_KEGG_keys[i]];
          data_KEGG_obseredGeneCollect.desc[obseredGeneCollect_KEGG_keys[i]] = desc_RNA_seq_KEGG[obseredGeneCollect_KEGG_keys[i]];
        }
        if(!data_KEGG_strengthCollect.data[obseredGeneCollect_KEGG_keys[i]]){
          data_KEGG_strengthCollect.data[obseredGeneCollect_KEGG_keys[i]] = strengthCollect_KEGG[obseredGeneCollect_KEGG_keys[i]];
          data_KEGG_strengthCollect.FDR[obseredGeneCollect_KEGG_keys[i]] = gene_KEGG_FDR[obseredGeneCollect_KEGG_keys[i]];
          data_KEGG_strengthCollect.desc[obseredGeneCollect_KEGG_keys[i]] = desc_RNA_seq_KEGG[obseredGeneCollect_KEGG_keys[i]];
        }
      }
    }
  }
</script>