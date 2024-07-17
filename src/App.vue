<template>
  <div class="allContainer mx-auto">
    <router-view/>
  </div>
</template>
<script setup>
  import { onBeforeMount } from 'vue';
  import {dataFolder_RNAseq} from './service/rna_seq_dataservice.js';
  import { papaDate } from './service/papaResolve_getData.js';
  onBeforeMount( async () => {
  await  dataFolder_RNAseq.handleProject();
  await dataFolder_RNAseq.handleRNAseqQCReadAlignmentfolder();
  await dataFolder_RNAseq.rnaSeq_handleRawReads_normalizedCounts();
  await dataFolder_RNAseq.handleRNAseq_CPM_PCA();
  await dataFolder_RNAseq.handled_RNAseq_DE();
  await papaDate.searchFunction_enrichment_file();
});
</script>
<style lang="scss">
  .allContainer{
    width:97vw;
  }
</style>
