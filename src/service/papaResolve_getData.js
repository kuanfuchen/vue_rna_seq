import Papa from 'papaparse';
// import axios from 'axios';
import { Subject, BehaviorSubject } from 'rxjs';
const _papaFun_enrichment$ = new Subject({});
const _name_Fun_enrichment$ = new BehaviorSubject([]);
let down_Bio_Process = {name:'down_Bio_Process', arr:[]}; 
let down_cellular = {name:'down_cellular',arr:[]};
let down_KEGG = {name:'down_KEGG', arr:[]};
let down_Mole_Fun = {name:'down_Mole_Fun', arr:[]};
let down_Reference_Pub = {name:'down_Reference_Pub', arr:[]};
let up_Bio_Process = {name:'up_Bio_Process', arr:[]};
let up_cellular = {name:'up_cellular', arr:[]};
let up_KEGG = {name:'up_KEGG', arr:[]};
let up_Mole_Fun = {name:'up_Mole_Fun', arr:[]};
let up_Reference_Pub = {name:'up_Reference_Pub', arr:[]};
const function_Enrichment_file = [];
// let saveFileName = "";
let down_Bio_Process_site, down_cellular_site, down_KEGG_site, down_Mole_Fun_site, down_Reference_Pub_site, up_Bio_Process_site, up_cellular_site, up_KEGG_site, up_Mole_Fun_site, up_Reference_Pub_site;
const handlePapaParse = async (arr, data)=>{
  data.arr = await Papa.parse(arr,{
    delimiter:"\t",
    worker:false,
    header:true,
  });
}
const handleHeaders = (arr) => {
  if(!arr.data) return;
  const headerskey = Object.keys(arr.data[0]);
  return headerskey
}
const searchFunction_enrichment_file = async()=>{
  const assetContent = require.context('../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/',true,/\.tsv$/);
  assetContent.keys().forEach((key)=>{
    const keySplit = key.split(/\//);
    const index = function_Enrichment_file.indexOf(keySplit[1]);
    if(index === -1)function_Enrichment_file.push(keySplit[1]);
  });
  
  await _name_Fun_enrichment$.next(function_Enrichment_file)
  await handle_FE_file(0);
}
const received_FEkegg_Info = (selectName = 0)=>{
  let saveFileName = "";
  if(selectName === 0) {
    saveFileName = function_Enrichment_file[0]
  }else{
    saveFileName = selectName;
  };
  handle_FE_file(saveFileName)
}
const received_FEgo_info = (selectName = 0)=>{
  let saveFileName = "";
  if(selectName === 0) {
    saveFileName = function_Enrichment_file[0]
  }else{
    saveFileName = selectName;
  };
  handle_FE_file(saveFileName)
}
const handle_FE_file = (saveFileName = 0)=>{
  if(saveFileName === 0 || saveFileName === '') {
    saveFileName = function_Enrichment_file[0]
  }
  up_Bio_Process_site = require(`../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/${saveFileName}/up_regulated/Biological Process (Gene Ontology).tsv`);
  up_cellular_site = require(`../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/${saveFileName}/up_regulated/Cellular Component (Gene Ontology).tsv`);
  up_KEGG_site = require(`../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/${saveFileName}/up_regulated/KEGG Pathways.tsv`);
  up_Mole_Fun_site = require(`../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/${saveFileName}/up_regulated/Molecular Function (Gene Ontology).tsv`);
  up_Reference_Pub_site = require(`../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/${saveFileName}/up_regulated/Reference publications (PubMed).tsv`);
  down_Bio_Process_site = require(`../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/${saveFileName}/down_regulated/Biological Process (Gene Ontology).tsv`);
  down_cellular_site = require(`../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/${saveFileName}/down_regulated/Cellular Component (Gene Ontology).tsv`);
  down_KEGG_site = require(`../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/${saveFileName}/down_regulated/KEGG Pathways.tsv`);
  down_Mole_Fun_site = require(`../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/${saveFileName}/down_regulated/Molecular Function (Gene Ontology).tsv`);
  down_Reference_Pub_site = require(`../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/${saveFileName}/down_regulated/Reference publications (PubMed).tsv`);
  // }
  handleFunctionalAnalysis(saveFileName)
}

const handleFunctionalAnalysis = async(saveFileName) => {
  await handlePapaParse(down_Bio_Process_site.default, down_Bio_Process);
  await handlePapaParse(down_cellular_site.default, down_cellular);
  await handlePapaParse(down_KEGG_site.default, down_KEGG);
  await handlePapaParse(down_Mole_Fun_site.default, down_Mole_Fun);
  await handlePapaParse(down_Reference_Pub_site.default, down_Reference_Pub);
  await handlePapaParse(up_Bio_Process_site.default, up_Bio_Process);
  await handlePapaParse(up_cellular_site.default, up_cellular);
  await handlePapaParse(up_KEGG_site.default, up_KEGG);
  await handlePapaParse(up_Mole_Fun_site.default, up_Mole_Fun);
  await handlePapaParse(up_Reference_Pub_site.default, up_Reference_Pub);
  const headers = await handleHeaders(down_Bio_Process.arr);
  const data = {
    down:{
      BP:down_Bio_Process.arr,
      MF:down_Mole_Fun.arr,
      CC:down_cellular.arr,
      KEGG:down_KEGG.arr,
      pubMed:down_Reference_Pub.arr,
    },
    up:{
      BP:up_Bio_Process.arr,
      MF:up_Mole_Fun.arr,
      CC:up_cellular.arr,
      KEGG:up_KEGG.arr,
      pubMed:up_Reference_Pub.arr,
    }
  }
  _papaFun_enrichment$.next({headers, data,saveFileName})
}
export const papaDate = {
  // handleFunctionalAnalysis,
  searchFunction_enrichment_file,
  // handle_FE_file,
  received_FEgo_info,
  received_FEkegg_Info,
  name_Fun_enrichment$:_name_Fun_enrichment$.asObservable(),
  papaFun_enrichment$:_papaFun_enrichment$.asObservable(),

}


