import Papa from 'papaparse';
// import axios from 'axios';
import { Subject, BehaviorSubject } from 'rxjs';
const _papaFun_enrichment$ = new BehaviorSubject({});

import down_Bio_Process_site from '../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/input/down_regulated/Biological Process (Gene Ontology).tsv';
import down_cellular_site from '../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/input/down_regulated/Cellular Component (Gene Ontology).tsv';
import down_KEGG_site from '../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/input/down_regulated/KEGG Pathways.tsv';
import down_Mole_Fun_site from '../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/input/down_regulated/Molecular Function (Gene Ontology).tsv';
import down_Reference_Pub_site from '../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/input/down_regulated/Reference publications (PubMed).tsv';
import up_Bio_Process_site from '../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/input/up_regulated/Biological Process (Gene Ontology).tsv';
import up_cellular_site from '../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/input/up_regulated/Cellular Component (Gene Ontology).tsv';
import up_KEGG_site from '../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/input/up_regulated/KEGG Pathways.tsv';
import up_Mole_Fun_site from '../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/input/up_regulated/Molecular Function (Gene Ontology).tsv';
import up_Reference_Pub_site from '../assets/Partek_Flow/For_report_html/06_01. Functional analysis - STRINGdb/input/up_regulated/Reference publications (PubMed).tsv';
// 
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
const handleFunctionalAnalysis = async() => {
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
  _papaFun_enrichment$.next({headers, data})
}
export const papaDate = {
  handleFunctionalAnalysis,
  papaFun_enrichment$:_papaFun_enrichment$.asObservable(),
}


