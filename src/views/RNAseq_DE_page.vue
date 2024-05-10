<template>
  <div>
    <v-card class="px-3 mt-2" width="100%">
        <template v-slot:title>
          <p class="text-teal font-weight-bold">Difference Expression Analysis</p> 
        </template>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="3">
              <v-sheet class="pa-2 ma-2">
                <p class="font-weight-bold text-right">Compare</p>
              </v-sheet>
            </v-col>
            <v-col cols="4">
              <v-sheet>
                <v-select label="Select compare" :items="compare_de_title_group" v-model="compare_de_title" 
                  variant="outlined" density="compact" @update:modelValue="changed_RNAseq_DataInfo"></v-select>
              </v-sheet>
            </v-col>
          </v-row>
          <v-row no-gutters class="pb-2">
            <v-col cols="3">
              <v-sheet class="mx-5">
                <!-- <p class="text-right font-weight-bold">P-value</p> -->
                <v-select label="Select" v-model="selectP_or_Qval" :items="['P-Value', 'Q-Value']" variant="outlined" density="compact"></v-select> 
              </v-sheet>
            </v-col>
            <v-col cols="2">
              <v-sheet>
                <v-text-field density="compact" label="Number(0 ~ 1)" variant="outlined" v-model="p_value_number"
                  type="number" >
                  <!-- @update:modelValue="changed_RNAseq_DataInfo" -->
                </v-text-field>
              </v-sheet>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="3">
              <v-sheet class="mr-3">
                <p class="font-weight-bold text-right">
                  Log2 Fold Change <br />
                  Lower bound / Upper bound
                  <!-- log2FC Lower bound (-{{ log2V_model_val }}~0) / Upper bound (0~{{ log2V_model_val }}) -->
                </p>
              </v-sheet>
            </v-col>
            <v-col cols="2">
              <v-text-field type="number" variant="outlined" v-model="log2_LowerBound" density="compact"
              ></v-text-field >
              <!-- @update:modelValue="changed_RNAseq_DataInfo" -->
            </v-col>
            <v-col class="ml-5" cols="2">
              <v-text-field  type="number" variant="outlined" v-model="log2_UpperBound" density="compact" 
              ></v-text-field>
              <!-- @update:modelValue="changed_RNAseq_DataInfo" -->
            </v-col>
          </v-row>
          <v-row no-gutters class="mt-3">
            <v-col cols="3"></v-col>
            <v-col cols="2">
              <v-btn  color="indigo-darken-3" class="text-none" style="width:100%" @click="changed_RNAseq_DataInfo">Enter</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text class="py-0">
          <v-row>
            <v-col :cols="12">
              <div class="py-1 mb-2">
                <!-- <p class="text-h6 ml-3 text-teal" style="font-weight: 700;">Volcano Plot</p> -->
                <Volcano :change_volcano_plot="compare_de_Obj"></Volcano>
                <!-- @xaxisMaxValue="listenXxais_Max" -->
              </div>
            </v-col>
            <v-col :cols="12">
              <v-card>
                <template v-slot:title>
                  <p class="text-h6 my-2 text-teal" style="font-weight: 700;">Difference Expression RNA-seq Table</p>   
                </template>
                <v-card-text>
                  <div class="d-flex justify-space-between">
                    <p class="mb-2 ml-2" style="font-weight: 700;font-size: 18px;">
                      {{ compare_de_title }}
                    </p>
                  </div>
                  <DisplayTable :table="tableComponentInfo" :useSearch="true"  @select_RNAseq_name="tableSelected_RNAseq_name"></DisplayTable>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
    </v-card>
  </div>
