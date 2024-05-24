
const filterRNA_seq_num = (selectedDataNum, storagedDE_folder)=>{
  const selected_DE_pValue = [];
  const selected_DE_log2 = [];
  const selected_RNA_name = [];
  const headersUppers = [];
  let negative_position_number = 0;
  let positive_position_number = 0;
  const log_SelectStyleNum = - Math.log10(0.05);
  for(let i = 0; storagedDE_folder.info[selectedDataNum].headers.length > i ; i++){
    const splitHeaders = storagedDE_folder.info[selectedDataNum].headers[i].split(/\(/)[0];
    headersUppers.push(splitHeaders.toUpperCase().trim());
  };
  // let p_or_q_value_index = -1;
  // if(P_or_Q_value ==='P-VALUE'){
  //   p_or_q_value_index =  headersUppers.indexOf('P-VALUE');
  // }else if( P_or_Q_value === 'Q-VALUE'){
  //   p_or_q_value_index =  headersUppers.indexOf('FDR STEP UP')
  // }
  const p_or_q_value_index =  headersUppers.indexOf('FDR STEP UP');
  if(p_or_q_value_index === -1)return;
  const lo2_index = headersUppers.indexOf('LOG2');
  let index = 0
  for(let i = 0 ; storagedDE_folder.info[selectedDataNum].body.length > i ; i++){
    if(storagedDE_folder.info[selectedDataNum].body[i][p_or_q_value_index] !== '?'){
      const floatNum = parseFloat(storagedDE_folder.info[selectedDataNum].body[i][p_or_q_value_index]);
      const logCalu = - Math.log10(floatNum);
      const geneName = storagedDE_folder.info[selectedDataNum].body[i][1];
      selected_RNA_name.push(geneName);
      selected_DE_pValue.push(logCalu);
      selected_DE_log2.push(storagedDE_folder.info[selectedDataNum].body[i][lo2_index]);
      index ++;
    }
  }
  for(let i = 0 ; selected_DE_log2.length > i ; i++){
    const floatNum = parseFloat(selected_DE_log2[i]);
    if( 1 <= floatNum &&  selected_DE_pValue[i] >= log_SelectStyleNum){
      positive_position_number ++;
    }else if( -1 >= floatNum && selected_DE_pValue[i] >= log_SelectStyleNum ){
      negative_position_number ++;
    }
  }
  return {
    positive_position_number,
    negative_position_number
  }
}
export default filterRNA_seq_num;