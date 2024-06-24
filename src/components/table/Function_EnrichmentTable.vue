<template>
  <div>
    <div class="">
      <v-data-table fixed-header :headers="feHeaders" v-model:items-per-page="itemsPerPage"
      :items="feTableBody" height="800" item-value="#term ID" :items-per-page-options="pageItemsOptions"
      >
      <template v-slot:header.matching_proteins_in_your_network_labels="{ column }">
        {{ column.title }} 
        <span :style="{color:regulate === 'UP' ? 'red' : 'blue' }">
          ({{ regulate.toUpperCase() }})
        </span> 
      </template>
      <template  v-slot:item.term_ID="{item}">
        <div class="d-flex">
          <p class="align-self-start" >{{ item.term_ID }}</p>
        </div>
      </template>
      <template v-slot:item.observed_gene_count="{item}">
        <div :style="{color:regulate === 'UP' ? 'red' : 'blue' }">
          {{ item.observed_gene_count }}
        </div>
      </template>
      <template v-slot:item.strength="{item}">
        <div style="color:rgb(158,202,225)">
          {{ item.strength }}
        </div>
      </template>
      <template v-slot:item.matching_proteins_in_your_network_labels="{ item }">
        <div class="my-1" :style="{color:regulate === 'UP' ? 'red' : 'blue' }">
          <span class="" v-for="(ii, key) in item.matching_proteins_in_your_network_labels" :key="key">
            <span v-if="toogleLabels[item['#term ID']]? key > 0 : key < 10">{{ ii }}
              <span class="mr-1" v-if="toogleLabels[item['#term ID']] ? key>0 && key < item.matching_proteins_in_your_network_labels.length - 1: key < 9">,</span> </span>
          </span>
          <p>
            <v-btn class="d-flex align-self-center ml-2" v-if="!toogleLabels[item['#term ID']] && item.matching_proteins_in_your_network_labels.length > 10" color="blue-grey" variant="outlined"  size="x-small" @click="toogleLabels[item['#term ID']] = true">
              <v-icon icon="fa:fas fa-sort-down" style="font-size: 18px;"></v-icon>
            </v-btn>
            <v-btn v-if="toogleLabels[item['#term ID']] && item.matching_proteins_in_your_network_labels.length > 10" color="blue-grey" variant="outlined" class="ml-2" size="x-small" @click="toogleLabels[item['#term ID']] = false">
              <v-icon icon="fa:fas fa-sort-up" style="font-size: 18px;"></v-icon>
            </v-btn>
          </p>
        </div>
      </template>
    </v-data-table>
    </div>
  </div>
</template>
<script setup>
  import { ref, watch } from 'vue';
  const props = defineProps(['feheaders', 'feTableData']);
  const feTableBody = ref([]);
  const feHeaders = ref([
  {key:'category', title:'Category',align:'center',sortable:true, width:'4vw'},
  {key: 'term_ID', title: '#Term ID', align: 'start', sortable: true,width:'6vw'},
  {key: 'term description', title: 'Term description', align: 'center', sortable: true,width:'8vw'},
  {key: 'observed_gene_count', title: 'Observed gene count', align: 'center', sortable: true, width:'5vw'},
  {key: 'background gene count', title: 'Background gene count', align: 'center', sortable: true,width:'5vw'},
  {key: 'strength', title: 'Strength', align: 'center', sortable: true, width:'5vw'},
  {key: 'false discovery rate', title: 'FDR', align: 'center', sortable: true, width:'115px'},
  {key: 'matching_proteins_in_your_network_labels', title: 'Matching proteins in your network', align: 'start', sortable:false}
  // {key: 'matching proteins in your network (IDs)', title: 'matching proteins in your network (IDs)', align: 'start', sortable: true},
  // {key: 'matching proteins in your network (labels)', title: 'matching proteins in your network (labels)', align: 'start', sortable: true}
  ]);
  const itemsPerPage = ref(25);
  const toogleLabels = ref({});
  const pageItemsOptions = ref([
    {value: 10, title: '10'},
    {value: 25, title: '25'},
    {value: 50, title: '50'},
    {value: 100, title: '100'},
  ]);
const regulate = ref('UP');
  const displayTableInfo = (tableInfo)=>{
    regulate.value = tableInfo.regulation;
    const changeStyle = JSON.parse(JSON.stringify(tableInfo.data));
    for(let i = 0 ; changeStyle.length > i ; i++){
      toogleLabels[changeStyle[i]['#term ID']] = false;
      const  changeStyleArr = changeStyle[i]['matching proteins in your network (labels)'].split(',');
      if(!changeStyle[i]['#term_ID']){
        changeStyle[i]['term_ID'] = changeStyle[i]['#term ID']
      }
      if(!changeStyle[i]['matching_proteins_in_your_network_labels']){
        changeStyle[i]['matching_proteins_in_your_network_labels'] = changeStyleArr;
        // changeStyle[i]['matching_proteins_in_your_network_labels'] = changeStyle[i]['matching proteins in your network (labels)'];
      }
      if(!changeStyle[i]['observed_gene_count']){
        changeStyle[i]['observed_gene_count'] = changeStyle[i]['observed gene count'];
      }
    }
    feTableBody.value = changeStyle;
  };
  watch(props.feTableData,(newValue)=>{
    if(!newValue.data || newValue.data.length === 0)return;
    displayTableInfo(newValue);
  });
</script>