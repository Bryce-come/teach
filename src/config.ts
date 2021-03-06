
// 主菜单
export const mainMenuTitles = [
  // 如果没有子导航，直接在这指定CName一样的值
  '实验室管理', 'icon-xiangmu',
  '物料仓储管理', 'icon-home',
  '实验课程管理', 'icon-manage2',
  '人员管理', 'icon-my',
  '报警提醒', 'icon-message4',
  '教学过程管理', 'icon-oeeanalysis',
  '系统管理', 'icon-system',
  // 学生端
  '课前预习', 'icon-xiangmu',
  '课后作业', 'icon-xiangmu',
  '实验室预约', 'icon-manage2',
];

export const loginTitle1 = process.env.VUE_APP_LOGIN_TITLE1;
export const loginTitle2 = process.env.VUE_APP_LOGIN_TITLE2;
export const loginLogo = process.env.VUE_APP_LOGIN_LG;
export const scheme = process.env.VUE_APP_LOGIN_SCHEMA;

// 定制的接口
export const urlMap = {
  // user
  loginCommon: {url: '/rest/user/loginByUsername'},
  user_info: {url: '/rest/user/info'},
  user_update_info: {url: '/rest/user/updateUserInfo'},
  logout: {url: '/rest/user/logout'},
  pwd_update: {url: '/rest/user/updatePwd'},
  role_create: {url: '/rest/admin/user/role/create'},
  role_del: {url: '/rest/admin/user/role/del'},
  role_update: {url: '/rest/admin/user/role/update'},
  role_list: {url: '/rest/mes/user/listRoles'},
  role_list_system: {url: '/rest/user/listRoles'},
  list_privileges: {url: '/rest/admin/user/role/listAllPrivileges'},
  user_add: {url: '/rest/admin/user/addUser'},
  user_delete: {url: '/rest/mes/user/del'},
  user_off: {url: '/rest/admin/user/offUser'},
  user_update: {url: '/rest/admin/user/updateUser'},
  user_list: {url: '/rest/admin/user/listUsers'},
  department_list: {url: '/rest/user/listDepartment'},
  department_create: {url: '/rest/admin/user/role/department/create'},
  department_update: {url: '/rest/admin/user/role/department/update'},
  department_del: {url: '/rest/admin/user/role/department/del'},
  //
  monitor_alarms: {url: '/rest/monitor/device/alarms'},
  // device type
  device_type_img_upload: {url: '/rest/device/type/mng/upload/image'},
  device_type_list: {url: '/rest/device/type/mng/listType'},
  device_type_update: {url: '/rest/device/type/mng/updateType'},
  // device
  device_create: {url: '/rest/device/save'},
  device_list: {url: '/rest/device/filter'},
  device_update: {url: '/rest/device/update'},
  device_del: {url: '/rest/device/del'},
  // monitor
  // analysis
  // params
  params_query_by_key: {url: '/rest/analysis/device/params/queryByKey'},
  params_query_by_keys: {url: '/rest/analysis/device/params/queryByKeys'},
  params_export_all: {url: '/rest/analysis/device/params/exportAll'},
  params_export_by_key: {url: '/rest/analysis/device/params/exportByKeys'},
  params_menu: {url: '/rest/analysis/device/params/menu'},
  params_export_by_time: {url: '/rest/analysis/device/params/exportAllByTime'},
  // alarm
  alarm_record_confirm: {url: '/rest/alarm/record/confirm'},
  alarm_history: {url: '/rest/analysis/device/alarm/history'},
  analysis_alarm_summary: {url: '/rest/analysis/device/alarm/summary'},
  alarm_rule_sd_list: { url: '/rest/alarm/sdrule/list' },
  alarm_rule_sd_update: { url: '/rest/alarm/sdrule/update' },
  alarm_rule_sd_del: { url: '/rest/alarm/sdrule/del' },
  alarm_rule_sd_available: { url: '/rest/alarm/sdrule/available' },
  // course
  course_list: { url: '/rest/course/list' },
  course_list4student: { url: '/rest/course/list4student' },
  course_add: { url: '/rest/course/add' },
  course_update: { url: '/rest/course/update' },
  course_del: { url: '/rest/course/del' },
  // program
  program_list: { url: '/rest/program/list' },
  program_add: { url: '/rest/program/add' },
  program_update: { url: '/rest/program/update' },
  program_del: { url: '/rest/program/del' },
  program_upload: { url: '/rest/program/upload' },
  program_upload_del: { url: '/rest/program/upload/del' },
};
