import pre_alignment_qaqc from '../assets/miRNA-seq/Bowtie2/00. QC (Trim adaptor & Trim base)/01. Raw reads/pre_alignment_qaqc.txt';
import adaptor_trimming from '../assets/miRNA-seq/Bowtie2/00. QC (Trim adaptor & Trim base)/02. Adaptor Trimming/pre_alignment_qaqc.txt';
import base_trimming from '../assets/miRNA-seq/Bowtie2/00. QC (Trim adaptor & Trim base)/03. Base Trimming/pre_alignment_qaqc.txt'
import post_alignment from '../assets/miRNA-seq/Bowtie2/00. QC (Trim adaptor & Trim base)/04. post alignment/post_alignment_qaqc.txt';
import microRNA_counts from '../assets/miRNA-seq/Bowtie2/01. raw reads/microRNA_counts.txt';
import CPM_Normalized_counts from '../assets/miRNA-seq/Bowtie2/02. normalized reads/CPM_Normalized_counts.txt';
import CPM_PCA from '../assets/miRNA-seq/Bowtie2/02. normalized reads/CPM_Normalized_counts_for_PCA_plot.txt';
import Project_info from '../assets/miRNA-seq/Bowtie2/Project Information.txt';
export {
  pre_alignment_qaqc,
  adaptor_trimming,
  base_trimming,
  post_alignment,
  microRNA_counts,
  CPM_Normalized_counts,
  CPM_PCA,
  Project_info
}
// 
import rawFastqQC from '../assets/Partek_Flow/For_report_html/00. raw fastq QC/pre_alignment_qaqc.txt';
import trimemd_fastqQC from '../assets/Partek_Flow/For_report_html/01_01. trimmed fastq QC/pre_alignment_qaqc.txt';
import filterOutrRNAfastqQC from '../assets/Partek_Flow/For_report_html/01_02. filter out rRNA fastq QC/pre_alignment_qaqc.txt';
import star_alignmentQC from '../assets/Partek_Flow/For_report_html/02. STAR alignment QC/post_alignment_qaqc.txt';
import quantify_to_annotation_gene_counts from '../assets/Partek_Flow/For_report_html/03. raw reads/Quantify_to_annotation_Gene_counts.txt';
import normalized_counts from '../assets/Partek_Flow/For_report_html/04. normalized reads/Normalized_counts.txt';
import RNAseq_CPM_PCA from '../assets/Partek_Flow/For_report_html/04. normalized reads/PCA_exported.txt';
export {
  rawFastqQC,
  trimemd_fastqQC,
  filterOutrRNAfastqQC,
  star_alignmentQC,
  quantify_to_annotation_gene_counts,
  normalized_counts,
  RNAseq_CPM_PCA,
}