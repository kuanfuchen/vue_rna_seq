<template>
  <div class="">
    <v-navigation-drawer v-model="definedProp.leftDrawer" location="left" >
      <div class="sidebarStyle">
        <v-list>
        <v-list-item to="/" :active="activeItem === 'projectInfo'" @click="activeItem = 'projectInfo'">
          <v-list-item-title v-text="'Project Information'" class="titleStyle"></v-list-item-title>
        </v-list-item>
      </v-list>
      <v-list>
        <v-list-item to="workflowInfo" :active="activeItem === 'workflowInfo'" @click="activeItem = 'workflowInfo'">
          <v-list-item-title v-text="'Workflow & Materials'"  class="titleStyle"></v-list-item-title>
        </v-list-item>
      </v-list>
      <v-list>
        <v-list-subheader class="titleStyle">QC Reports <v-icon icon="fa:fas fa-caret-down"></v-icon></v-list-subheader>
        <v-list-item v-for="(item, i) in sideBarGroupA" :key="i" :to="item.to"
          @click="activeItem = item.value"  :active="activeItem === item.value" >
            <v-list-item-title v-text="item.title" class="subTitleStyle pl-3">
            </v-list-item-title>
        </v-list-item>
      </v-list>
      <v-list>
        <v-list-subheader class="titleStyle">Analysis <v-icon icon="fa:fas fa-caret-down"></v-icon></v-list-subheader>
        <v-list-item v-for="(item, i) in sideBarGroupB" :key="i" :to="item.to"
          @click="activeItem = item.value"  :active="activeItem === item.value">
          <v-list-item-title v-text="item.title" class="subTitleStyle pl-3"></v-list-item-title>       
        </v-list-item>
        <v-list-item   class="subTitleStyle"></v-list-item>
      </v-list>
      </div>
      <div class="footerAbout mt-auto" >
        <div class="d-flex justify-center mb-2 " >
          <img src="../assets/img/logo.png" >
        </div>
        <div class="d-flex justify-center">
          <div class="" style="text-align: center;">
            <p>Bioinformatics Team</p>
            <p>連絡人：張益峯博士</p>
            <p>分機：03-2118800 #3941</p>
            <a href = "mailto: ianyfchang@mail.cgu.edu.tw">ianyfchang@mail.cgu.edu.tw</a>
            <p>Version 1.1.1</p>
          </div>
        </div>
      </div>
    </v-navigation-drawer>
  </div>
</template>
<style lang="scss" scope>
  .titleStyle{
    font-size: 18px;
    font-weight: 700;
    color: #00000099;
  }
  .subTitleStyle{
      font-size: 15px;
      color: #546E7A;
  }
  .footerAbout{
    font-size: 16px;
    color: #546E7A;
    height: 200px;
    // position: fixed;
    // bottom: 0;
    width:100%;
    img{
      width:160px
    }
    // text-align:center;
  }
  .sidebarStyle{
    height: calc(100vh - 80px - 200px);
    overflow-y: auto;
  }
</style>
<script setup>
  import { defineProps } from 'vue';
  const definedProp = defineProps({
    'leftDrawer':{
      type:Boolean,
    }
  });
  import { ref } from 'vue';
  const activeItem = ref('projectInfo');
  const sideBarGroupA = [
  {
    value:"readAlignment",
    title:'Read & Alignment',
    to:'/readAlignment'
  },
  {
    value:'visualization',
    title:'Visualization',
    to:'/visualization'
  }
];
  const sideBarGroupB = [
  {
    value:'differenceExpression',
    title:'Differential Expression',
    to:'/differenceExpression'
  },{
    value:'functionalEnrichment',
    title:'Functional Enrichment:GO',
    to:'/functionEnrichment'
  },{
    vlaue:'functionEnrichmentKEGG',
    title:'Functional Enrichment:KEGG',
    to:'/fe_kegg'
  }];
</script>
