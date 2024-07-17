<template>
  <v-card >
    <div class="d-flex align-center">
      <v-tabs v-model="rnaTab" color="primary">
        <v-tab class="text-none" :value="tab" v-for="(tab, index) in rnaseqTabs" :key="index" @click="selectedTable(index)">{{ tab }}</v-tab>
      </v-tabs>
      <div class="download_xlsx ml-auto" @click="exportFile">
        <v-icon icon="fa:fas fa-file-arrow-down" class="mr-5 text-teal" style="font-size: 24px;"></v-icon>
      </div>
    </div>
    <v-card-text>
      <v-window v-model="rnaTab">
        <v-window-item v-for="(tab, index) in rnaseqTabs" :key="index" :value="tab">
          <DisplayTable :table="tableComponentInfo" :useSearch="false"></DisplayTable>
          <div class="mt-2" v-if="rnaTab === 'Alignment'">
            <p class="text-h7">
              1. Total reads: total fragments in paired-end (the term “read” refers to the fragment being sequenced, and since each fragment is sequenced from two directions, one can expect to get two alignments per fragment).
            </p>
            <p class="text-h7 mt-1">
              2. %Aligned: the fraction of all the reads that were aligned to the reference assembly (multi-mappers are also taken into account). %Aligned = (%Unique paired) + (%Non-unique paired).
            </p>
            <p class="text-h7 mt-1">
              3. %Unique paired: fraction of alignments corresponding to the reads where both of the paired reads can be uniquely aligned.
            </p>
            <p class="text-h7 mt-1">
              4. %Non-unique paired: fraction of paired reads that align to multiple locations.%Non-unique paired: fraction of paired reads that align to multiple locations
            </p>
            <p class="text-h6">Reference information: <a class="ml-2" href="https://documentation.partek.com/pages/viewpage.action?pageId=3768905" target="_blank">Click Here</a></p>
          </div>
          <div class="mt-2" v-else>
            <p class="text-h7 mt-1">
              %N: proportion of no-calls.
            </p>
          </div>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>
<script setup>
  import { ref,reactive } from 'vue';
  import { Subject, takeUntil, debounceTime } from 'rxjs';
  const rnaseqTabs = ref([]);
  const comSubject$ = new Subject();
  const rnaTab = ref('');
  const RNAseqTables = ref([]);
  const props = defineProps(['export_miRNA_Name']);
  // import { dataService } from '../service/data_service';
  import DisplayTable from './DisplayTable.vue';
  const tableComponentInfo = reactive({
    headers:[],
    body:[]
  });
  import {dataFolder_RNAseq} from '../service/rna_seq_dataservice';
  dataFolder_RNAseq.rnaseq_ReadAlignmentSubject$.pipe(takeUntil(comSubject$),debounceTime(100)).subscribe((rnaSeqReadAlignment) => {
    rnaseqTabs.value = rnaSeqReadAlignment.tabs;
    rnaTab.value = rnaSeqReadAlignment.tabs[0];
    RNAseqTables.value = rnaSeqReadAlignment.tabsTable;
    handleTableComponent(rnaSeqReadAlignment.tabsTable[0]);
  });
  const selectedTable = (index)=>{
    if(index > RNAseqTables.value.length || index < 0) return;
    handleTableComponent(RNAseqTables.value[index])
  };
  const handleTableComponent = (tableInfo) => {
    const headers = [];
    tableInfo.headers.forEach((header) => {
    switch(header){
      case 'Total alignments':
        headers.push('Total alignments reads');
        break;
      case 'Aligned':
        headers.push('%Aligned');
        break;
      case 'Total unaligned':
        headers.push('Total unaligned reads');
        break;
      case 'Unaligned':
        headers.push('%Unaligned')
        break;
      case 'Total unique':
        headers.push('Total unique')
        break;
      case "Unique":
        headers.push('%Unique');
        break;
      case "Total non-unique":
        headers.push('Total non-unique read');
        break;
      case "Non-unique":
        headers.push('%Non-unique')
        break;
      case 'Unique paired':
        headers.push('%Unique paired')
        break;
      case 'Non-unique paired':
        headers.push('%Non-unique paired');
        break;
      default:
        headers.push(header)
    }});
    tableInfo.headers = headers;
    if(rnaTab.value === 'Alignment'){
      const alignmentBody = [];
      // 0.1.2.4.9,10,11,12
      tableComponentInfo.headers = ['Sample name', 'condition', 'Total reads','Aligned reads', '%Aligned', 'Total unique paired', '%Unique paired', 'Total non-unique paired', '%Non-unique paired']
      for(let i = 0 ; tableInfo.body.length > i ; i++){
        alignmentBody[i] = [];
        for(let j = 0 ; tableInfo.body[i].length > j ; j++){
          if(j <= 2 || j === 4 || j >= 9 && j <=12){
            alignmentBody[i].push(tableInfo.body[i][j])
          }
        }
        const alignReads = parseInt(tableInfo.body[i][2] * Math.round(tableInfo.body[i][4] * 100) / 100 / 100).toString();
        alignmentBody[i].splice(3,0, alignReads)
      }
      tableComponentInfo.body = alignmentBody;
    }else{
      tableComponentInfo.headers = tableInfo.headers;
      tableComponentInfo.body = tableInfo.body;
    }
    
  };
  const exportFile = ()=>{
    const combinationTable = [];
    const RNAseqTablesVal = JSON.parse(JSON.stringify(RNAseqTables.value));
    for(let i = 0 ; RNAseqTablesVal.length > i ; i++){
      const table = [];
      table.push(RNAseqTablesVal[i].headers);
      for(let j = 0; RNAseqTablesVal[i].body.length > j ; j++){
        table.push(RNAseqTablesVal[i].body[j])
      }
      combinationTable.push(table);
    }
    dataFolder_RNAseq.exportXlsx(combinationTable, 'readAndAlignment');
  }
</script>
<style lang="scss">
  .download_xlsx{
    cursor: pointer;
  }
  .text-h7{
    font-size: 16px;
    // color:#03A9F4;
  }
</style>