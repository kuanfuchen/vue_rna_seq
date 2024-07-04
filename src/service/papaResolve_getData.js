import Papa from 'papaparse';
// import axios from 'axios';
import { Subject, BehaviorSubject } from 'rxjs';
const _papaFun_enrichment$ = new BehaviorSubject({});
const _name_Fun_enrichment$ = new BehaviorSubject([]);
let down_Bio_Process = {name:'down_Bio_Process', arr:{}}; 
let down_cellular = {name:'down_cellular',arr:{}};
let down_KEGG = {name:'down_KEGG', arr:{}};
let down_Mole_Fun = {name:'down_Mole_Fun', arr:{}};
let down_Reference_Pub = {name:'down_Reference_Pub', arr:{}};
let up_Bio_Process = {name:'up_Bio_Process', arr:{}};
let up_cellular = {name:'up_cellular', arr:{}};
let up_KEGG = {name:'up_KEGG', arr:{}};
let up_Mole_Fun = {name:'up_Mole_Fun', arr:{}};
let up_Reference_Pub = {name:'up_Reference_Pub', arr:{}};
const function_Enrichment_file = [];
let down_Bio_Process_site=[], down_cellular_site=[], down_KEGG_site=[], down_Mole_Fun_site=[], down_Reference_Pub_site=[], up_Bio_Process_site=[], up_cellular_site=[], up_KEGG_site=[], up_Mole_Fun_site=[], up_Reference_Pub_site=[];
const handlePapaParse = async (arr, data)=>{
  arr.forEach(async(arrItem)=>{
    const fileName = arrItem.fileName;
    const papaItem = await Papa.parse(arrItem.data.default,{
      delimiter:"\t",
      worker:false,
      header:true,
    });
    if(!data.arr[fileName])data.arr[fileName] = papaItem;
  })
}
const handleHeaders = (arr) => {
  if(!arr) return;
  const headerskey = Object.keys(arr.data[0]);
  return headerskey
};
const searchFunction_enrichment_file = async()=>{
  const assetContent = require.context('../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/',true,/\.tsv$/);
  assetContent.keys().forEach((key)=>{
    const keySplit = key.split(/\//);
    const index = function_Enrichment_file.indexOf(keySplit[1]);
    if(index === -1)function_Enrichment_file.push(keySplit[1]);
  });
  await handle_FE_file(function_Enrichment_file);
  await _name_Fun_enrichment$.next(function_Enrichment_file)
  
}
const handle_FE_file = (saveFilesName)=>{
  saveFilesName.forEach((fileName)=>{
    up_Bio_Process_site.push({
      data:require(`../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/${fileName}/up_regulated/Biological Process (Gene Ontology).tsv`),
      fileName
    });
    up_cellular_site.push({
      data:require(`../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/${fileName}/up_regulated/Cellular Component (Gene Ontology).tsv`),
      fileName
    });
    up_KEGG_site.push({
      data:require(`../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/${fileName}/up_regulated/KEGG Pathways.tsv`),
      fileName
    });
    up_Mole_Fun_site.push({
      data:require(`../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/${fileName}/up_regulated/Molecular Function (Gene Ontology).tsv`),
      fileName
    });
    up_Reference_Pub_site.push({
      data:require(`../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/${fileName}/up_regulated/Reference publications (PubMed).tsv`),
      fileName
    });
    down_Bio_Process_site.push({
      data:require(`../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/${fileName}/down_regulated/Biological Process (Gene Ontology).tsv`),
      fileName
    });
    down_cellular_site.push({
      data:require(`../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/${fileName}/down_regulated/Cellular Component (Gene Ontology).tsv`),
      fileName
    });
    down_KEGG_site.push({
      data:require(`../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/${fileName}/down_regulated/KEGG Pathways.tsv`),
      fileName
    });
    down_Mole_Fun_site.push({
      data:require(`../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/${fileName}/down_regulated/Molecular Function (Gene Ontology).tsv`),
      fileName
    });
    down_Reference_Pub_site.push({
      data:require(`../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/${fileName}/down_regulated/Reference publications (PubMed).tsv`),
      fileName
    });
  });
  handleFunctionalAnalysis()
}

const handleFunctionalAnalysis = async() => {
  new Promise(async(resolve, rej)=>{
    console.log('handleFunctionalAnalysis')
    await handlePapaParse(down_Bio_Process_site, down_Bio_Process);
    await handlePapaParse(down_cellular_site, down_cellular);
    await handlePapaParse(down_KEGG_site, down_KEGG);
    await handlePapaParse(down_Mole_Fun_site, down_Mole_Fun);
    await handlePapaParse(down_Reference_Pub_site, down_Reference_Pub);
    await handlePapaParse(up_Bio_Process_site, up_Bio_Process);
    await handlePapaParse(up_cellular_site, up_cellular);
    await handlePapaParse(up_KEGG_site, up_KEGG);
    await handlePapaParse(up_Mole_Fun_site, up_Mole_Fun);
    await handlePapaParse(up_Reference_Pub_site, up_Reference_Pub);
    const arrObjectKey0 = Object.keys(down_Bio_Process.arr)[0];
    const headers = await handleHeaders(down_Bio_Process.arr[arrObjectKey0]);
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
    resolve({headers, data});
    rej('err')
  }).then(async(info)=>{
    await _papaFun_enrichment$.next(info)
  })
}
export const papaDate = {
  // handleFunctionalAnalysis,
  searchFunction_enrichment_file,
  // handle_FE_file,
  // received_FEgo_info,
  // received_FEkegg_Info,
  name_Fun_enrichment$:_name_Fun_enrichment$.asObservable(),
  papaFun_enrichment$:_papaFun_enrichment$.asObservable(),

}


