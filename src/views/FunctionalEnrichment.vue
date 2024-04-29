<template>
  <div class="pt-3">
    <v-card >
      <template v-slot:title>
        <p class="text-h4 text-teal">Function Enrichment Analysis</p>
      </template>
      <v-card-text>
        <div>
          <v-select label="Select Regular" :items="['UP','DOWN']" style="width:30vw"
            v-model="selectRegular" variant="outlined"></v-select>
        </div>
        <div class="d-flex">
          <v-checkbox v-model="checkAll" label="All" class="mx-1" @change="changeSelect(checkAll)"></v-checkbox>
          <v-checkbox v-model="MF" label="Molecullar Function" class="mx-1"></v-checkbox>
          <v-checkbox v-model="BP" label="Biological Process" class="mx-1"></v-checkbox>
          <v-checkbox v-model="CC" label="Cellular Component" class="mx-1"></v-checkbox>
          <v-checkbox v-model="KEGG" label="KEGG" class="mx-1"></v-checkbox>
          <v-checkbox v-model="pubMed" label="PubMed" class="mx-1"></v-checkbox>
        </div>
        <div class="">
          <v-btn @click="handleFunctionEnrichment" >Enter</v-btn>
        </div>
      </v-card-text>
      <v-card-text>
        <div class="">
          <BarPlot_FE :fe_obsergene_data="data_obseredGeneCollect"></BarPlot_FE>
        </div>
        <div class="">
          <DotPlot_FE ></DotPlot_FE>
        </div>
      </v-card-text>
      <v-card-text>
        <FeTable :feheaders="headers" :feTableData="feTableBody" />
      </v-card-text>
    </v-card>
    
  </div>
</template>
<script setup>
  import { Subject, takeUntil,debounceTime } from 'rxjs';
  import { papaDate } from '../service/papaResolve_getData';
  import { ref, reactive,onMounted } from 'vue';
  import FeTable from '../components/table/Function_Enrichment.vue';
  import BarPlot_FE from '../components/poltly/BarPlot_Fun_Enrich.vue';
  import DotPlot_FE from '../components/poltly/DotPlot_Func_Enrich.vue';
  const checkAll = ref(false);
  const MF = ref(true);
  const BP = ref(false);
  const CC = ref(false);
  const KEGG = ref(false);
  const pubMed = ref(false);
  const selectRegular = ref('UP');
  const comSubject$ = new Subject();
  const headers = reactive([]);
  const data_obseredGeneCollect = reactive({});
  const data_StrengthCollect = reactive({});
  const feTableBody = reactive({items:[], data:[]});
  let functionEnrichData = [];
  papaDate.papaFun_enrichment$.pipe(takeUntil(comSubject$),debounceTime(300)).subscribe(async(papaData) => {
    
    functionEnrichData = papaData;
    await handleHeaders(papaData.headers);
    await handleFunctionEnrichment();
  });
  const handleHeaders = (feheaders)=>{

    for(let i = 0 ; feheaders.length > i ; i++){
      // const headerKey = feheaders[i].split(' ').join(' ');
      // const headerKey = feheaders[i]
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
    KEGG.value = ev;
    pubMed.value = ev;
  }
  const pushTableInfo = (data, arr)=>{
    for(let i = 0 ; data.length > i ; i++){
      arr.push(data[i]);
    }
  }
  const handleFunctionEnrichment = async()=>{
    if(!MF.value && !BP.value && !CC.value && !KEGG.value && !pubMed.value  ) return;
    const feData = functionEnrichData.data;
    feTableBody.items.length = 0;
    feTableBody.data.length = 0;
    const selectRegularLower = selectRegular.value.toLowerCase();
    const selectRegularData = feData[selectRegularLower];
    let exportTableInfo = [];
    const selectItem = [];
    const obseredGeneCollect = {};
    const strengthCollect = {};
    if(MF.value){
      await pushTableInfo(selectRegularData.MF.data, exportTableInfo)
      selectItem.push('MF');
    }
    if(BP.value){
      await pushTableInfo(selectRegularData.BP.data, exportTableInfo)
      selectItem.push('BP');
    }
    if(CC.value){
      await pushTableInfo(selectRegularData.CC.data, exportTableInfo);
      selectItem.push('CC');
    }
    if(KEGG.value){
      await pushTableInfo(selectRegularData.KEGG.data, exportTableInfo)
      selectItem.push('KEGG');
    }
    if(pubMed.value){
      await pushTableInfo(selectRegularData.pubMed.data, exportTableInfo);
      selectItem.push('pubMed');
    }

    if(exportTableInfo.length === 0) return;
    exportTableInfo = exportTableInfo.filter((item)=>{
      if(Object.keys(item).length > 1)return item
    })
    feTableBody.items = selectItem;
    feTableBody.data = exportTableInfo;
    for(let i = 0 ; exportTableInfo.length > i ;i++){
      if(!obseredGeneCollect[exportTableInfo[i]['#term ID']]) obseredGeneCollect[exportTableInfo[i]['#term ID']] = exportTableInfo[i]['observed gene count'];
      if(!strengthCollect[exportTableInfo[i]['#term ID']])strengthCollect[exportTableInfo[i]['#term ID']] = exportTableInfo[i].strength;
    }
    data_obseredGeneCollect.data = obseredGeneCollect;
    data_obseredGeneCollect.items = selectItem;
    data_StrengthCollect.items = selectItem;
    data_StrengthCollect.data = strengthCollect;
    console.log(obseredGeneCollect, 'obseredGeneCollect')
    console.log(strengthCollect,'strengthCollect')
  }
  onMounted(()=>{});
</script>
<style scope>

</style>