</template>
<script setup>
  import { ref, reactive } from 'vue';
  import { Subject, takeUntil, debounceTime } from 'rxjs';
  import DisplayTable from '../components/DisplayTable.vue';
  import Volcano from '../components/poltly/Volcano_plot.vue';
  const compare_de_title = ref('');
  const p_value_number = ref(1);
  const log2_LowerBound = ref(-1);
  const log2_UpperBound = ref(1);
  // const handleDataIF = ref(false);
  const compare_de_title_group = ref([]);
  import { dataFolder_RNAseq } from '../service/rna_seq_dataservice';
  let compare_de_tables_info = [];
  // const log2V_model_val = ref(0);
  const fdrVal = ref(1);
  const display_plotText = [];
  const plot_height = ref(650);
  const selectP_or_Qval = ref('P-Value');
  // const tableComponentInfo = ref({
  //   headers:[],
  //   body:[],
  // });
  const tableComponentInfo = reactive({
    headers:[],
    body:[]
  })
  const comSubject$ = new Subject();
  const compare_de_Obj = ref({
    selectType:'P-Value',
    title:'',
    selectStyle:'',
    log2_LowerBound:'',
    log2_UpperBound:'',
    height:'',
    displayText:''
  });
  dataFolder_RNAseq.RNAseq_DE_Folder_Info$.pipe(takeUntil(comSubject$), debounceTime(300)).subscribe((RNAseq_info)=>{
    sort_deFolderData(RNAseq_info)
  });
  const sort_deFolderData = async(de_data) => {
    if(Object.keys(de_data).length === 0)return;
    if(de_data.title_Group.length === 0){
      console.log("don't deData");
      return
    };
    compare_de_title_group.value = await de_data.title_Group;
    compare_de_title.value = await de_data.title_Group[0];
    de_data.info.forEach((item) => compare_de_tables_info.push(item));
    await handle_table_Info();
  };
  const tableSelected_RNAseq_name = (plot_text)=>{
    return
    compare_de_Obj.value.title = '';
    display_plotText.length = 0;
    plot_text.forEach((item) => display_plotText.push(item));
    for(let i = 0 ; compare_de_tables_info.length > i ; i++){
      if( compare_de_title.value === compare_de_tables_info[i].title ){
        changed_compare_de_Obj(compare_de_tables_info[i].title);
      }
    }
  };

  const changed_compare_de_Obj = (obj_title)=>{
    compare_de_Obj.value.title = obj_title;
    // compare_de_Obj.value.selectStyle = select_P_Q_Style.value;
    compare_de_Obj.value.selectStyleNum = p_value_number.value;
    compare_de_Obj.value.log2_LowerBound = log2_LowerBound.value;
    compare_de_Obj.value.log2_UpperBound = log2_UpperBound.value;
    compare_de_Obj.value.height = plot_height.value;
    compare_de_Obj.value.displayText = display_plotText;
    compare_de_Obj.value.selectType = selectP_or_Qval.value;
  };
  const changed_RNAseq_DataInfo = async() => {
    if(p_value_number.value === '') return;
    if(log2_UpperBound.value === '' || log2_LowerBound.value === '') return;
    for(let i = 0 ; compare_de_tables_info.length > i ; i++){
      if( compare_de_title.value === compare_de_tables_info[i].title ){
        display_plotText.length = 0;
        await handle_table_Info();
        changed_compare_de_Obj(compare_de_tables_info[i].title);
      }
    }
  };
  const handle_table_Info = ()=>{
    const fdrVal_Number = Number(fdrVal.value);
    if(fdrVal_Number <= 0) return;
    const p_value_number_val = Number(p_value_number.value);
    if(p_value_number_val <=0 )return;
    tableComponentInfo.headers.length = 0;
    tableComponentInfo.body.length = 0;
    return new Promise(async( resolve, reject )=>{
      // handleDataIF.value = false;
      let checkedUpDownIndex = -1; 
      const display_Table = [];
      let fdrIndex = -1;
      const title = compare_de_title.value;
      const log2Up = log2_UpperBound.value; 
      const log2Low = log2_LowerBound.value;
      let questionMark = 0;
      for(let i = 0 ; compare_de_tables_info.length > i ; i++){
        // if(compare_de_tables_info[i].title === compare_de_title.value){
        const headers = [];
        for(let j = 0 ; compare_de_tables_info[i].headers.length > j; j++){
          let header = compare_de_tables_info[i].headers[j].split(/\(/)[0];
          // let header = '';
          // const headerIndex = compare_de_tables_info[i].headers[j].indexOf('LSMean');
          // if(headerIndex > -1){
            // header = compare_de_tables_info[i].headers[j];
          // }else{
            // header = compare_de_tables_info[i].headers[j].split(/\(/)[0];
          // };
          const headerUpper = header.toUpperCase().trim();
          if(headerUpper === 'LOG2'){
            checkedUpDownIndex = j;
            headers.push('Log2Ratio', 'Up_Down');
          }else{
            const headerTrim = header.trim();
            headers.push(headerTrim);
            // headers.push(header);
          }
          if(headerUpper === 'FDR STEP UP'){
            fdrIndex = j;
          }
        };
        const headersUpper = [];
        for(let i = 0 ; headers.length > i ; i++){
          headersUpper.push(headers[i].toUpperCase());
        };
        const uppper_selectP_or_Qval = selectP_or_Qval.value.toUpperCase();
        let headers_P_or_Q_val = -1;
        if(uppper_selectP_or_Qval === 'P-VALUE'){
          headers_P_or_Q_val = headersUpper.indexOf('P-VALUE');
        }else if(uppper_selectP_or_Qval === 'Q-VALUE'){
          headers_P_or_Q_val = headersUpper.indexOf("FDR STEP UP")
        }
        const headers_log2_Ratio = headersUpper.indexOf('LOG2RATIO');
        const headers_ratio = headersUpper.indexOf('RATIO');
        const headers_Geneid = headers.indexOf("Gene id");
        for(let j = 0 ; compare_de_tables_info[i].body.length > j ; j++){
          if(headers.length > compare_de_tables_info[i].body[j].length){
            compare_de_tables_info[i].body[j].forEach((item, index)=>{
              let changedStyle;
              if(index === checkedUpDownIndex) changedStyle = Number(compare_de_tables_info[i].body[j][checkedUpDownIndex]);
              if(changedStyle >= 0){
                compare_de_tables_info[i].body[j].splice(checkedUpDownIndex + 1, 0, 'UP')
              }else if(changedStyle < 0){
                compare_de_tables_info[i].body[j].splice(checkedUpDownIndex + 1, 0, 'Down')
              }
              else if(compare_de_tables_info[i].body[j][checkedUpDownIndex] === '?' && index === checkedUpDownIndex){
                compare_de_tables_info[i].body[j].splice(checkedUpDownIndex + 1, 0, 'None')
              }
            })
          }
          if(headers_P_or_Q_val > -1 && compare_de_tables_info[i].title === title) {
            if(compare_de_tables_info[i].body[j][headers_P_or_Q_val] === '?' ){
              questionMark ++;
            }
            
            if(i===1 && j === 1){
              console.log(compare_de_tables_info[i].body[j],'compare_de_tables_info[i].body[j]')
            }
            const compare_de_tables_p_value_Number = Number(compare_de_tables_info[i].body[j][headers_P_or_Q_val]);
            const compare_de_tables_log2_Number = Number(compare_de_tables_info[i].body[j][headers_log2_Ratio]);
            if( compare_de_tables_info[i].body[j][headers_P_or_Q_val] === '?' && Number(p_value_number_val) === 1 && Number(log2Up) === 0 
              && Number(log2Low) === 0 ){
              const specialSymbol_Compare_de_tables_infoRemoveGeneid = [];
              for(let k = 0 ; compare_de_tables_info[i].body[j].length > k; k++){
                if(k !== headers_Geneid ){
                  specialSymbol_Compare_de_tables_infoRemoveGeneid.push(compare_de_tables_info[i].body[j][k]);
                }
              }
              display_Table.push(specialSymbol_Compare_de_tables_infoRemoveGeneid);
            };
            // 
            if(compare_de_tables_p_value_Number > p_value_number_val) continue;
            if(headers_log2_Ratio >=0 && compare_de_tables_log2_Number >=log2Up ||
              headers_log2_Ratio >=0 && compare_de_tables_log2_Number <= log2_LowerBound.value){
                compare_de_tables_info[i].body[j][headers_log2_Ratio] = Number(compare_de_tables_info[i].body[j][headers_log2_Ratio]);
                compare_de_tables_info[i].body[j][headers_ratio] = Number(compare_de_tables_info[i].body[j][headers_ratio]);
                const tempCompare_de_tables_infoRemoveGeneid = [];
                for(let k = 0 ; compare_de_tables_info[i].body[j].length > k; k++){
                  if(k !== headers_Geneid ){
                    tempCompare_de_tables_infoRemoveGeneid.push(compare_de_tables_info[i].body[j][k]);
                  }
                }
                display_Table.push(tempCompare_de_tables_infoRemoveGeneid);
            }
            
          };
        }
        if(compare_de_tables_info[i].headers.length === 0){
          for(let j = 0 ; headers.length > j ; j++){
            compare_de_tables_info[i].headers.push(headers[j])
          };
        };
        if(headers_Geneid > -1){
          headers.splice(headers_Geneid, 1);
        };
        if(compare_de_tables_info[i].title === title){
          resolve({
            body: display_Table,
            headers,
            showCheckBox: true
          })
        }
      }
      reject("dont't read")
    }).then(async(response) => {
      tableComponentInfo.headers = response.headers;
      tableComponentInfo.body = response.body;
      console.log(tableComponentInfo, 'tableComponentInfo')
      // tableComponentInfo.value = await response;
      // for(let i = 0;response.headers.length > i ;i++){
      //   tableComponentInfo.headers.push(response.headers[i])
      // }
      // for(let i = 0;response.body.length> i;i++){
      //   tableComponentInfo.body.push(response.body[i])
      // }
      // handleDataIF.value = true;
    });
  };
  
</script>