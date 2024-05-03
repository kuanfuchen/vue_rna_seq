<template>
  <div>
    <div class="">
      <v-data-table fixed-header :headers="feHeaders" v-model:items-per-page="itemsPerPage"
      :items="feTableBody" height="800" item-value="#term ID" :items-per-page-options="pageItemsOptions"
      
      ></v-data-table>
    </div>
  </div>
</template>
<script setup>
  import { ref, onMounted, watch } from 'vue';
  const props = defineProps(['feheaders', 'feTableData']);
  const feTableBody = ref([]);
  const feHeaders = ref([
  // {key: '#term ID', title: '#term ID', align: 'center', sortable: true},
  // {key: 'term description', title: 'term description', align: 'center', sortable: true},
  // {key: 'observed gene count', title: 'observed gene count', align: 'center', sortable: true},
  // {key: 'background gene count', title: 'background gene count', align: 'center', sortable: true},
  // {key: 'strength', title: 'strength', align: 'center', sortable: true},
  // {key: 'false discovery rate', title: 'false discovery rate', align: 'center', sortable: true},
  // {key: 'matching proteins in your network (IDs)', title: 'matching proteins in your network (IDs)', align: 'start', sortable: true},
  // {key: 'matching proteins in your network (labels)', title: 'matching proteins in your network (labels)', align: 'start', sortable: true}
  ]);
  const itemsPerPage = ref(25);
  const pageItemsOptions = ref([
  {value: 10, title: '10'},
  {value: 25, title: '25'},
  {value: 50, title: '50'},
  {value: 100, title: '100'},
]);
  const displayTableInfo = (tableInfo)=>{
    const changeStyle = JSON.parse(JSON.stringify(tableInfo.data));
    feTableBody.value = changeStyle;
    // feTableBody.value = changeStyle.filter((item)=>{
    //   if(Object.keys(item).length > 1)return item
    // });
  };
  watch(props.feTableData,(newValue)=>{
    if(!newValue.data || newValue.data.length === 0)return;
    displayTableInfo(newValue);
  });
  onMounted(()=>{
    feHeaders.value =  props.feheaders;        
  });
</script>