import Vue from 'vue';

// scss
import 'web-toolkit/src/scss/common.scss';
import 'web-toolkit/src/scss/vivify.scss';

// 注意加载顺序
import 'web-toolkit/src/plugins';
import 'web-toolkit/src/case-main';
import 'web-toolkit/src/filter/date-time';

// components
import lktTable from 'web-toolkit/src/components/kit-table.vue';
Vue.component('lkt-table', lktTable);
import lktSelect from 'web-toolkit/src/components/kit-select.vue';
Vue.component('lkt-select', lktSelect);
import LktDatePicker from 'web-toolkit/src/components/kit-date-picker.vue';
Vue.component('lkt-date-picker', LktDatePicker);
import LktChart from 'web-toolkit/src/components/kit-chart.vue';
Vue.component('lkt-chart', LktChart);
// import LktCheck from 'web-toolkit/src/components/kit-check.vue';
// Vue.component('lkt-check', LktCheck);
import KitDialogSimple from 'web-toolkit/src/components/kit-dialog-simple.vue';
Vue.component('kit-dialog-simple', KitDialogSimple);
import KitErrChannel from 'web-toolkit/src/components/kit-err-channel.vue';
Vue.component('kit-err-channel', KitErrChannel);
import KitTip from 'web-toolkit/src/components/kit-tip.vue';
Vue.component('kit-tip', KitTip);
