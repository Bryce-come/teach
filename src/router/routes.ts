
import { PRIVILEGE } from '@/types/privilege';

const roleMng = {
  path: '/management/role',
  name: 'roleMng',
  component: () => import('../views/user/role.vue'),
  meta: {
    privileges: [PRIVILEGE.ROLE_MNG],
    CName: '角色权限管理',
    parentCName: '系统管理',
  },
};
const userMng = {
  path: '/management/user',
  name: 'userMng',
  component: () => import('../views/user/user.vue'),
  meta: {
    privileges: [PRIVILEGE.USER_MNG],
    CName: '系统账户管理',
    parentCName: '系统管理',
  },
};
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
const device = {
  path: '/laboratory/device',
  name: 'device',
  component: () => import('../views/laboratory/device.vue'),
  meta: {
    CName: '设备台账管理',
    parentCName: '实验室管理',
  },
};
const workTop = {
  path: '/laboratory/worktop',
  name: 'workTop',
  component: () => import('../views/laboratory/worktop.vue'),
  meta: {
    authDisabled: true,
    CName: '操作台管理',
    parentCName: '实验室管理',
  },
};
const equipmentMaintenance = {
  path: '/laboratory/equipment-maintenance',
  name: 'equipmentMaintenance',
  component: () => import('../views/laboratory/equipment-maintenance.vue'),
  meta: {
    authDisabled: true,
    CName: '设备保养维修',
    parentCName: '实验室管理',
  },
};
const cuttingToolManagement = {
  path: '/laboratory/cutting-tool-management',
  name: 'cuttingToolManagement',
  component: () => import('../views/laboratory/cutting-tool-management.vue'),
  meta: {
    authDisabled: true,
    CName: '刀具管理',
    parentCName: '实验室管理',
  },
};
const monitor = {
  path: '/laboratory/monitor',
  name: 'monitor',
  component: () => import('../views/laboratory/monitor.vue'),
  meta: {
    authDisabled: true,
    CName: '实时监控',
    parentCName: '实验室管理',
  },
};
const monitorDetail = {
  path: '/laboratory/monitorDetail/:id',
  name: 'monitorDetail',
  component: () => import('../views/laboratory/monitor-detail.vue'),
  meta: {
    authDisabled: true,
    CName: '监控详情',
    parentCName: '实验室管理',
    parentName: 'monitor',
  },
};
const usingProcess = {
  path: '/laboratory/usingProcess',
  name: 'usingProcess',
  component: () => import('../views/laboratory/using-process.vue'),
  meta: {
    authDisabled: true,
    CName: '使用过程分析',
    parentCName: '实验室管理',
  },
};
const usageAnalysis = {
  path: '/laboratory/usage-analysis',
  name: 'usageAnalysis',
  component: () => import('../views/laboratory/usage-analysis.vue'),
  meta: {
    authDisabled: true,
    CName: '使用情况分析',
    parentCName: '实验室管理',
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
const experiment = {
  path: '/course/experiment',
  name: 'experiment',
  component: () => import('../views/course/experiment.vue'),
  meta: {
    authDisabled: true,
    CName: '实验项目',
    parentCName: '实验课程管理',
  },
};
const courseManagement = {
  path: '/course/course-management',
  name: 'courseManagement',
  component: () => import('../views/course/course-management.vue'),
  meta: {
    authDisabled: true,
    CName: '课程管理',
    parentCName: '实验课程管理',
  },
};
const reportTemplateManagement = {
  path: '/course/report-template-management',
  name: 'reportTemplateManagement',
  component: () => import('../views/course/report-template-management.vue'),
  meta: {
    authDisabled: true,
    CName: '报告模板管理',
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
const teacherManagement = {
  path: '/personnel/teacherManagement',
  name: 'teacherManagement',
  component: () => import('../views/personnel/teacher-management.vue'),
  meta: {
    authDisabled: true,
    CName: '教师管理',
    parentCName: '人员管理',
  },
};
const studentManagement = {
  path: '/personnel/studentManagement',
  name: 'studentManagement',
  component: () => import('../views/personnel/student-management.vue'),
  meta: {
    authDisabled: true,
    CName: '学生管理',
    parentCName: '人员管理',
  },
};
const deviceAlarm = {
  path: '/alarm/deviceAlarm',
  name: 'deviceAlarm',
  component: () => import('../views/alarm/device-alarm.vue'),
  meta: {
    authDisabled: true,
    CName: '设备报警',
    parentCName: '报警提醒',
  },
};
const disusingAlarm = {
  path: '/alarm/disusingAlarm',
  name: 'disusingAlarm',
  component: () => import('../views/alarm/disusing-alarm.vue'),
  meta: {
    authDisabled: true,
    CName: '非法使用报警',
    parentCName: '报警提醒',
  },
};
const delayAlarm = {
  path: '/alarm/delayAlarm',
  name: 'delayAlarm',
  component: () => import('../views/alarm/delay-alarm.vue'),
  meta: {
    authDisabled: true,
    CName: '维保超期报警',
    parentCName: '报警提醒',
  },
};
const teachMonitor = {
  path: '/teach/teachMonitor',
  name: 'teachMonitor',
  component: () => import('../views/teach/teach-monitor.vue'),
  meta: {
    authDisabled: true,
    CName: '现场监控',
    parentCName: '教学过程管理',
  },
};
const deviceDistribution = {
  path: '/teach/deviceDistribution',
  name: 'deviceDistribution',
  component: () => import('../views/teach/device-distribution.vue'),
  meta: {
    authDisabled: true,
    CName: '教学设备分配',
    parentCName: '教学过程管理',
  },
};
const programManagement = {
  path: '/teach/program-management',
  name: 'programManagement',
  component: () => import('../views/teach/program-management.vue'),
  meta: {
    authDisabled: true,
    CName: 'NC程序管理',
    parentCName: '教学过程管理',
  },
};
const experimentResultScore = {
  path: '/teach/experiment-result-score',
  name: 'experimentResultScore',
  component: () => import('../views/teach/experiment-result-score.vue'),
  meta: {
    authDisabled: true,
    CName: '实验结果及评分',
    parentCName: '教学过程管理',
  },
};
const gatewayChannelManagement = {
  path: '/teach/gateway-channel-management',
  name: 'gatewayChannelManagement',
  component: () => import('../views/teach/gateway-channel-management.vue'),
  meta: {
    authDisabled: true,
    CName: '网关通道管理',
    parentCName: '教学过程管理',
  },
};
const systemOptionSetting = {
  path: '/system/system-option-setting',
  name: 'systemOptionSetting',
  component: () => import('../views/system/system-option-setting.vue'),
  meta: {
    authDisabled: true,
    CName: '系统选项设置',
    parentCName: '系统管理',
  },
};
const equipmentModelConfiguration = {
  path: '/system/equipment-model-configuration',
  name: 'equipmentModelConfiguration',
  component: () => import('../views/system/equipment-model-configuration.vue'),
  meta: {
    authDisabled: true,
    CName: '设备型号配置',
    parentCName: '系统管理',
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
// // 报警提醒
//   deviceAlarmRecord,
//   analysisGuarantee,
//   orderDelay,
  device,
  workTop,
  equipmentMaintenance,
  cuttingToolManagement,
  monitor,
  monitorDetail,
  usingProcess,
  usageAnalysis,
  // 实验课程管理
  courseScheduling,
  experiment,
  courseManagement,
  reportTemplateManagement,
  courseAppointment,
  // 人员管理
  teacherManagement,
  studentManagement,
  // 报警提醒
  deviceAlarm,
  disusingAlarm,
  delayAlarm,
  // 教学过程管理
  teachMonitor,
  deviceDistribution,
  programManagement,
  experimentResultScore,
  gatewayChannelManagement,
  // 系统管理
  systemOptionSetting,
  equipmentModelConfiguration,
  userMng,
  roleMng,
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
    // redirect: 'test',
    component: () => import('../views/main/index.vue'),
    children: indexChildren,
    meta: { authDisabled: false },
  },
  {
    path: '*',
    name: '404',
    component: () => import('../components/page404.vue'),
    meta: { authDisabled: true },
  },
];
