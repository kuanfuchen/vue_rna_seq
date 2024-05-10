<template>
  <div class="pt-3">
    <v-card >
      <template v-slot:title>
        <p class="text-h4 text-teal">Function Enrichment Analysis</p>
      </template>
      <v-card-text class="mt-3">
        <p>
          {{ dispalyCondition }}
        </p>
        <div class="d-flex">
          <div class="px-3" style="width:30vw">
            <v-select label="Select Regular" :items="['UP','DOWN']" 
              v-model="selectRegular" variant="outlined" density="compact">
            </v-select>
          </div>
          <div class="px-3" style="width:30vw">
            <v-select density="compact" label="Show quantity" :items="['10','20','30','50']" variant="outlined"
              v-model="displayBarNum">
            </v-select>
          </div>
        </div>
        <div class="d-flex">
          <v-checkbox v-model="checkAll" label="All" class="mx-1" @change="changeSelect(checkAll)"></v-checkbox>
          <v-checkbox v-model="MF" label="Molecullar Function" class="mx-1"></v-checkbox>
          <v-checkbox v-model="BP" label="Biological Process" class="mx-1"></v-checkbox>
          <v-checkbox v-model="CC" label="Cellular Component" class="mx-1"></v-checkbox>
          <!-- <v-checkbox v-model="KEGG" label="KEGG" class="mx-1"></v-checkbox>
          <v-checkbox v-model="pubMed" label="PubMed" class="mx-1"></v-checkbox> -->
        </div>
        <div>
          <v-btn color="indigo-darken-3" class="text-none" @click="handleFunctionEnrichment" >Enter</v-btn>
        </div>
      </v-card-text>
      <v-card-text>
        <!-- <div> -->
          <v-row no-gutters>
            <v-col cols="6">
              <BarPlot_FE :fe_obsergene_data="data_obseredGeneCollect"></BarPlot_FE>
            </v-col>
            <v-col cols="6">
              <DotPlot_FE :fe_Dot_Plot="data_StrengthCollect"></DotPlot_FE>
            </v-col>
          </v-row>
        <!-- </div> -->
      </v-card-text>
      <v-card-text>
        <FeTable :feheaders="headers" :feTableData="feTableBody" />
      </v-card-text>
    </v-card>
  </div>
