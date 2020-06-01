import Vue from 'vue';
import App from './App.vue';

// 加载所用组件，含core
import './plugin';

import { routeIntercept, axiosIntercept, buildMenu} from 'web-toolkit/src/case-main';

import { mainMenuTitles } from './config';
import './scss/common.scss';
import { routes } from './router/routes';
import { genRouter } from 'web-toolkit/src/case-main/router';
export const router = genRouter(routes);
buildMenu(routes, mainMenuTitles);
routeIntercept(router);
axiosIntercept(router);

const vm = new Vue({
  router,
  render: (h) => h(App),
});
// 可用于延迟加载
vm.$mount('#app');
