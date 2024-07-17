<template>
  <div>
    <v-container>
      <v-row class="d-flex justify-center">
        <v-col cols="8">
          <h1 class="mb-5 mx-3 workflowtitleStyle">RNA-seq analysis method</h1>
          <p class="mb-5 ml-3 subscribeText">
            We processed RNA-seq data using the Partek Flow analysis software. Initially, we removed low-quality bases and sequencing adapters from the raw FASTQ files. The trimmed reads were then aligned to the whole genome reference using STAR. Next, we quantified reads assigned to the RNA listed in the GENCODE Genes and normalized them to CPM (Counts Per Million) or DESeq2 RLE (relative log expression). Statistical analysis, hierarchical clustering, and differential expression analysis were performed using the GSA (Gene Specific Analysis) or DESeq2 function in Partek Flow. We further analyzed differential expression genes using STRING database and GSEA (Gene set enrichment analysis) for their potential role in biological processes or pathway.
          </p>
        </v-col>
        <v-col cols="8">
          <div class="d-flex justify-center mt-5">
            <img src="../assets/img/CGMMRC RNA-seq pipeline_20240403_Partek Flow.png"  style="width:40vw;">
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<style lang="scss">
  .workflowtitleStyle{
    color: #455A64;
  }
  .subscribeText{
    font-size:20px; 
    font-weight: 500;
    color: #546E7A;
  }
</style>