</template>
<script setup>
  import { Subject, takeUntil, debounceTime } from 'rxjs';
  import { papaDate } from '../../service/papaResolve_getData';
  import { ref, reactive } from 'vue';
  import FeTable from '../../components/table/Function_EnrichmentTable.vue';
  import BarPlot_FE from '../../components/poltly/BarPlot_Fun_Enrich.vue';
  import DotPlot_FE from '../../components/poltly/DotPlot_Func_Enrich.vue';
  const checkAll = ref(false);
  const MF = ref(true);
  const BP = ref(false);
  const CC = ref(false);
  const dispalyCondition = ref('q-value <= 0.05, -1 <= log2 fold change < =1')
  // const KEGG = ref(false);
  // const pubMed = ref(false);
  const selectRegular = ref('UP');
  const displayBarNum = ref(10);
  const comSubject$ = new Subject();
  const headers = reactive([]);
  const data_obseredGeneCollect = reactive({
    data:{},
    items:[],
    FDR:{},
    desc:{},
  });
  const data_StrengthCollect = reactive({
    data:{},
    items:[],
    FDR:{},
    desc:{},
  });
  const feTableBody = reactive({items:[], data:[]});
  let functionEnrichData = [];
  papaDate.papaFun_enrichment$.pipe(takeUntil(comSubject$),debounceTime(300)).subscribe(async(papaData) => {
    functionEnrichData = papaData;
    await handleHeaders(papaData.headers);
    await handleFunctionEnrichment();
  });
  const handleHeaders = (feheaders)=>{
    for(let i = 0 ; feheaders.length > i ; i++){
      headers.push({
        key:feheaders[i],
        title:feheaders[i],
        align:'start',
        sortable: true
      })
    };
  }
  const changeSelect = (ev)=>{
    MF.value = ev;
    BP.value =ev;
    CC.value = ev;
    // KEGG.value = ev;
    // pubMed.value = ev;
  }
  const pushTableInfo = (data, arr, category) => {
    for(let i = 0 ; data.length > i ; i++){
      if(Object.keys(data[i]).length > 1) data[i].category = category;
      arr.push(data[i]);
    }
  }
  const handleFunctionEnrichment = async()=>{
    // if(!MF.value && !BP.value && !CC.value && !KEGG.value && !pubMed.value  ) return;
    if( !MF.value && !BP.value && !CC.value ) return;
    const feData = functionEnrichData.data;
    feTableBody.items.length = 0;
    feTableBody.data.length = 0;
    const selectRegularLower = selectRegular.value.toLowerCase();
    const selectRegularData = feData[selectRegularLower];
    let exportTableInfo = [];
    const selectItem = [];
    const obseredGeneCollect = {};
    const strengthCollect = {};
    const geneFDR = {};
    const desc_RNA_seq = {};
    data_obseredGeneCollect.data = {};
    data_obseredGeneCollect.FDR = {};
    data_obseredGeneCollect.desc = {};
    data_StrengthCollect.desc = {};
    data_StrengthCollect.data = {};
    data_StrengthCollect.FDR = {};
    if(MF.value){
      await pushTableInfo(selectRegularData.MF.data, exportTableInfo,'MF')
      selectItem.push('MF');
    }
    if(BP.value){
      await pushTableInfo(selectRegularData.BP.data, exportTableInfo,'BP')
      selectItem.push('BP');
    }
    if(CC.value){
      await pushTableInfo(selectRegularData.CC.data, exportTableInfo,'CC');
      selectItem.push('CC');
    }
    // if(pubMed.value){
    //   await pushTableInfo(selectRegularData.pubMed.data, exportTableInfo);
    //   selectItem.push('pubMed');
    // }
    if(exportTableInfo.length === 0) return;
    exportTableInfo = exportTableInfo.filter((item)=>{
      if(Object.keys(item).length > 1)return item
    })
    feTableBody.items = selectItem;
    feTableBody.data = exportTableInfo;
    feTableBody.regulation = selectRegular.value;
    for(let i = 0 ; exportTableInfo.length > i ;i++){
      if(!obseredGeneCollect[exportTableInfo[i]['#term ID']]) obseredGeneCollect[exportTableInfo[i]['#term ID']] = exportTableInfo[i]['observed gene count'];
      if(!strengthCollect[exportTableInfo[i]['#term ID']])strengthCollect[exportTableInfo[i]['#term ID']] = exportTableInfo[i].strength;
      if(!desc_RNA_seq[exportTableInfo[i]['#term ID']])desc_RNA_seq[exportTableInfo[i]['#term ID']] = exportTableInfo[i]['term description'];
      if(!geneFDR[exportTableInfo[i]['#term ID']]){
        const log10_FDR = Math.log10(Number(exportTableInfo[i]['false discovery rate'])) * -1;
        geneFDR[exportTableInfo[i]['#term ID']] = log10_FDR;
        // geneFDR[exportTableInfo[i]['#term ID']] = exportTableInfo[i]['false discovery rate']
      };
    }
    const obseredGeneCollect_keys = Object.keys(obseredGeneCollect);
    for(let i = 0 ; obseredGeneCollect_keys.length > i ; i++){
      if(i < displayBarNum.value){
        if(!data_obseredGeneCollect.data[obseredGeneCollect_keys[i]]){
          data_obseredGeneCollect.data[obseredGeneCollect_keys[i]] = obseredGeneCollect[obseredGeneCollect_keys[i]];
          data_obseredGeneCollect.FDR[obseredGeneCollect_keys[i]] = geneFDR[obseredGeneCollect_keys[i]];
          data_obseredGeneCollect.desc[obseredGeneCollect_keys[i]] = desc_RNA_seq[obseredGeneCollect_keys[i]]
        }
        if(!data_StrengthCollect.data[obseredGeneCollect_keys[i]]){
          data_StrengthCollect.data[obseredGeneCollect_keys[i]] = strengthCollect[obseredGeneCollect_keys[i]];
          data_StrengthCollect.FDR[obseredGeneCollect_keys[i]] = geneFDR[obseredGeneCollect_keys[i]];
          data_StrengthCollect.desc[obseredGeneCollect_keys[i]] = desc_RNA_seq[obseredGeneCollect_keys[i]]
        }
        // if(!data_obseredGeneCollect.FDR[obseredGeneCollect_keys[i]]{
          // data_obseredGeneCollect.FDR[obseredGeneCollect_keys[i] =
        // })
      }
    }
    data_obseredGeneCollect.items = selectItem;
    data_StrengthCollect.items = selectItem;
  }
</script>