<template>
  <div>
    <v-tabs v-model="condition_header" color="primary" @click="displayRNAseqTable">
      <v-tab v-for="(item, i) in conditionHeaders" color="primary" :key="i" class="text-none">
        {{ item }}
      </v-tab>
    </v-tabs>
    <div class="d-flex justify-end  mt-1">
      <div class="d-flex align-center mb-1 mr-3" >
        <v-icon v-if="!toggleCircularLoadingPage" icon="fa:fas fa-file-arrow-down" class="text-teal mr-3" style="font-size: 24px;" @click="toggleCircularLoadingPage = true; exportXlsxFile()"></v-icon>
        <div class="d-flex mr-3" v-else>
          <p style="font-weight: bolder;">waiting</p>
          <v-progress-circular class="ml-2" :size="30" color="teal" indeterminate ></v-progress-circular>
        </div>
      </div>
      <div class="d-flex align-center" style="width:250px">
        <v-icon icon="fa:fas fa-magnifying-glass" class="mr-3"></v-icon>
        <v-text-field
          v-model="search_RNAseq" label="Search" single-line  variant="solo-filled" 
          density="compact"  append-inner-icon="fa:fas fa-close" @click:append-inner="search_RNAseq = ''">
        </v-text-field>
      </div>
    </div>
    <v-data-table fixed-header v-model:items-per-page="itemsPerPage" :headers="tableComponentInfo.headers"
      :items="tableComponentInfo.body" item-value="Sample name" class="elevation-1" :height="dataTable_height"
      :search="search_RNAseq" :items-per-page-options="pageItemsOptions" :loading="dataTableLoading">
      <template v-slot:item.Length="{item}">
        <div>
          {{ item.Length.toLocaleString('en-US') }}
        </div>
      </template>
      <template v-slot:item.Start="{item}">
        <div>{{ item.Start.toLocaleString('en-US') }}</div>
      </template>
      <template v-slot:item.Stop="{item}">
        <div>{{ item.Stop.toLocaleString('en-US') }}</div>
      </template>
      <template v-slot:item.normalizedCount="{item}">
        <div>{{ item.normalizedCount.toLocaleString('en-US') }}</div>
      </template>
      <template v-slot:item.readcount="{item}">
        <div>{{ item.readcount.toLocaleString('en-US') }}</div>
      </template>
    </v-data-table>
  </div>
