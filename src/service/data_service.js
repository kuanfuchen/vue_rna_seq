import { BehaviorSubject, Subject } from 'rxjs';
import { read, utils, writeFileXLSX } from 'xlsx';
const _ReadAlignmentSubject$ = new BehaviorSubject({});
const _handleRawReadsFolder$ = new BehaviorSubject({});
const _transferMeg$ = new Subject({});
const _visualization_Plot$ = new BehaviorSubject();
const _CPM_PCA_Info$ = new BehaviorSubject({});
const _DE_Folder_Info$ = new BehaviorSubject({});
const _Project_info_Subject$ = new BehaviorSubject();
const _export_raw_table_different_expression_XLSX$ = new Subject(false);
const DE_folder_compare_name = [];
const DE_folder_Data = [];
const conditionSort = [];
import { pre_alignment_qaqc, adaptor_trimming, base_trimming, post_alignment, microRNA_counts, CPM_Normalized_counts, CPM_PCA, Project_info } from './getData';

const handleQCReadAlignmentfolder = async() => {
  const readAlignmentTitle = ['Raw reads', 'Adaptor trimmed','Base trimming', 'Alignment'];
  const handleFinish_pre_alignment_qaqc = handleSplitTxt(pre_alignment_qaqc);
  for(let i = 0 ; handleFinish_pre_alignment_qaqc.body.length > i ; i++){
    conditionSort.push({
      name: handleFinish_pre_alignment_qaqc.body[i][0],
      order: handleFinish_pre_alignment_qaqc.body[i][1]
    })
  };
  conditionSort.sort((a,b)=> {if(b.order > a.order) return -1 });
  const handleFinish_adaptor_trimming = handleSplitTxt(adaptor_trimming);
  const handleFinish_base_trimming = handleSplitTxt(base_trimming);
  const handleFinish_post_alignment = handle_post_alignment(post_alignment);
  const miRNATabs = {
    tabs: readAlignmentTitle,
    tabsTable: [handleFinish_pre_alignment_qaqc, handleFinish_adaptor_trimming, handleFinish_base_trimming, handleFinish_post_alignment]
  }
  await _ReadAlignmentSubject$.next(miRNATabs);
};
const handle_post_alignment = (post_alignment) => {
  const finish_post_alignment = handleSplitTxt(post_alignment);
  const headers = [];
  finish_post_alignment.headers.forEach((header) => {
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
      default:
        headers.push(header)
    }
    finish_post_alignment.headers = headers;
  });
  return finish_post_alignment
};
const handleRawReadsFolder = () => {
  const microRNA_countTitle = ['Raw_Reads', 'Normalized_Reads'];
  const handleFinish_microRNA_counts =  handleSplitTxt(microRNA_counts);
  const handleFinish_CPM_Normalized_counts = handleSplitTxt(CPM_Normalized_counts);
  const microRNA_countTab = {
    tabs: microRNA_countTitle,
    tabsTable:[handleFinish_microRNA_counts, handleFinish_CPM_Normalized_counts]
  }
  graphPlotVisualization(handleFinish_CPM_Normalized_counts, microRNA_countTab);
}
const handleProject = ()=>{
  const splitSpaceProject_info = Project_info.split(/\n/);
  const project_info_Txt = [];
  const project_txt_Resolve = {};
  for(let i = 0 ; splitSpaceProject_info.length > i ;i++){
    const splitR_Project_info = splitSpaceProject_info[i].split(/\r/)[0];
    if(splitR_Project_info.length > 1){
      project_info_Txt.push(splitR_Project_info)
    }
  }
  project_info_Txt.forEach((item, index) => {
    switch (item){
      case 'Project ID':
        project_txt_Resolve['Project ID'] = project_info_Txt[index + 1];
        break
      case 'Date':
        project_txt_Resolve.Date = project_info_Txt[index + 1];
        break
      case "Institute":
        project_txt_Resolve.Institute = project_info_Txt[index + 1];
        break
      case "Customer":
        project_txt_Resolve.Customer = project_info_Txt[index + 1];
        break
      case "Organism":
        project_txt_Resolve.Organism = project_info_Txt[index + 1];
        break
      case "Library Kit":
        project_txt_Resolve['Library Kit'] = project_info_Txt[index + 1];
        break
      case "Genome":
        project_txt_Resolve.Genome = project_info_Txt[index + 1];
        break
      case "miRNA DB":
        if(index + 1 <= project_info_Txt.length){
          project_txt_Resolve['miRNA DB'] = project_info_Txt[index + 1];
        }
        break
    }
  })
  _Project_info_Subject$.next(project_txt_Resolve);
};
const graphPlotVisualization = async(normalized_count, microRNA_countTab) => {
  if(!normalized_count.headers || !normalized_count.body) return;
  // const headersSort = normalized_count.headers.filter((header, i)=> { if(i > 5)return header } );
  const headersSort = normalized_count.headers.filter((header, i)=> { if(i > 5)return header } );
  const normalized_Info = [];
  const normalized_RNA_title = [];
  // const test_info = [];
  for( let i = 0 ; normalized_count.body.length > i ; i++ ){
    normalized_Info[i] = [];
    const miRNA_display_normal_count = {};
    // test_info[i] = [];
    normalized_count.body[i].forEach((body, index)=>{ 
      if(index === 5 ) {
        normalized_RNA_title.push(body)
      };
      if(index > 5){
        // 
        const body_number = Number(body);
        const numberBody = body_number + 1;
        const log10Body = Math.log10(numberBody);
      
        miRNA_display_normal_count[normalized_count.headers[index]] = log10Body;
        normalized_Info[i].push(log10Body);
        // const numberBody = body_number + 1;
        // const log10Body = Math.log10(numberBody);
        // normalized_Info[i].push(log10Body);
    }});
  }
  const microRNA_Info = {
    tabs: microRNA_countTab.tabs,
    tabsTable: microRNA_countTab.tabsTable,
    log: normalized_Info
  };
  await _handleRawReadsFolder$.next(microRNA_Info);
  await _visualization_Plot$.next({headers: headersSort, info: normalized_Info, miRNA_title: normalized_RNA_title, sortOrder: conditionSort});
}
const handleSplitTxt = (tableInfo) => {
  const miRNATable = {
    headers:[],
    body:[]
  };
  const split_tableInfo = tableInfo.split(/\n/);
  for(let i = 0 ; split_tableInfo.length > i ; i++){
    const removeSpace_split_tableInfo = split_tableInfo[i].split(/\t/);
    const removeR_split_tableInfo = removeSpace_split_tableInfo.map((item) => item.split(/\r/)[0]);
    if(removeR_split_tableInfo.length === 1) continue;
    if(i === 0){
      miRNATable.headers = removeR_split_tableInfo;
    }else{
      miRNATable.body[i - 1] = [];
      miRNATable.body[i - 1] = removeR_split_tableInfo;
    }
    // if(removeSpace_split_tableInfo.length === 1) continue;
    // if(i === 0) {
    //   miRNATable.headers = removeSpace_split_tableInfo;
    // }else{
    //   miRNATable.body[i - 1] = [];
    //   miRNATable.body[i - 1] = removeSpace_split_tableInfo;
    // }
  }
  return miRNATable
};
const handle_CPM_PCA = ()=>{
  const pca_data = handleSplitTxt(CPM_PCA);
  pca_data.sortOrder = conditionSort;
  _CPM_PCA_Info$.next(pca_data);
}
const handleDE_Folder = async () => {
  //由於有未知元素命名，故特別命名
  // const de_folder_name = '../assets/miRNA-seq/Bowtie2/03. DE miRNAs/';
  const assetContext = require.context( '../assets/miRNA-seq/Bowtie2/03. DE miRNAs/', true, /\.txt$/)
  assetContext.keys().forEach((key) => {
    const removeFilterFile = key.indexOf('filtered/');
    if(removeFilterFile < 0){
      const keySplit = key.split(/\//);
      const keySplitIndex = keySplit.indexOf('gene_list.txt');
      if( keySplitIndex > -1 ){
        const folderNameIndex = keySplit.length - 2;
        DE_folder_compare_name.push(keySplit[folderNameIndex]);
      }
    }
  });
  const DE_txtGroup = [];
  for(let i = 0 ; DE_folder_compare_name.length > i ; i++){
    // const path = de_folder_name + DE_folder_compare_name[i] + '/gene_list.txt';
    const readTxt = require(`../assets/miRNA-seq/Bowtie2/03. DE miRNAs/${DE_folder_compare_name[i]}/gene_list.txt`)
    DE_txtGroup.push(readTxt.default);
  }
  
  for(let i = 0 ; DE_txtGroup.length > i ; i++){
    const de_txtTableInfo = handleSplitTxt(DE_txtGroup[i]);
    de_txtTableInfo.title = DE_folder_compare_name[i];
    DE_folder_Data.push(de_txtTableInfo);
    _DE_Folder_Info$.next({'title_Group': DE_folder_compare_name, 'info': DE_folder_Data});
  }
}
const exportRawTable_different_expression = () => {
  _export_raw_table_different_expression_XLSX$.next(true)
};
const exportXlsx = async(readFile, fileName, sheetsName)=> {
  let sheets_Title = [];
  let excelName = '';
  if(fileName === 'readAndAlignment'){
    sheets_Title = ['Raw reads', 'Adaptor Trimmed', 'Base Trimming', 'Alignment'];
    excelName = 'Read And Alignment'
  }else if(fileName === 'difference_expression'){
    sheets_Title = sheetsName;
    excelName = 'Difference Expression'
  }else if(fileName === 'visualization'){
    sheets_Title = sheetsName;
    excelName = 'Visualization'
  }
  const export_wb = utils.book_new();
  for(let i = 0 ; readFile.length > i ; i++){
    const ws = await utils.aoa_to_sheet(readFile[i]);
    await utils.book_append_sheet(export_wb, ws, sheets_Title[i]);
  }
  writeFileXLSX(export_wb, excelName + '.xlsx');
};
const transferHandleFinishMeg = (handleInfo) => {
  _transferMeg$.next(handleInfo)
};
export const dataService = {
  handleProject,
  handleQCReadAlignmentfolder,
  handleRawReadsFolder,
  handle_CPM_PCA,
  transferHandleFinishMeg,
  handleDE_Folder,
  exportXlsx,
  exportRawTable_different_expression,
  ReadAlignmentSubject$: _ReadAlignmentSubject$.asObservable(),
  handleRawReadsFolder$: _handleRawReadsFolder$.asObservable(),
  visualization_Plot$: _visualization_Plot$.asObservable(),
  export_raw_table_different_expression_XLSX$: _export_raw_table_different_expression_XLSX$.asObservable(),
  transferMeg$: _transferMeg$.asObservable(),
  CPM_PCA_Info$: _CPM_PCA_Info$.asObservable(),
  DE_Folder_Info$: _DE_Folder_Info$.asObservable(),
  Project_info_Subject$:_Project_info_Subject$.asObservable(),
} 