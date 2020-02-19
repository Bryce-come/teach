import Vue from 'vue';

// scss
import 'web-toolkit/src/scss/common.scss';
import 'web-toolkit/src/scss/vivify.scss';

// 注意加载顺序
import 'web-toolkit/src/plugins';
import 'web-toolkit/src/case-main';
import 'web-toolkit/src/filter/date-time';

// components
import lktTable from 'web-toolkit/src/components/lkt-table.vue';
Vue.component('lkt-table', lktTable);
import lktSelect from 'web-toolkit/src/components/lkt-select.vue';
Vue.component('lkt-select', lktSelect);
import LktDatePicker from 'web-toolkit/src/components/lkt-date-picker.vue';
Vue.component('lkt-date-picker', LktDatePicker);
import LktChart from 'web-toolkit/src/components/lkt-chart.vue';
Vue.component('lkt-chart', LktChart);
import LktCheck from 'web-toolkit/src/components/lkt-check.vue';
Vue.component('lkt-check', LktCheck);
import KitDialogSimple from 'web-toolkit/src/components/kit-dialog-simple.vue';
Vue.component('kit-dialog-simple', KitDialogSimple);