</template>
<script setup>
import { ref, reactive, shallowRef  } from 'vue';
import { dataFolder_RNAseq } from '../../service/rna_seq_dataservice';
import { Subject, takeUntil, debounceTime } from 'rxjs';
const itemsPerPage = ref(25);
const comSubject$ = new Subject();
let table_RNAseq = {}
const condition_header = ref(0);
const search_RNAseq = ref('');
const conditionHeaders = ref([]);
const dataTable_height = ref('');
const tableComponentInfo = ref({});
const toggleCircularLoadingPage =ref(false);
// let miRNATables = {};
const pageItemsOptions = ref([
  {value: 10, title: '10'},
  {value: 25, title: '25'},
  {value: 50, title: '50'},
  {value: 100, title: '100'},
]);
let tabsRNA_Data = {};
const tableHeader_RNA_seq = [
  // {title: 'Gene Symbol', align: 'center', sortable: true, key: 'title'},
  {title: 'Gene ID', align: 'center', sortable: true, key: 'gene_id'},
  {title: 'Gene Symbol', align: 'center', sortable: true, key: 'gene_name'},
  {title: 'Gene Type', align: 'center', sortable: true, key: 'gene_type'},
  {title: 'NormalizedCount', align: 'center', sortable: true, key: 'normalizedCount'},
  {title: 'Readcount', align: 'center', sortable: true, key: 'readcount'},
  {title: 'Chromosome', align: 'center', sortable: true, key: 'Chromosome'},
  {title: 'Length', align: 'center', sortable: true, key: 'Length'},
  {title: 'Start', align: 'center', sortable: true, key: 'Start'},
  {title: 'Stop', align: 'center', sortable: true, key: 'Stop'},
  {title: 'Strand', align: 'center', sortable: true, key: 'Strand'},  
];
const dataTableLoading = shallowRef(false);
dataFolder_RNAseq.RNAseq_handleRawReadsFolder$.pipe(takeUntil(comSubject$),debounceTime(300)).subscribe((rowReads_normalizedData)=>{
  createdRNAseqTable(rowReads_normalizedData);
});
dataFolder_RNAseq.closeXlsx_info$.pipe(takeUntil(comSubject$),debounceTime(300)).subscribe((boolean)=>{
  toggleCircularLoadingPage.value = boolean;
})
const createdRNAseqTable = (rowReads_normalizedData)=>{
  if( !rowReads_normalizedData.globalData || rowReads_normalizedData.globalData.length === 0) return;
  // conditionHeaders.value = rowReads_normalizedData.sampleNameTitle.sort();
  conditionHeaders.value = rowReads_normalizedData.sampleNameTitle;
  const sampleNameIndex = rowReads_normalizedData.globalTitle.indexOf('Gene Symbol');
  tabsRNA_Data = {};
  for(let i = 0 ; rowReads_normalizedData.sampleNameTitle.length > i ; i++){
    if(!tabsRNA_Data[rowReads_normalizedData.sampleNameTitle[i]]){ 
      tabsRNA_Data[rowReads_normalizedData.sampleNameTitle[i]] = {}
    }
    for(let j = 0 ; rowReads_normalizedData.globalData.length > j ; j++){
      if(!tabsRNA_Data[rowReads_normalizedData.sampleNameTitle[i]][rowReads_normalizedData.globalData[j][sampleNameIndex]]){
        tabsRNA_Data[rowReads_normalizedData.sampleNameTitle[i]][rowReads_normalizedData.globalData[j][sampleNameIndex]] = {};
        tabsRNA_Data[rowReads_normalizedData.sampleNameTitle[i]][rowReads_normalizedData.globalData[j][sampleNameIndex]].title = rowReads_normalizedData.globalData[j][sampleNameIndex];
        tabsRNA_Data[rowReads_normalizedData.sampleNameTitle[i]][rowReads_normalizedData.globalData[j][sampleNameIndex]].readcount = Number(rowReads_normalizedData.rowReadsData[j][i]);
        tabsRNA_Data[rowReads_normalizedData.sampleNameTitle[i]][rowReads_normalizedData.globalData[j][sampleNameIndex]].normalizedCount = Number(rowReads_normalizedData.normalizedData[j][i]);
        for(let k = 0 ; rowReads_normalizedData.globalTitle.length > k ; k++){
          if(!tabsRNA_Data[rowReads_normalizedData.sampleNameTitle[i]][rowReads_normalizedData.globalData[j][sampleNameIndex]][rowReads_normalizedData.globalTitle[k]]){
            let transformNumber;
            if(rowReads_normalizedData.globalTitle[k] === 'Start' || rowReads_normalizedData.globalTitle[k] === 'Stop' || rowReads_normalizedData.globalTitle[k] === 'Length' ){
              transformNumber = Number( rowReads_normalizedData.globalData[j][k] );
            }else{
              transformNumber = rowReads_normalizedData.globalData[j][k];
            }
            tabsRNA_Data[rowReads_normalizedData.sampleNameTitle[i]][rowReads_normalizedData.globalData[j][sampleNameIndex]][rowReads_normalizedData.globalTitle[k]] =  transformNumber;
          }
        }
      }
    }
  }
  
  table_RNAseq = tabsRNA_Data;
  const windowInnerheight = window.innerHeight;
  dataTable_height.value =  Math.ceil((windowInnerheight - 340)/ windowInnerheight * 100) + 'vh';
  displayRNAseqTable();
}
const displayRNAseqTable = ()=>{
  dataTableLoading.value = true;
  const selectedHeaderName = conditionHeaders.value[condition_header.value];
  const displayTableArr = [];
  const select_RNAseq_name = Object.keys(table_RNAseq[selectedHeaderName]);
  for(let i  = 0 ; select_RNAseq_name.length > i ; i++){
    const collect_RNAseq = table_RNAseq[selectedHeaderName][select_RNAseq_name[i]];
    collect_RNAseq.title = select_RNAseq_name[i];
    displayTableArr.push(collect_RNAseq);
  }
  tableComponentInfo.value.headers = tableHeader_RNA_seq;
  tableComponentInfo.value.body = displayTableArr;
  setTimeout(()=>{ dataTableLoading.value = false; },1000);
}
const exportXlsxFile = async()=>{
  const tabsRNA_Data_pageName = Object.keys(tabsRNA_Data);
  let tabsRNA_Data_Val_header = [];
  let tabsRNA_Data_Val_Body = [];
  for(let i = 0 ; tabsRNA_Data_pageName.length > i ; i++){
    const tabsRNA_Data_ObjectValue = Object.values(tabsRNA_Data[tabsRNA_Data_pageName[i]]);
    tabsRNA_Data_Val_Body[i] = [];
    for(let j = 0 ; tabsRNA_Data_ObjectValue.length > j ;j++){
      if(i === 0 && j === 0) tabsRNA_Data_Val_header= Object.keys(tabsRNA_Data_ObjectValue[j]);
      tabsRNA_Data_Val_Body[i].push(Object.values(tabsRNA_Data_ObjectValue[j]));
    }
    tabsRNA_Data_Val_Body[i].unshift(tabsRNA_Data_Val_header);
  }
  await dataFolder_RNAseq.export_Visualization(tabsRNA_Data_Val_Body, tabsRNA_Data_pageName);
}
</script>
<style scope lang="scss">
  .v-table .v-data-table__th,  .v-table .v-data-table__td{
    font-weight: 600 !important;
  }
</style>