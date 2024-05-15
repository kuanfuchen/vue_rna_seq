<template>
  <div>
    <div class="d-flex justify-space-between mb-2">
      <div class="mt-1 d-flex align-center">
        <div class="mr-2" v-if="toggleShowSelect">
          <v-btn color="teal" density="comfortable" @click.prevent="selected_display_plot_text" >
            <v-icon icon="fa:fas fa-image" style="font-size: 16px;"></v-icon>
          </v-btn>
        </div>
        <div class="" v-if="toggleShowSelect">
          <v-btn color="primary" class="text-none" density="comfortable" @click="reseted_display_plot_text" :disabled="selected_RNA_seq.length === 0">
            Reset
          </v-btn>
        </div>
      </div>
      <div class="d-flex align-center" v-if="definedprops.useSearch">
        <v-text-field v-if="definedprops.closeSearch !== true"
          v-model="search_RNAname_field" variant="solo-filled"
          label="RNA Name search" hide-details style="width:250px"
          single-line density="compact">
        </v-text-field>
        <v-btn class="ml-2" color="primary" @click="search_RNAname = search_RNAname_field">
          <v-icon icon="fa:fas fa-magnifying-glass"></v-icon>
        </v-btn>
      </div>
    </div>
    <v-data-table
      v-model:items-per-page="itemsPerPage" fixed-header :items="tableBody"
      :headers="headers" v-model:search="search_RNAname" item-value="Sample name"
      :height="dataTable_height" :show-select="toggleShowSelect"
      :loading="dataLengthLoading"
      return-object class="elevation-1"
      :custom-filter="filterMiRNA"
      v-model="selected_RNA_seq">
      <template v-slot:item.Ratio="{item}">
        <div>
          <p :style="{ 'color': Number(item.Log2Ratio) >=0 ? '#D32F2F' : '#2962FF' }">{{ Math.abs(item.Ratio) > 0.001? item.Ratio.toLocaleString('en-US'):item.Ratio }}</p>
        </div>
      </template>
      <template v-slot:item.Log2Ratio="{item}">
        <div>
          <p :style="{ 'color': Number(item.Log2Ratio) >=0 ? '#D32F2F' : '#2962FF' }">{{ Math.abs(item.Log2Ratio) > 0.01? item.Log2Ratio.toLocaleString('en-US'):item.Log2Ratio }}</p>
        </div>
      </template>
      <template v-slot:item.Totalreads="{item}">
        <div>
          {{ item.Totalreads.toLocaleString('en-US') }}
      </div>
      </template>
      <template v-slot:item.Totalalignmentsreads="{item}">
        <div>
          {{ item.Totalalignmentsreads.toLocaleString('en-US') }}
        </div>
      </template>
      <template v-slot:item.Totaluniquepaired = "{ item }">
        <div >
          {{ item.Totaluniquepaired.toLocaleString('en-US') }}
        </div>
      </template>
      <template v-slot:item.Totalunalignedreads="{item}">
        <div>
          {{ item.Totalunalignedreads.toLocaleString('en-US') }}
        </div>
      </template>
      <template v-slot:item.Totalnon-uniquepaired="{item}">
        <div>
          {{ item['Totalnon-uniquepaired'].toLocaleString('en-US') }}
        </div>
      </template>
      <template v-slot:item.Totalunique="{ item }">
        <div>
          {{  item.Totalunique.toLocaleString('en-US')  }}
        </div>
      </template>
      <template v-slot:item.Foldchange="{ item }">
        <div>
          {{  item.Foldchange.toLocaleString('en-US')  }}
        </div>
      </template>
      <template v-slot:item.lsmean0="{ item }">
        <div>
          {{  item.lsmean0.toLocaleString('en-US')  }}
        </div>
      </template>
      <template v-slot:item.lsmean1="{ item }">
        <div>
          {{  item.lsmean1.toLocaleString('en-US')  }}
        </div>
      </template>
      <template v-slot:item.GeneIDGeneName="{ item }">
        <div>
          <p>{{ item.GeneIDGeneName.split('-')[0] }}</p>
          <p class="text-primary">{{ item.GeneIDGeneName.split('-')[1] }}</p>
        </div>
      </template>
      <!-- <template v-slot:item.Start="{ item }">
        <div>
          {{  item.Start.toLocaleString('en-US')  }}
        </div>
      </template>
      <template v-slot:item.Stop="{ item }">
        <div>
          {{  item.Stop.toLocaleString('en-US')  }}
        </div>
      </template>
      <template v-slot:item.Length="{ item }">
        <div>
          {{  item.Length.toLocaleString('en-US')  }}
        </div>
      </template>
      <template v-slot:item.Totalcounts="{ item }">
        <div>
          {{  item.Totalcounts.toLocaleString('en-US')  }}
        </div>
      </template>
      <template v-slot:item.Maximumcounts="{ item }">
        <div>
          {{  item.Maximumcounts.toLocaleString('en-US')  }}
        </div>
      </template>
      <template v-slot:item.Geometricmean="{ item }">
        <div>
          {{  item.Geometricmean.toLocaleString('en-US')  }}
        </div>
      </template>
      <template v-slot:item.Arithmeticmean="{ item }">
        <div>
          {{  item.Arithmeticmean.toLocaleString('en-US')  }}
        </div>
      </template> -->
    </v-data-table>
  </div>
