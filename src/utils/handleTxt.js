export const handleSplitTxt = (tableInfo) => {
  const table_RNAseq = {
    headers:[],
    body:[]
  };
  const split_tableInfo = tableInfo.split(/\n/);
  for(let i = 0 ; split_tableInfo.length > i ; i++){
    const removeSpace_split_tableInfo = split_tableInfo[i].split(/\t/);
    const removeR_split_tableInfo = removeSpace_split_tableInfo.map((item) => item.split(/\r/)[0]);
    if(removeR_split_tableInfo.length === 1) continue;
    if(i === 0){
      table_RNAseq.headers = removeR_split_tableInfo;
    }else{
      table_RNAseq.body[i - 1] = [];
      table_RNAseq.body[i - 1] = removeR_split_tableInfo;
    }
  }
  return table_RNAseq
};