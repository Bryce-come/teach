
import { PRIVILEGE, Department } from '@/types/privilege';

const roleMng = {
  path: '/management/role',
  name: 'roleMng',
  component: () => import('../views/user/role.vue'),
  meta: {
    privileges: [PRIVILEGE.roleMng],
    CName: '角色权限管理',
    parentCName: '系统管理',
  },
};
const userMng = {
  path: '/management/user',
  name: 'userMng',
  component: () => import('../views/user/user.vue'),
  meta: {
    privileges: [PRIVILEGE.userMng],
    CName: '系统账户管理',
    parentCName: '系统管理',
  },
};
const device = {
  path: '/laboratory/device',
  name: 'device',
  component: () => import('../views/laboratory/device.vue'),
  meta: {
    privileges: [PRIVILEGE.deviceMng],
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
    privileges: [PRIVILEGE.expStationMng],
  },
};
const equipmentMaintenance = {
  path: '/laboratory/equipment-maintenance',
  name: 'equipmentMaintenance',
  component: () => import('../views/laboratory/equipment-maintenance.vue'),
  meta: {
    CName: '设备保养维修',
    parentCName: '实验室管理',
    privileges: [PRIVILEGE.deviceMaintenMng],
  },
};
const cuttingToolManagement = {
  path: '/laboratory/cutting-tool-management',
  name: 'cuttingToolManagement',
  component: () => import('../views/laboratory/cutting-tool-management.vue'),
  meta: {
    CName: '刀具管理',
    parentCName: '实验室管理',
    privileges: [PRIVILEGE.deviceComponentMng],
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
    privileges: [PRIVILEGE.deviceMonitor],
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
    privileges: [PRIVILEGE.deviceMonitor],
  },
};
const monitorHistory = {
  path: '/monitor/history',
  name: 'monitorHistory',
  component: () => import('../views/monitor/monitor-history.vue'),
  meta: {
    CName: '使用过程分析',
    parentCName: '实验室管理',
    privileges: [PRIVILEGE.deviceUsageAnalysis],
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
    privileges: [PRIVILEGE.deviceUsageAnalysis],
  },
};
// const processMonitorDetail = {
//   path: '/laboratory/processMonitorDetail/:id',
//   name: 'processMonitorDetail',
//   component: () => import('../views/laboratory/process-monitor-detail.vue'),
//   meta: {
//     CName: '操作台详情',
//     parentCName: '实验室管理',
//     parentName: 'monitorHistory',
//   },
// };
const usageAnalysis = {
  path: '/laboratory/usage-analysis',
  name: 'usageAnalysis',
  component: () => import('../views/laboratory/usage-analysis.vue'),
  meta: {
    CName: '使用情况统计',
    parentCName: '实验室管理',
    privileges: [PRIVILEGE.deviceAnalysis],
  },
};
const courseScheduling = {
  path: '/course/courseScheduling',
  name: 'courseScheduling',
  component: () => import('../views/course/course-scheduling.vue'),
  meta: {
    CName: '实训排课',
    parentCName: '实验课程管理',
    privileges: [PRIVILEGE.courseRecordMng, PRIVILEGE.courseRecordUpdate],
  },
};
const experiment = {
  path: '/course/experiment',
  name: 'experiment',
  component: () => import('../views/course/experiment.vue'),
  meta: {
    CName: '实验项目',
    parentCName: '实验课程管理',
    privileges: [PRIVILEGE.programMng],
  },
};
const courseManagement = {
  path: '/course/course-management',
  name: 'courseManagement',
  component: () => import('../views/course/course-management.vue'),
  meta: {
    CName: '课程管理',
    parentCName: '实验课程管理',
    privileges: [PRIVILEGE.courseMng, PRIVILEGE.courseUpdate],
  },
};
const reportTemplateManagement = {
  path: '/course/report-template-management',
  name: 'reportTemplateManagement',
  component: () => import('../views/course/report-template-management.vue'),
  meta: {
    CName: '报告模板管理',
    parentCName: '实验课程管理',
    privileges: [PRIVILEGE.reportTemplateMng],
  },
};
const appointment = {
  path: '/course/appointment',
  name: 'appointment',
  component: () => import('../views/course/appointment.vue'),
  meta: {
    CName: '实验室预约',
    parentCName: '实验课程管理',
    privileges: [PRIVILEGE.appoint],
    authDepartments: [Department.Teacher, Department.Admin],
  },
};
const appointment4Student = {
  path: '/student/appointment',
  name: 'appointment4Student',
  component: () => import('../views/course/appointment.vue'),
  meta: {
    CName: '实验室预约',
    privileges: [PRIVILEGE.appoint],
    authDepartments: [Department.Student],
  },
};
const appointmentExamine = {
  path: '/course/appointmentExamine',
  name: 'appointmentExamine',
  component: () => import('../views/course/appointment-examine.vue'),
  meta: {
    CName: '预约审核',
    parentCName: '实验课程管理',
    privileges: [PRIVILEGE.appointMng],
  },
};
const teacherManagement = {
  path: '/personnel/teacherManagement',
  name: 'teacherManagement',
  component: () => import('../views/personnel/teacher-management.vue'),
  meta: {
    CName: '教师管理',
    parentCName: '人员管理',
    privileges: [PRIVILEGE.teacherMng],
  },
};
const studentManagement = {
  path: '/personnel/studentManagement',
  name: 'studentManagement',
  component: () => import('../views/personnel/student-management.vue'),
  meta: {
    CName: '学生管理',
    parentCName: '人员管理',
    privileges: [PRIVILEGE.studentMng],
  },
};
const deviceAlarm = {
  path: '/alarm/deviceAlarm',
  name: 'deviceAlarm',
  component: () => import('../views/alarm/device-alarm.vue'),
  meta: {
    CName: '设备报警',
    parentCName: '报警提醒',
    privileges: [PRIVILEGE.deviceAlarm],
  },
};
const disusingAlarm = {
  path: '/alarm/disusingAlarm',
  name: 'disusingAlarm',
  component: () => import('../views/alarm/disusing-alarm.vue'),
  meta: {
    CName: '非法使用报警',
    parentCName: '报警提醒',
    privileges: [PRIVILEGE.usageAlarm],
  },
};
const delayAlarm = {
  path: '/alarm/delayAlarm',
  name: 'delayAlarm',
  component: () => import('../views/alarm/delay-alarm.vue'),
  meta: {
    CName: '维保超期报警',
    parentCName: '报警提醒',
    privileges: [PRIVILEGE.deviceMaintenAlarm],
  },
};
const teachMonitor = {
  path: '/teach/teachMonitor',
  name: 'teachMonitor',
  component: () => import('../views/teach/teach-monitor.vue'),
  meta: {
    CName: '现场监控',
    parentCName: '教学过程管理',
    privileges: [PRIVILEGE.inClassMng],
  },
};
const deviceDistribution = {
  path: '/teach/deviceDistribution',
  name: 'deviceDistribution',
  component: () => import('../views/teach/device-distribution.vue'),
  meta: {
    CName: '教学设备分配',
    parentCName: '教学过程管理',
    privileges: [PRIVILEGE.inClassMng],
  },
};
const programManagement = {
  path: '/teach/program-management',
  name: 'programManagement',
  component: () => import('../views/teach/program-management.vue'),
  meta: {
    CName: 'NC程序管理',
    parentCName: '教学过程管理',
    privileges: [PRIVILEGE.inClassMng],
  },
};
const experimentResultScore = {
  path: '/teach/experiment-result-score',
  name: 'experimentResultScore',
  component: () => import('../views/teach/experiment-result-score.vue'),
  meta: {
    CName: '实验结果及评分',
    parentCName: '教学过程管理',
    privileges: [PRIVILEGE.inClassMng],
  },
};
const gatewayChannelManagement = {
  path: '/teach/gateway-channel-management',
  name: 'gatewayChannelManagement',
  component: () => import('../views/teach/gateway-channel-management.vue'),
  meta: {
    CName: '网关通道管理',
    parentCName: '教学过程管理',
    privileges: [PRIVILEGE.inClassMng],
  },
};
const fileManagement = {
  path: '/teach/file-management',
  name: 'fileManagement',
  component: () => import('../views/teach/file-management.vue'),
  meta: {
    CName: '临时文件管理',
    parentCName: '教学过程管理',
    privileges: [PRIVILEGE.inClassMng],
  },
};
const systemOptionSetting = {
  path: '/system/system-option-setting',
  name: 'systemOptionSetting',
  component: () => import('../views/system/system-option-setting.vue'),
  meta: {
    CName: '系统选项设置',
    parentCName: '系统管理',
    privileges: [PRIVILEGE.systemSetting],
  },
};
const newsMng = {
  path: '/system/news-mng',
  name: 'newsMng',
  component: () => import('../views/system/news-mng.vue'),
  meta: {
    CName: '消息管理设置',
    parentCName: '系统管理',
    privileges: [PRIVILEGE.newsMng],
  },
};
const equipmentModelConfiguration = {
  path: '/system/equipment-model-configuration',
  name: 'equipmentModelConfiguration',
  component: () => import('../views/system/equipment-model-configuration.vue'),
  meta: {
    CName: '设备型号配置',
    parentCName: '系统管理',
    privileges: [PRIVILEGE.deviceTypeMng],
  },
};
const preview = {
  path: '/preview',
  name: 'preview',
  component: () => import('../views/teach/preview.vue'),
  meta: {
    CName: '课前预习',
    authDepartments: [Department.Student],
  },
};
const homework = {
  path: '/homework',
  name: 'homework',
  component: () => import('../views/teach/homework.vue'),
  meta: {
    CName: '课后作业',
    authDepartments: [Department.Student],
  },
};

// const test = {
//   path: '/test',
//   name: 'test',
//   component: () => import('../views/test2.vue'),
//   meta: {
//     CName: 'test',
//     parentCName: '系统管理',
//   },
// };
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
  // processMonitorDetail,
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
  fileManagement,
  // 系统管理
  systemOptionSetting,
  equipmentModelConfiguration,
  newsMng,
  userMng,
  roleMng,
  // test,
  // 学生端
  appointment4Student,
  // 课前预习
  preview,
  // 课后作业
  homework,
  // test,
  {
    path: '*',
    redirect: {name: '404'},
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
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/dashboard.vue'),
    meta: { authDisabled: true },
  },
  {
    path: '/dashboard2',
    name: 'laboratoryDash',
    component: () => import('../views/laboratoryDash.vue'),
    meta: { authDisabled: true },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../components/page404.vue'),
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
    redirect: {name: '404'},
  },
];
