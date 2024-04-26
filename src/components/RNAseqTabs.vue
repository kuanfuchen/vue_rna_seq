<template>
  <v-card >
    <div class="d-flex align-center">
      <v-tabs v-model="miRNATab" color="primary">
        <v-tab class="text-none" :value="tab" v-for="(tab, index) in miRNATabs" :key="index" @click="selectedTable(index)">{{ tab }}</v-tab>
      </v-tabs>
      <div class="download_xlsx ml-auto" @click="exportFile">
        <v-icon icon="fa:fas fa-file-arrow-down" class="mr-5 text-teal" style="font-size: 24px;"></v-icon>
      </div>
    </div>
    <v-card-text>
      <v-window v-model="miRNATab">
        <v-window-item v-for="(tab, index) in miRNATabs" :key="index" :value="tab">
          <DisplayTable :table="tableComponentInfo" :useSearch="false"></DisplayTable>
          <!-- :exportName="props.export_miRNA_Name" -->
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>
<script setup>
  import { ref,reactive } from 'vue';
  import { Subject, takeUntil, debounceTime } from 'rxjs';
  const miRNATabs = ref([]);
  const comSubject$ = new Subject();
  const miRNATab = ref('');
  const RNAseqTables = ref([]);
  const props = defineProps(['export_miRNA_Name']);
  // import { dataService } from '../service/data_service';
  import DisplayTable from './DisplayTable.vue';
  const tableComponentInfo = reactive({
    headers:[],
    body:[]
  });
  import {dataFolder_RNAseq} from '../service/rna_seq_dataservice';
  // dataService.transferMeg$.pipe(takeUntil(comSubject$)).subscribe((miRNAInfo) => {
  //   miRNATabs.value = miRNAInfo.tabs;
  //   miRNATab.value = miRNAInfo.tabs[0];
  //   RNAseqTables.value = miRNAInfo.tabsTable;
  //   handleTableComponent(miRNAInfo.tabsTable[0]);
  // });
  dataFolder_RNAseq.rnaseq_ReadAlignmentSubject$.pipe(takeUntil(comSubject$),debounceTime(100)).subscribe((rnaSeqReadAlignment)=>{
    miRNATabs.value = rnaSeqReadAlignment.tabs;
    miRNATab.value = rnaSeqReadAlignment.tabs[0];
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
        // headers.push('Total nonUnique read');
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
    tableComponentInfo.headers = tableInfo.headers;
    tableComponentInfo.body = tableInfo.body;
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
</style>