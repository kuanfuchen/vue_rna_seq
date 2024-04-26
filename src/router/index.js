import { createRouter ,/* createWebHistory*/ createWebHashHistory  } from 'vue-router';
const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'ProjectInfo',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },
      {
        path:'workflowInfo',
        name:'workflowInfo',
        component: () => import('@/views/WorkflowInfo.vue')
      },
      {
        path: 'readAlignment',
        name:'ReadAlignment',
        component: () => import('@/views/ReadPage.vue')
      },
      {
        path: 'visualization',
        name:'Visualization',
        component: () => import('@/views/VisualizationPage.vue')
      },
      {
        path: 'differenceExpression',
        name:'DifferenceExpression',
        component: () => import('@/views/RNAseq_DE_page.vue')
      },
      {
        path:'functionEnrichment',
        name:'FunctionEnrichment',
        component: () => import('@/views/FunctionalEnrichment.vue')
      },
      {
        path:'/:catchAll(.*)',
        name:'notfound',
        component:()=>import('@/views/Notfound.vue')
      },
      // {
      //   path:'externalFold',
      //   name:'externalFold',
      //   component:()=>import('@/views/ExternalFold.vue')
      // }
    ],
  },
]
const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history:createWebHashHistory(),
  // createWebHashHistory
  base: process.env.BASE_URL,
  routes
})

export default router
