<template>
  <div class="pt-3">
    <v-card >
      <template v-slot:title>
        <p class="text-h4 text-teal">Function Enrichment Analysis</p>
      </template>
      <v-card-text>
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
        <div class="">
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
  import FeTable from '../../components/table/Function_Enrichment.vue';
  import BarPlot_FE from '../../components/poltly/BarPlot_Fun_Enrich.vue';
  import DotPlot_FE from '../../components/poltly/DotPlot_Func_Enrich.vue';
  const checkAll = ref(false);
  const MF = ref(true);
  const BP = ref(false);
  const CC = ref(false);
  // const KEGG = ref(false);
  // const pubMed = ref(false);
  const selectRegular = ref('UP');
  const displayBarNum = ref(10);
  const comSubject$ = new Subject();
  const headers = reactive([]);
  const data_obseredGeneCollect = reactive({
    data:{},
    items:[],
    FDR:{}
  });
  const data_StrengthCollect = reactive({
    data:{},
    items:[],
    FDR:{}
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
  const pushTableInfo = (data, arr)=>{
    for(let i = 0 ; data.length > i ; i++){
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
    data_obseredGeneCollect.data = {};
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
    // if(KEGG.value){
    //   await pushTableInfo(selectRegularData.KEGG.data, exportTableInfo)
    //   selectItem.push('KEGG');
    // }
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
    console.log(exportTableInfo, 'exportTableInfo')
    for(let i = 0 ; exportTableInfo.length > i ;i++){
      if(!obseredGeneCollect[exportTableInfo[i]['#term ID']]) obseredGeneCollect[exportTableInfo[i]['#term ID']] = exportTableInfo[i]['observed gene count'];
      if(!strengthCollect[exportTableInfo[i]['#term ID']])strengthCollect[exportTableInfo[i]['#term ID']] = exportTableInfo[i].strength;
      if(!geneFDR[exportTableInfo[i]['#term ID']])geneFDR[exportTableInfo[i]['#term ID']] = exportTableInfo[i]['false discovery rate'];
    }
    const obseredGeneCollect_keys = Object.keys(obseredGeneCollect);

    for(let i = 0 ; obseredGeneCollect_keys.length > i ; i++){
      if(i < displayBarNum.value){
        if(!data_obseredGeneCollect.data[obseredGeneCollect_keys[i]]){
          data_obseredGeneCollect.data[obseredGeneCollect_keys[i]] = obseredGeneCollect[obseredGeneCollect_keys[i]];
          data_obseredGeneCollect.FDR[obseredGeneCollect_keys[i]] = geneFDR[obseredGeneCollect_keys[i]];
        }
        if(!data_StrengthCollect.data[obseredGeneCollect_keys[i]]){
          data_StrengthCollect.data[obseredGeneCollect_keys[i]] = strengthCollect[obseredGeneCollect_keys[i]];
          data_StrengthCollect.FDR[obseredGeneCollect_keys[i]] = geneFDR[obseredGeneCollect_keys[i]];
        }
        // if(!data_obseredGeneCollect.FDR[obseredGeneCollect_keys[i]]{
          // data_obseredGeneCollect.FDR[obseredGeneCollect_keys[i] =
        // })
      }
    }
    console.log(data_obseredGeneCollect, 'data_obseredGeneCollect')
    console.log(data_StrengthCollect, 'data_StrengthCollect')
    // data_obseredGeneCollect.data = obseredGeneCollect;
    data_obseredGeneCollect.items = selectItem;
    // // data_obseredGeneCollect.FDR = geneFDR;
    data_StrengthCollect.items = selectItem;
    // data_StrengthCollect.data = strengthCollect;
    // data_StrengthCollect.FDR = geneFDR;
  }
</script>