<template>
  <div class="pt-3">
    <v-card >
      <template v-slot:title>
        <p class="text-h4 text-teal">Function Enrichment KEGG Analysis</p>
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
          <!-- <v-checkbox v-model="checkAll" label="All" class="mx-1" @change="changeSelect(checkAll)"></v-checkbox> -->
          <!-- <v-checkbox v-model="MF" label="Molecullar Function" class="mx-1"></v-checkbox>
          <v-checkbox v-model="BP" label="Biological Process" class="mx-1"></v-checkbox>
          <v-checkbox v-model="CC" label="Cellular Component" class="mx-1"></v-checkbox> -->
          <v-checkbox v-model="KEGG" label="KEGG" class="mx-1"></v-checkbox>
          <!-- <v-checkbox v-model="pubMed" label="PubMed" class="mx-1"></v-checkbox> -->
        </div>
        <div class="">
          <v-btn color="indigo-darken-3" class="text-none" @click="handleFunctionEnrichment" >Enter</v-btn>
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
  import { ref } from 'vue';
  const KEGG = ref(false)
</script>