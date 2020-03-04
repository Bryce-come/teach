
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
    CName: '操作台管理',
    parentCName: '实验室管理',
  },
};
const equipmentMaintenance = {
  path: '/laboratory/equipment-maintenance',
  name: 'equipmentMaintenance',
  component: () => import('../views/laboratory/equipment-maintenance.vue'),
  meta: {
    CName: '设备保养维修',
    parentCName: '实验室管理',
  },
};
const cuttingToolManagement = {
  path: '/laboratory/cutting-tool-management',
  name: 'cuttingToolManagement',
  component: () => import('../views/laboratory/cutting-tool-management.vue'),
  meta: {
    CName: '刀具管理',
    parentCName: '实验室管理',
  },
};
const monitor = {
  path: '/monitor',
  name: 'monitor',
  alias: '',
  component: () => import('../views/monitor/monitor.vue'),
  meta: {
    CName: '实时监控',
    parentCName: '实验室管理',
  },
};
const monitorDetail = {
  path: '/monitor/detail/:id',
  name: 'monitorDetail',
  component: () => import('../views/monitor/monitor-detail.vue'),
  meta: {
    CName: '监控详情',
    parentCName: '实验室管理',
    parentName: 'monitor',
  },
};
const monitorHistory = {
  path: '/monitor/history',
  name: 'monitorHistory',
  component: () => import('../views/monitor/monitor-history.vue'),
  meta: {
    CName: '使用过程分析',
    parentCName: '实验室管理',
  },
};
const monitorHistoryDetail = {
  path: '/monitor/history/detail',
  name: 'monitorHistoryDetail',
  component: () => import('../views/monitor/monitor-history-detail.vue'),
  meta: {
    CName: '使用过程分析详情',
    parentCName: '实验室管理',
    parentName: 'monitorHistory',
  },
};
const processMonitorDetail = {
  path: '/laboratory/processMonitorDetail/:id',
  name: 'processMonitorDetail',
  component: () => import('../views/laboratory/process-monitor-detail.vue'),
  meta: {
    CName: '操作台详情',
    parentCName: '实验室管理',
    parentName: 'monitorHistory',
  },
};
const usageAnalysis = {
  path: '/laboratory/usage-analysis',
  name: 'usageAnalysis',
  component: () => import('../views/laboratory/usage-analysis.vue'),
  meta: {
    CName: '使用情况统计',
    parentCName: '实验室管理',
  },
};
const courseScheduling = {
  path: '/course/courseScheduling',
  name: 'courseScheduling',
  component: () => import('../views/course/course-scheduling.vue'),
  // 这里都加上authDisabled，不用检验是否登录
  meta: {
    CName: '实训排课',
    parentCName: '实验课程管理',
  },
};
const experiment = {
  path: '/course/experiment',
  name: 'experiment',
  component: () => import('../views/course/experiment.vue'),
  meta: {
    CName: '实验项目',
    parentCName: '实验课程管理',
  },
};
const courseManagement = {
  path: '/course/course-management',
  name: 'courseManagement',
  component: () => import('../views/course/course-management.vue'),
  meta: {
    CName: '课程管理',
    parentCName: '实验课程管理',
  },
};
const reportTemplateManagement = {
  path: '/course/report-template-management',
  name: 'reportTemplateManagement',
  component: () => import('../views/course/report-template-management.vue'),
  meta: {
    CName: '报告模板管理',
    parentCName: '实验课程管理',
  },
};
const appointment = {
  path: '/course/appointment',
  name: 'appointment',
  component: () => import('../views/course/appointment.vue'),
  meta: {
    CName: '实验室预约',
    parentCName: '实验课程管理',
  },
};
const appointmentExamine = {
  path: '/course/appointmentExamine',
  name: 'appointmentExamine',
  component: () => import('../views/course/appointment-examine.vue'),
  // 这里都加上authDisabled，不用检验是否登录
  meta: {
    CName: '预约审核',
    parentCName: '实验课程管理',
  },
};
const teacherManagement = {
  path: '/personnel/teacherManagement',
  name: 'teacherManagement',
  component: () => import('../views/personnel/teacher-management.vue'),
  meta: {
    CName: '教师管理',
    parentCName: '人员管理',
  },
};
const studentManagement = {
  path: '/personnel/studentManagement',
  name: 'studentManagement',
  component: () => import('../views/personnel/student-management.vue'),
  meta: {
    CName: '学生管理',
    parentCName: '人员管理',
  },
};
const deviceAlarm = {
  path: '/alarm/deviceAlarm',
  name: 'deviceAlarm',
  component: () => import('../views/alarm/device-alarm.vue'),
  meta: {
    CName: '设备报警',
    parentCName: '报警提醒',
  },
};
const disusingAlarm = {
  path: '/alarm/disusingAlarm',
  name: 'disusingAlarm',
  component: () => import('../views/alarm/disusing-alarm.vue'),
  meta: {
    CName: '非法使用报警',
    parentCName: '报警提醒',
  },
};
const delayAlarm = {
  path: '/alarm/delayAlarm',
  name: 'delayAlarm',
  component: () => import('../views/alarm/delay-alarm.vue'),
  meta: {
    CName: '维保超期报警',
    parentCName: '报警提醒',
  },
};
const teachMonitor = {
  path: '/teach/teachMonitor',
  name: 'teachMonitor',
  component: () => import('../views/teach/teach-monitor.vue'),
  meta: {
    CName: '现场监控',
    parentCName: '教学过程管理',
  },
};
const deviceDistribution = {
  path: '/teach/deviceDistribution',
  name: 'deviceDistribution',
  component: () => import('../views/teach/device-distribution.vue'),
  meta: {
    CName: '教学设备分配',
    parentCName: '教学过程管理',
  },
};
const programManagement = {
  path: '/teach/program-management',
  name: 'programManagement',
  component: () => import('../views/teach/program-management.vue'),
  meta: {
    CName: 'NC程序管理',
    parentCName: '教学过程管理',
  },
};
const experimentResultScore = {
  path: '/teach/experiment-result-score',
  name: 'experimentResultScore',
  component: () => import('../views/teach/experiment-result-score.vue'),
  meta: {
    CName: '实验结果及评分',
    parentCName: '教学过程管理',
  },
};
const gatewayChannelManagement = {
  path: '/teach/gateway-channel-management',
  name: 'gatewayChannelManagement',
  component: () => import('../views/teach/gateway-channel-management.vue'),
  meta: {
    CName: '网关通道管理',
    parentCName: '教学过程管理',
  },
};
const systemOptionSetting = {
  path: '/system/system-option-setting',
  name: 'systemOptionSetting',
  component: () => import('../views/system/system-option-setting.vue'),
  meta: {
    CName: '系统选项设置',
    parentCName: '系统管理',
  },
};
const equipmentModelConfiguration = {
  path: '/system/equipment-model-configuration',
  name: 'equipmentModelConfiguration',
  component: () => import('../views/system/equipment-model-configuration.vue'),
  meta: {
    CName: '设备型号配置',
    parentCName: '系统管理',
  },
};
const preview = {
  path: '/preview',
  name: 'preview',
  component: () => import('../views/teach/preview.vue'),
  meta: {
    CName: '课前预习',
  },
};
const homework = {
  path: '/homework',
  name: 'homework',
  component: () => import('../views/teach/homework.vue'),
  meta: {
    CName: '课后作业',
  },
};

const test = {
  path: '/test',
  name: 'test',
  component: () => import('../views/test.vue'),
  meta: {
    CName: 'test',
    parentCName: '系统管理',
  },
};
//
// // 按顺序 用于菜单的排列
const indexChildren = [
  monitor,
  device,
  workTop,
  equipmentMaintenance,
  cuttingToolManagement,
  monitorDetail,
  monitorHistory,
  monitorHistoryDetail,
  processMonitorDetail,
  usageAnalysis,
  // 实验课程管理
  courseScheduling,
  experiment,
  courseManagement,
  reportTemplateManagement,
  appointment,
  appointmentExamine,
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
  // test,
  // 课前预习
  preview,
  // 课后作业
  homework,
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
    // redirect: {name: 'Monitor'},
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
