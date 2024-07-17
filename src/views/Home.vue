<template>
  <v-container class="">
    <v-responsive class="align-center fill-height">
      <v-card class="mx-auto ">
        <template v-slot:title>
          <div class="text-h4 text-teal text-bold mb-6">Project Information</div>
        </template>
        <v-card-text class="d-flex tableBackground" v-for="( userInfo, index ) in projectUsrInfo.userInfoOrder" :key="index">
          <div class="v-row mt-1">
            <p class="v-col-md-4 v-col-xl-3 text-h6">{{ userInfo }}</p>
            <p class="v-col-md-8 v-col-xl-9 text-h6">{{ projectUsrInfo[userInfo] }}</p>
          </div>
        </v-card-text>
      </v-card>
    </v-responsive>
  </v-container>
</template>
<script setup>
/* eslint-disable */
import { ref } from 'vue';
import { Subject, takeUntil } from 'rxjs';
import { dataFolder_RNAseq } from '../service/rna_seq_dataservice.js';
const comSubject$ = new Subject();
const projectUsrInfo = ref({
  'userInfoOrder': ['Project ID', 'Date', 'Institute', 'Customer','Organism', 'Genome', 'Gene annotation'],
  'Organism':'',
  'Project ID':'',
  'Institute':'',
  'Customer':'',
  'Genome':'',
  'Date':'2024-1-1',
  'Gene annotation':''
})
const handleProjectInfo = (projectInfo)=>{
  const objInfo = Object.entries(projectInfo);
  for(let i = 0 ; objInfo.length > i ; i++){
    projectUsrInfo.value[objInfo[i][0]] = objInfo[i][1]
  }
}
dataFolder_RNAseq.RNAseq_Project_info$.pipe(takeUntil(comSubject$)).subscribe(async(projectInfo)=>{
  await handleProjectInfo(projectInfo);
});
</script>
<style scoped>
  .tableBackground{
    background:#eceff1;
  }
</style>
