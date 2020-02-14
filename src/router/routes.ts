
import { PRIVILEGE } from '@/types/privilege';

// const roleMng = {
//   path: '/management/role',
//   name: 'roleMng',
//   component: () => import('../views/user/role.vue'),
//   meta: {
//     privileges: [PRIVILEGE.ROLE_MNG],
//     CName: '角色权限管理',
//     parentCName: '系统管理',
//   },
// };
// const indexPage = {
//   path: '/index-page',
//   name: 'index-page',
//   component: () => import('../views/monitor/index.vue'),
//   alias: '',
//   meta: {
//     privileges: [PRIVILEGE.DEVICE_MONITOR],
//     CName: '设备总览',
//   },
// };
// const monitoring = {
//   path: '/monitoring',
//   name: 'monitoring',
//   component: () => import('../views/monitor/monitoring.vue'),
//   meta: {
//     privileges: [PRIVILEGE.DEVICE_MONITOR],
//     CName: '设备监控',
//   },
// };
// const alarmRule = {
//   path: '/alarm/rule',
//   name: 'alarmRule',
//   component: () => import('../views/alarm/alarm-rule.vue'),
//   meta: {
//     privileges: ['alarmRuleMng'],
//     CName: '报警规则设定',
//     parentCName: '系统管理',
//   },
// };
// const orderDelay = {
//   path: '/alarm/orderDelay',
//   name: 'orderDelay',
//   component: () => import('../views/alarm/order-delay.vue'),
//   meta: {
//     privileges: [[PRIVILEGE.DEVICE_MONITOR, PRIVILEGE.MODE_ORDER]],
//     CName: '工单延误提醒',
//     parentCName: '报警提醒',
//   },
// };
// const monitoringDetail = {
//   path: '/monitoring/detail/:id',
//   name: 'monitoringDetail',
//   component: () => import('../views/monitor/monitoring-detail.vue'),
//   meta: {
//     privileges: [PRIVILEGE.DEVICE_MONITOR],
//     CName: '监控详情',
//     parentCName: '设备监控',
//     parentName: 'monitoring',
//   },
// };
// const commonAnalysis = {
//   path: '/analysis/common',
//   name: 'commonAnalysis',
//   component: () => import('../views/analysis/common.vue'),
//   meta: {
//     privileges: [PRIVILEGE.DEVICE_ANALYSIS],
//     CName: '通用统计分析',
//     parentCName: '运行分析',
//   },
// };
// const parameter = {
//   path: '/analysis/parameter',
//   name: 'parameterAnalysis',
//   component: () => import('../views/analysis/parameter.vue'),
//   meta: {
//     privileges: [PRIVILEGE.DEVICE_ANALYSIS],
//     CName: '参数历史统计',
//     parentCName: '运行分析',
//   },
// };
// const alarmAnalysis = {
//   path: '/analysis/alarm',
//   name: 'alarmAnalysis',
//   redirect: { name: 'alarm-analysis-summary' },
//   component: () => import('../views/analysis/alarm.vue'),
//   meta: {
//     privileges: [PRIVILEGE.DEVICE_ANALYSIS],
//     CName: '报警统计分析',
//     parentCName: '运行分析', 
//   },
//   children: [
//     {
//       path: '',
//       name: 'alarm-analysis-summary',
//       component: () => import('../views/analysis/alarm-summary.vue'),
//       meta: {
//         privileges: [PRIVILEGE.DEVICE_ANALYSIS],
//         CName: '报警总数分析',
//         parentCName: '报警分析',
//         parentName: 'alarmAnalysis',
//       },
//     }, {
//       path: 'reason',
//       name: 'alarm-analysis-reason',
//       component: () => import('../views/analysis/alarm-reason.vue'),
//       meta: {
//         privileges: [PRIVILEGE.DEVICE_ANALYSIS],
//         CName: '报警原因分析',
//         parentCName: '报警分析',
//         parentName: 'alarmAnalysis',
//       },
//     },
//   ],
// };
// const runtime = {
//   path: '/analysis/runtime',
//   name: 'runtime',
//   component: () => import('../views/analysis/runtime.vue'),
//   meta: {
//     privileges: [PRIVILEGE.DEVICE_ANALYSIS],
//     CName: '运行时间统计',
//     parentCName: '运行分析',
//   },
// };
// const deviceAlarmRecord = {
//   path: '/alarm/device/record',
//   name: 'deviceAlarmRecord',
//   component: () => import('../views/alarm/device-alarm-record.vue'),
//   meta: {
//     privileges: [],
//     CName: '设备报警记录',
//     parentCName: '报警提醒',
//   },
// };
// const analysisGuarantee = {
//   path: '/alarm/guarantee',
//   name: 'analysisGuarantee',
//   component: () => import('../views/alarm/guarantee.vue'),
//   meta: {
//     privileges: [PRIVILEGE.DEVICE_ANALYSIS, PRIVILEGE.QUALITY_DT_MNG],
//     CName: '产品质保提醒',
//     parentCName: '报警提醒',
//   },
// };
// const workOrderList = {
//   path: '/work-order/list',
//   name: 'workOrderList',
//   component: () => import('../views/work-order/order-list.vue'),
//   meta: {
//     privileges: [[PRIVILEGE.MAINTENT_ORDER_LIST, PRIVILEGE.MODE_ORDER], [PRIVILEGE.MAINTENT_ORDER_MNG, PRIVILEGE.MODE_ORDER]],
//     CName: '工单查询',
//     parentCName: '工单管理',
//   },
// };
// const workOrderList2 = {
//   path: '/work-order/list2',
//   name: 'workOrderList2',
//   component: () => import('../views/work-order/order-list.vue'),
//   meta: {
//     privileges: [[PRIVILEGE.MAINTENT_ORDER_LIST, PRIVILEGE.MODE_DEVICE], [PRIVILEGE.MAINTENT_ORDER_MNG, PRIVILEGE.MODE_DEVICE]],
//     CName: '远程记录',
//   },
// };
// const workOrderCreate = {
//   path: '/work-order/create',
//   name: 'workOrderCreate',
//   component: () => import('../views/work-order/create.vue'),
//   meta: {
//     privileges: [[PRIVILEGE.MAINTENT_ORDER_MNG, PRIVILEGE.MODE_ORDER]],
//     CName: '开始派单',
//     parentCName: '工单管理',
//   },
// };
// const workOrderComplete = {
//   path: '/work-order/complete/:id',
//   name: 'workOrderComplete',
//   component: () => import('../views/work-order/complete.vue'),
//   meta: {
//     privileges: [PRIVILEGE.MAINTENT_ORDER_LIST],
//     CName: '销单',
//     parentCName: '派单查询',
//     parentName: 'workOrderList',
//   },
// };
// const 设备配置管理 = {
//   path: '/setting/device',
//   name: 'deviceSetting',
//   component: () => import('../views/setting/device.vue'),
//   meta: {
//     privileges: [PRIVILEGE.DEVICE_MNG],
//     CName: '设备信息绑定',
//     parentCName: '系统管理',
//   },
// };
// const 设备网关配置 = {
//   path: '/setting/gateway',
//   name: 'gateway',
//   component: () => import('../views/setting/gateway.vue'),
//   meta: {
//     privileges: [PRIVILEGE.ADAPTER_DEVICE_MNG],
//     CName: '设备网关配置',
//     parentCName: '系统管理',
//   },
// };
// const 用户信息管理 = {
//   path: '/setting/system',
//   name: '用户信息管理',
//   component: () => import('../views/user/system.vue'),
//   meta: {
//     privileges: [PRIVILEGE.ADAPTER_DEVICE_MNG],
//     CName: '用户信息管理',
//     parentCName: '系统管理',
//   },
// };
// const 参数显示配置 = {
//   path: '/setting/collector',
//   name: '参数显示配置',
//   component: () => import('../views/setting/collector.vue'),
//   meta: {
//     privileges: [PRIVILEGE.COLLECT_PARAMS_MNG],
//     CName: '参数显示配置',
//     parentCName: '系统管理',
//   },
// };
// const 客户资料管理 = {
//   path: '/setting/customer',
//   name: '客户资料维护',
//   component: () => import('../views/setting/customer.vue'),
//   meta: {
//     privileges: [PRIVILEGE.CUSTOMER_MNG],
//     CName: '客户资料管理',
//     parentCName: '系统管理',
//   },
// };
// const deviceType = {
//   path: '/setting/deviceType',
//   name: 'deviceType',
//   component: () => import('../views/general/device-type.vue'),
//   meta: {
//     CName: '设备型号配置',
//     parentCName: '系统管理',
//   },
// };
// const test = {
//   path: '/setting/test',
//   name: 'test',
//   component: () => import('../views/test/test.vue'),
//   meta: {
//     CName: '测试',
//     parentCName: '系统管理',
//   },
// };
// 测试用例
const test = {
  path: '/',
  name: 'test',
  component: () => import('../views/test/test.vue'),
  // 这里都加上authDisabled，不用检验是否登录
  meta: {
    authDisabled: true,
    CName: '测试',
    parentCName: '菜单一',
  },
};
const courseScheduling = {
  path: '/course/courseScheduling',
  name: 'courseScheduling',
  component: () => import('../views/course/course-scheduling.vue'),
  // 这里都加上authDisabled，不用检验是否登录
  meta: {
    authDisabled: true,
    CName: '实训排课',
    parentCName: '实验课程管理',
  },
};
const courseAppointment = {
  path: '/course/courseAppointment',
  name: 'courseAppointment',
  component: () => import('../views/course/course-appointment.vue'),
  // 这里都加上authDisabled，不用检验是否登录
  meta: {
    authDisabled: true,
    CName: '预约审核',
    parentCName: '实验课程管理',
  },
};

