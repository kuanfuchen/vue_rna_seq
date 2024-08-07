import { BehaviorSubject, Subject } from 'rxjs';
import { read, utils, writeFileXLSX } from 'xlsx';
import { handleSplitTxt } from '../utils/handleTxt';
const _RNAseq_ReadAlignmentSubject$ = new BehaviorSubject({});
const _RNAseq_handleRawReadsFolder$ = new BehaviorSubject({});
const _RNAseq_scatter_Plot$ = new BehaviorSubject({});
const _RNAseq_visual_scatter_sampleName$ = new BehaviorSubject({});
const _RNAseq_visual_boxPlot$ = new  BehaviorSubject({});
const _RNAseq_CPM_PCA_Data$ = new BehaviorSubject({});
const _RNAseq_DE_Folder_Info$ = new BehaviorSubject({});
const _RNAseq_Project_info$ = new BehaviorSubject({});
const _closeXlsx_info$ = new Subject(false);
import { rawFastqQC, trimemd_fastqQC, filterOutrRNAfastqQC, star_alignmentQC, quantify_to_annotation_gene_counts, normalized_counts, RNAseq_CPM_PCA, Project_info } from './getData.js';
const conditionSort = [];
const compare_RNAseq_name = [];
const handleRNAseqQCReadAlignmentfolder = async()=>{
  const readAlignmentTitle = ['Raw reads', 'Adaptor trimmed','Base trimming', 'Alignment'];
  const rawFastqQC_RNAseq = handleSplitTxt(rawFastqQC);
  for(let i = 0 ; rawFastqQC_RNAseq.body.length > i ;i++){
    conditionSort.push({
      name:rawFastqQC_RNAseq.body[i][0],
      order:rawFastqQC_RNAseq.body[i][1]
    })
  }
  const trimemd_fastqQC_RNAseq = handleSplitTxt(trimemd_fastqQC);
  const filterOutrRNAfastqQC_RNAseq = handleSplitTxt(filterOutrRNAfastqQC);
  const star_alignmentQC_RNAseq = handleSplitTxt(star_alignmentQC);
  const miRNATabs = {
    tabs:readAlignmentTitle,
    tabsTable:[rawFastqQC_RNAseq, trimemd_fastqQC_RNAseq, filterOutrRNAfastqQC_RNAseq, star_alignmentQC_RNAseq]
  }
  await _RNAseq_ReadAlignmentSubject$.next(miRNATabs);
};
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
      case "Genome":
        project_txt_Resolve.Genome = project_info_Txt[index + 1];
        break
      case "Gene annotation":
        if(index + 1 <= project_info_Txt.length){
          project_txt_Resolve['Gene annotation'] = project_info_Txt[index + 1];
        }
        break
    }
  })
  _RNAseq_Project_info$.next(project_txt_Resolve);
};
const rnaSeq_handleRawReads_normalizedCounts = async() => {
  const RNAseq_raw_reads_count = handleSplitTxt(quantify_to_annotation_gene_counts);
  const RNAseq_normalizedCounts = handleSplitTxt(normalized_counts);
  handleRawReads_normalizedCount( RNAseq_raw_reads_count, RNAseq_normalizedCounts);
};
const handleRawReads_normalizedCount =async ( RNAseq_raw_reads_count, RNAseq_normalizedCounts )=>{
  const filterRNA_global_title = RNAseq_raw_reads_count.headers.filter((item, i) => { if(i < 9) return item });
  const filterRNA_name_title = RNAseq_raw_reads_count.headers.filter((item, i) => {if(i > 12)return item });
  const globalData = [];
  const rowReadsData = [];
  const normalizedData = [];
  const log10_normalized = [];
  const geneIdArr = [];
  RNAseq_normalizedCounts.body.forEach((item, i )=> {
    normalizedData[i] = [];
    log10_normalized[i] = [];
    for( let j = 0 ; item.length > j ; j++){
      if( j === 6 ) geneIdArr.push(item[6]);
      if( j > 12 ){
        const mathLog10 = Math.log10(Number(item[j]));
        log10_normalized[i].push(mathLog10);
        normalizedData[i].push(item[j]);
      }
    }
  });
  RNAseq_raw_reads_count.body.forEach((item, i )=>{ 
    globalData[i] = [];
    rowReadsData[i] = [];
    for(let j = 0 ; item.length > j ; j++ ){
      if(j < 9){ 
        globalData[i].push(item[j])
      }else if( j > 12 ){
        rowReadsData[i].push(item[j])
      }
    }
  });
  await _RNAseq_handleRawReadsFolder$.next({
    globalTitle: filterRNA_global_title,
    globalData,
    sampleNameTitle: filterRNA_name_title,
    rowReadsData,
    normalizedData
  });
  await _RNAseq_scatter_Plot$.next({
    headers: filterRNA_name_title,
    info: log10_normalized,
    miRNA_title: geneIdArr,
  });
  await _RNAseq_visual_scatter_sampleName$.next({
    headers: filterRNA_name_title,
  })
  _RNAseq_visual_boxPlot$.next({
    headers: filterRNA_name_title,
    info: log10_normalized,
    miRNA_title: geneIdArr,
    sortOrder:conditionSort
  })
}
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
  await writeFileXLSX(export_wb, excelName + '.xlsx');
};
const export_Visualization = (fileContent, sheetsName) => {
  return new Promise((resolve, reject)=>{
    if(sheetsName.length === 0 || fileContent.length === 0) return;
    setTimeout(async()=>{
      const export_Visualization_wb = utils.book_new();
      for(let i = 0 ; fileContent.length > i ; i++){
        const ws = await utils.aoa_to_sheet(fileContent[i]);
        await utils.book_append_sheet(export_Visualization_wb, ws, sheetsName[i])
      }
      await writeFileXLSX(export_Visualization_wb, 'Visualization.xlsx');
      await _closeXlsx_info$.next(false);
    },1000)
  })
}
const handleRNAseq_CPM_PCA = () => {
  const pca_data = handleSplitTxt(RNAseq_CPM_PCA);
  pca_data.sortOrder = conditionSort;
  _RNAseq_CPM_PCA_Data$.next(pca_data);
};
const handled_RNAseq_DE = async() =>{
  const assetsContent = require.context('../assets/Partek_Flow/For_report_html/05. DE genes/', true, /\.txt$/);
  assetsContent.keys().forEach((key)=>{
    const keySplit = key.split(/\/(\w+)\./);
    compare_RNAseq_name.push(keySplit[1]);
  });
  const txtground_DE = [];
  for(let i = 0 ; compare_RNAseq_name.length > i ; i++){
    const readTxt = require(`../assets/Partek_Flow/For_report_html/05. DE genes/${compare_RNAseq_name[i]}.txt`);
    txtground_DE.push(readTxt.default);
  };
  const de_txtTableInfo = []
  for(let i = 0 ; txtground_DE.length > i ; i++){
    de_txtTableInfo.push( handleSplitTxt(txtground_DE[i]));
    de_txtTableInfo[i].title = compare_RNAseq_name[i];
  }
  _RNAseq_DE_Folder_Info$.next({'title_Group': compare_RNAseq_name, 'info': de_txtTableInfo})
};
export const dataFolder_RNAseq = {
  handleProject,
  handleRNAseqQCReadAlignmentfolder,
  rnaSeq_handleRawReads_normalizedCounts,
  handleRNAseq_CPM_PCA,
  exportXlsx,
  handled_RNAseq_DE,
  export_Visualization,
  closeXlsx_info$:_closeXlsx_info$.asObservable(),
  rnaseq_ReadAlignmentSubject$: _RNAseq_ReadAlignmentSubject$.asObservable(),
  RNAseq_handleRawReadsFolder$:_RNAseq_handleRawReadsFolder$.asObservable(),
  RNAseq_scatter_Plot$:_RNAseq_scatter_Plot$.asObservable(),
  RNAseq_visual_scatter_sampleName$:_RNAseq_visual_scatter_sampleName$.asObservable(),
  RNAseq_visual_boxPlot$:_RNAseq_visual_boxPlot$.asObservable(),
  RNAseq_CPM_PCA_Data$:_RNAseq_CPM_PCA_Data$.asObservable(),
  RNAseq_DE_Folder_Info$:_RNAseq_DE_Folder_Info$.asObservable(),
  RNAseq_Project_info$:_RNAseq_Project_info$.asObservable(),
};