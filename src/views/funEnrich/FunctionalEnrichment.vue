<template>
  <div class="pt-3">
    <v-card >
      <template v-slot:title>
        <p class="text-h4 text-teal">Function Enrichment Analysis</p>
      </template>
      <v-card-text>
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
          <v-btn color="indigo-darken-3" class="text-none ml-3" @click="handleFunctionEnrichment" >Enter</v-btn>
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
  import filter_RNA_num from '../../utils/filterRNA_seq_num.js';
  import { dataFolder_RNAseq } from '../../service/rna_seq_dataservice.js';
  const checkAll = ref(false);
  const MF = ref(true);
  const BP = ref(false);
  const CC = ref(false);
  const up_RNA_seq_num = ref(0);
  const down_RNA_seq_num = ref(0);
  const dispalyCondition = ref('q-value ≤ 0.05, -1 ≤ log2 fold change ≤ 1')
  // const KEGG = ref(false);
  // const pubMed = ref(false);
  const selectRegular = ref('UP');
  const displayBarNum = ref(10);
  const comSubject$ = new Subject();
  const headers = reactive([]);
  const data_obseredGeneCollect = reactive([]);
  const data_StrengthCollect = reactive([]);
  const feTableBody = reactive({items:[], data:[]});
  const compare_de_title_group = ref([]);
  const compare_de_title = ref('');
  let functionEnrichData = [];
  dataFolder_RNAseq.RNAseq_DE_Folder_Info$.pipe(takeUntil(comSubject$), debounceTime(300)).subscribe(async(deFolderData)=>{
    compare_de_title_group.value = deFolderData.title_Group;
    if(deFolderData.title_Group.length > 0 ) compare_de_title.value = deFolderData.title_Group[0];
    const rna_num = await filter_RNA_num(0, deFolderData);
    await display_filter_RNA_num(rna_num);
  });
  papaDate.papaFun_enrichment$.pipe(takeUntil(comSubject$),debounceTime(300)).subscribe(async(papaData) => {
    functionEnrichData = papaData;
    await handleHeaders(papaData.headers);
    await handleFunctionEnrichment();
  });
  const display_filter_RNA_num = (RNA_seq_num)=>{
    up_RNA_seq_num.value = RNA_seq_num.positive_position_number;
    down_RNA_seq_num.value = RNA_seq_num.negative_position_number;
  };
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
    data_obseredGeneCollect.length = 0;
    data_StrengthCollect.length = 0;
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
        data_obseredGeneCollect.push({
          name:obseredGeneCollect_keys[i],
          data:Number(obseredGeneCollect[obseredGeneCollect_keys[i]]),
          FDR:geneFDR[obseredGeneCollect_keys[i]],
          desc:desc_RNA_seq[obseredGeneCollect_keys[i]]
        });
        data_StrengthCollect.push({
          name:obseredGeneCollect_keys[i],
          data:Number(strengthCollect[obseredGeneCollect_keys[i]]),
          FDR:geneFDR[obseredGeneCollect_keys[i]],
          desc:desc_RNA_seq[obseredGeneCollect_keys[i]]
        })
      }
    }
  }
</script>