//
// // 按顺序 用于菜单的排列
const indexChildren = [
//   indexPage,
//   monitoring,
//   monitoringDetail,
// // 运行分析
//   parameter,
//   runtime,
//   commonAnalysis,
//   alarmAnalysis,
// // 报警提醒
//   deviceAlarmRecord,
//   analysisGuarantee,
//   orderDelay,
// // 工单管理
//   workOrderCreate,
//   workOrderList,
//   workOrderList2,
//   workOrderComplete,
//   // workOrderComment,
//   // 系统管理
//   设备网关配置,
//   设备配置管理,
//   参数显示配置,
//   alarmRule,
//   deviceType,
//   客户资料管理,
//   用户信息管理,
//   // 维护人员管理,
//   // userMng,
//   roleMng,
  test,
  // 实验课程管理
  courseScheduling,
  courseAppointment,
  {
    path: '*',
    name: '404_child',
    component: () => import('../components/page404.vue'),
    meta: { authDisabled: true },
  },
];
export const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue'),
    meta: { authDisabled: true },
  },

  {
    path: '/',
    name: 'index',
    redirect: 'test',
    component: () => import('../views/main/index.vue'),
    children: indexChildren,
    meta: { authDisabled: true },
  },
  {
    path: '*',
    name: '404',
    component: () => import('../components/page404.vue'),
    meta: { authDisabled: true },
  },
];