</template>
<script setup>
  import { ref, onMounted, watch, defineEmits } from 'vue';
  const itemsPerPage = ref(25);
  const definedprops = defineProps (['table','useSearch', 'expresstablestyle']);
  // 'exportName',
  const emits = defineEmits(['select_RNAseq_name']);
  // import { dataService } from '../service/data_service.js'; 
  const toggleShowSelect = ref(false);
  const selected_RNA_seq = ref([]);
  const headers = ref([]);
  const tableBody = ref([]);
  const dataTable_height = ref('');
  const search_RNAname_field = ref('');
  const search_RNAname = ref('');
  const dataLengthLoading = ref(false);
  const listenTable = () => {
    const tableInfo = definedprops.table;
    if(tableInfo.headers.length === 0) return;
    if(tableInfo.body.length > 3000)dataLengthLoading.value = true;
    return new Promise((resolve, reject)=>{
    selected_RNA_seq.value.length = 0;
    let bodyInfo = [];
    if(tableInfo.showCheckBox) toggleShowSelect.value = true;
    const geneIDindex = tableInfo.headers.indexOf('Gene ID');
    const geneNameIndex = tableInfo.headers.indexOf('Gene name');
    for(let i = 0 ; tableInfo.body.length > i ; i++){
      let setLSMeanKeyNumber = -1;
      
      bodyInfo[i] = [];
      for(let j = 0 ; tableInfo.headers.length > j ; j++){
      // header
        let checkLSMean = -1;
        checkLSMean = tableInfo.headers[j].indexOf('LSMean');
        
        let headerSplitWord;
        if(checkLSMean > -1) {
          setLSMeanKeyNumber ++;
          headerSplitWord = 'lsmean' + setLSMeanKeyNumber;
        }else{
          headerSplitWord = tableInfo.headers[j].split(/\s/).join('').trim();
        }
        if(i === 0){
          if(headerSplitWord !=='Chromosome' && headerSplitWord !== 'Start' && headerSplitWord !== 'Stop' && headerSplitWord !== 'Length' && headerSplitWord !== 'Strand' &&
          headerSplitWord !== 'headerSplitWord' && headerSplitWord !== 'Maximumcounts' && headerSplitWord !== 'Geometricmean' && headerSplitWord !== 'Arithmeticmean' &&
          headerSplitWord !== 'Havanagene' && headerSplitWord !== 'Hgncid' && headerSplitWord !== 'Level' && headerSplitWord !== 'Ont' && headerSplitWord !=='GeneID' 
          && headerSplitWord !=='Genename'){
            const uppercaseFirst = tableInfo.headers[j].split('');
            const getFirst = uppercaseFirst.splice(0, 1);
            const firstcase=getFirst[0].toUpperCase();
            const combinedTitle = firstcase+ uppercaseFirst.join('');
            headers.value.push({
              title:combinedTitle,
              align: 'center',
              sortable: true,
              key: checkLSMean === -1 ? headerSplitWord : 'lsmean' + setLSMeanKeyNumber, 
              // fixed: headerSplitWord === 'GeneID' ? true : false,
            })
          }
          // const uppercaseFirst = tableInfo.headers[k].split('');
          // const getFirst = uppercaseFirst.splice(0, 1);
          // const firstcase=getFirst[0].toUpperCase();
          // const combinedTitle = firstcase+ uppercaseFirst.join('');
          // headers.value.push({
          //   title:combinedTitle,
          //   align: 'center',
          //   sortable: true,
          //   key: checkLSMean === -1 ? headerSplitWord : 'lsmean' + setLSMeanKeyNumber, 
          //   fixed: headerSplitWord === 'GeneID' ? true : false,
          // })
        }
        if(!bodyInfo[i][headerSplitWord]){
          bodyInfo[i][headerSplitWord] = tableInfo.body[i][j];
        }
        if(geneIDindex > -1 && geneNameIndex > -1 && !bodyInfo[i]['GeneIDGeneName']){
          bodyInfo[i]['GeneIDGeneName'] = `${tableInfo.body[i][0]} -  ${tableInfo.body[i][1]}`;
        }
      }
      if(i === 0){
        if( geneIDindex > -1 && geneNameIndex > -1 ){
            headers.value.unshift({
              title:'Gene ID - Gene Name',
              align: 'center',
              sortable: true,
              key: 'GeneIDGeneName',
              fixed:true
            })
          }
      }
    }
    for(let i = 0; headers.value.length > i ; i++){
      if(headers.value[i].key === 'condition'){
        bodyInfo =  bodyInfo.sort((a, b)=>{
          const conditionA = a['condition'].toLowerCase();
          const conditionB = b['condition'].toLowerCase();
          if(conditionA < conditionB){ return -1 }
        });
      }
    }
    for(let i = 0 ; bodyInfo.length > i ; i++){
      const bodyInfoKeys = Object.keys(bodyInfo[i]);
      for( let j = 0 ; bodyInfoKeys.length > j ; j++ ){
        if( bodyInfoKeys[j] !== 'GeneID' && bodyInfoKeys[j] !== 'Chromosome' && bodyInfoKeys[j] !== 'Genename' && bodyInfoKeys[j]!== 'Strand' && bodyInfoKeys[j] !== 'Genetype'
          && bodyInfoKeys[j] !== 'Log2Ratio' && bodyInfoKeys[j] !== "Ratio" && bodyInfoKeys[j] !== 'Level' && bodyInfoKeys[j] !== 'Havanagene' && bodyInfoKeys[j]  !=='Hgncid'
          && bodyInfoKeys[j] !== 'Ont' && bodyInfoKeys[j] !== 'Geneid' && bodyInfoKeys[j] !== 'Up_Down' && bodyInfoKeys[j] !== 'Samplename' && bodyInfoKeys[j] !== 'condition'
          && bodyInfoKeys[j] !== 'GeneIDGeneName' ){
            if(bodyInfo[i][bodyInfoKeys[j]] !== '?' ){
              const [ base, exponent ] = bodyInfo[i][bodyInfoKeys[j]].split('E').map(Number);
              if( exponent !== undefined && exponent !== 0 ){
                bodyInfo[i][bodyInfoKeys[j]] = Number(bodyInfo[i][bodyInfoKeys[j]]).toExponential(2);
              }else{
                const val = Math.round(Number(base)*100) / 100;
                if(val > 0){
                  bodyInfo[i][bodyInfoKeys[j]] = val;
                }else{
                  const numToExponential= Number(bodyInfo[i][bodyInfoKeys[j]]).toExponential(2);
                  if(Number(numToExponential)=== 0){
                    bodyInfo[i][bodyInfoKeys[j]] =  0;
                  }else{
                    bodyInfo[i][bodyInfoKeys[j]] = numToExponential;
                  }
                }
              };
            }
        }
      }
    }
    if(bodyInfo.length >= 20){
      const windowInnerheight = window.innerHeight;
      const redundant_remove_table_height = typeof definedprops.expresstablestyle === 'number' ? definedprops.expresstablestyle : 0;
      dataTable_height.value =  Math.ceil((windowInnerheight - 330 - redundant_remove_table_height)/ windowInnerheight * 100) + 'vh';
    }
      resolve(bodyInfo)
    }).then((bodyInfo) => {
      tableBody.value = bodyInfo;
      if(dataLengthLoading.value){
        setTimeout(()=>{
          dataLengthLoading.value = false;
        },1000)
      }
    })
    
  };
  const selected_display_plot_text = ()=>{
    const RNAseq = [];
    console.log(selected_RNA_seq.value, 'selected_RNA_seq')
    selected_RNA_seq.value.forEach((item)=>{
      RNAseq.push(item.GeneID)
    });
    emits('select_RNAseq_name', RNAseq);
  }
  const reseted_display_plot_text = ()=>{
    selected_RNA_seq.value.length = 0;
    emits('select_RNAseq_name', []);;
  }
  const filterMiRNA = (val, query, item)=>{
    return val != null && query != null && typeof val === 'string'&& item.columns.GeneIDGeneName.indexOf(query) !==-1&& val.toString().toLocaleUpperCase().indexOf(query) !== -1
  };
  watch(definedprops.table,(/*newTble*/)=>{
    headers.value.length = 0;
    tableBody.value.length = 0;
    listenTable();
  })
  onMounted(()=>{
    if(tableBody.value.length > 0)return;
    listenTable()
  })
</script>
<style lang="scss">
  .v-table .v-data-table__th,  .v-table .v-data-table__td{
    font-weight: 600 !important;
  }
</style>