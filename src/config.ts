
// 主菜单
export const mainMenuTitles = [
  // 如果没有子导航，直接在这指定CName一样的值
  '菜单一', 'icon-monitor',
  '实验室管理', 'icon-xiangmu',
  '实验课程管理', 'icon-manage2',
  '人员管理', 'icon-manage2',
  // '系统设置', 'icon-system',
  // '报警提醒', 'icon-xiangmu',
  // '运行分析', 'icon-oeeanalysis',
  // '工单管理', 'icon-manage2',
  // '远程记录', 'icon-manage2',
  '系统管理', 'icon-system',
];

export const loginTitle1 = process.env.VUE_APP_LOGIN_TITLE1;
export const loginTitle2 = process.env.VUE_APP_LOGIN_TITLE2;
export const loginLogo = process.env.VUE_APP_LOGIN_LG;
export const scheme = process.env.VUE_APP_LOGIN_SCHEMA;

// 定制的接口
export const urlMap = {
  // user
  loginCommon: {url: '/rest/user/login'},
  user_info: {url: '/rest/user/info'},
  // 登录码登录-station
  loginByCode: {url: '/rest/mes/user/loginByCode'},
  logout: {url: '/rest/user/logout'},
  update_user_code: {url: '/rest/mes/user/updateCode'},
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
  user_no_admin_list: {url: '/rest/mes/user/listNoAdmin'},
  department_list: {url: '/rest/user/listDepartment'},
  department_create: {url: '/rest/admin/user/role/department/create'},
  department_update: {url: '/rest/admin/user/role/department/update'},
  department_del: {url: '/rest/admin/user/role/department/del'},
  depart_relation_list: { url: '/rest/departRelation/list' },
  depart_relation_update: { url: '/rest/departRelation/update' },
  depart_relation_list4Select: { url: '/rest/departRelation/list4Select' },
  // 行政区列表
  province_city_list: { url: '/rest/common/administrative/listAllProvinceCity' },
  area_list: { url: '/rest/common/administrative/listAreaByCity' },
  //
  monitor_alarms: {url: '/rest/monitor/device/alarms'},
  product_setting_emp_attendance_get: {url: '/rest/product/setting/empAttendance/get'},
  product_setting_emp_attendance_set: {url: '/rest/product/setting/empAttendance/set'},
  product_setting_query: {url: '/rest/product/setting/query'},
  product_setting_update: {url: '/rest/product/setting/times'},
  shift_setting_update: {url: '/rest/product/setting/updateShift'},
  shift_setting_get: {url: '/rest/product/setting/getShifts'},
  shift_setting_get_by_line: {url: '/rest/product/setting/getShiftsByLine'},
  // device type
  device_type_add_second: { url: '/rest/device/type/mng/addSecond' },
  device_type_delete_second: { url: '/rest/device/type/mng/delSecond' },
  device_type_roms_list: { url: '/rest/device/type/mng/list' },
  // device
  device_create: {url: '/rest/device/save'},
  device_list_by_product: { url: '/rest/device/listByProduct' },
  device_list: {url: '/rest/device/list', params: {needStatus: false}},
  device_export_qr: {url: '/rest/device/exportQr'},
  device_update: {url: '/rest/device/update'},
  device_del: {url: '/rest/device/del'},
  device_type_list: {url: '/rest/device/listType'},
  // monitor
  monitor_device_latest: {url: '/rest/monitor/device/latestStatusOne'},
  monitor_device_list: {url: '/rest/monitor/device/list', params: {needPartNum: false}},
  monitor_line_latest: {url: '/rest/monitor/line/latestOne'},
  monitor_line_latest_list: {url: '/rest/monitor/line/latestList'},
  monitor_quality_list: {url: '/rest/monitor/line/qualityList'},
  monitor_plan_list: {url: '/rest/monitor/plan/list'},
  monitor_graph_info: {url: '/rest/monitor/graph/info'},
  monitor_graph_update: {url: '/rest/monitor/graph/update'},
  monitor_graph_list_models: {url: '/rest/monitor/graph/listModels'},
  // analysis
  analysis_line_time: {url: '/rest/analysis/line/time'},
  analysis_line_oee: {url: '/rest/analysis/line/oee'},
  analysis_line_oee_daily: {url: '/rest/analysis/line/oee/daily'},
  analysis_line_clock: {url: '/rest/analysis/line/clock'},
  analysis_line_clocks: {url: '/rest/analysis/line/clocks'},
  analysis_line_clock_daily: {url: '/rest/analysis/line/clock/daily'},
  analysis_line_quantity: {url: '/rest/analysis/product/part/line'},
  analysis_line_output: {url: '/rest/analysis/line/output'},
  analysis_line_output_export: {url: '/rest/analysis/line/output/export'},
  analysis_line_quantity_daily: {url: '/rest/analysis/product/part/line/daily'},
  analysis_line_quality: {url: '/rest/analysis/line/quality'},
  analysis_line_qualities: {url: '/rest/analysis/line/qualities'},
  analysis_line_qualities_export: {url: '/rest/analysis/line/qualities/export'},
  analysis_device_quantity: {url: '/rest/analysis/product/part'},
  analysis_device_quantity_daily: {url: '/rest/analysis/product/part/daily'},
  analysis_device_quality_daily: {url: '/rest/analysis/product/quality/daily'},
  analysis_device_oee: {url: '/rest/analysis/device/oee'},
  analysis_device_oees: {url: '/rest/analysis/device/oees'},
  analysis_device_oee_daily: {url: '/rest/analysis/device/oeeDaily'},
  analysis_device_times: {url: '/rest/analysis/device/times'},
  analysis_device_time: {url: '/rest/analysis/device/time'},
  analysis_device_time_export: {url: '/rest/analysis/device/time/export'},
  analysis_device_time_summary_daily: {url: '/rest/analysis/device/timeSummary/daily'},
  analysis_device_clock: {url: '/rest/analysis/device/clock'},
  analysis_device_clocks: {url: '/rest/analysis/device/clocks'},
  analysis_device_export_clock: {url: '/rest/analysis/device/exportClockRecords'},
  analysis_device_clock_daily: {url: '/rest/analysis/device/clock/daily'},
  analysis_emp_efficiency_line: {url: '/rest/analysis/emp/efficiency/line'},
  analysis_emp_efficiency_line_export: {url: '/rest/analysis/emp/efficiency/line/export'},
  analysis_production_trace: { url: '/rest/analysis/production/trace' },
  analysis_production_trace_snapshot: { url: '/rest/analysis/production/trace/snapshot' },
  // 检测设备的质检数据
  analysis_device_quality_detect: {url: '/rest/analysis/device/quality/detect'},
  analysis_device_quality: {url: '/rest/analysis/product/quality'},
  analysis_quality_record_list: {url: '/rest/analysis/quality/record/list'},
  // params
  params_query_by_key: {url: '/rest/analysis/device/params/queryByKey'},
  params_query_by_keys: {url: '/rest/analysis/device/params/queryByKeys'},
  params_export_all: {url: '/rest/analysis/device/params/exportAll'},
  params_export_by_key: {url: '/rest/analysis/device/params/exportByKeys'},
  params_menu: {url: '/rest/analysis/device/params/menu'},
  params_export_by_time: {url: '/rest/analysis/device/params/exportAllByTime'},
  // alarm
  alarm_history: {url: '/rest/analysis/device/alarm/history'},
  analysis_alarm_summary: {url: '/rest/analysis/device/alarm/summary'},
  // setting
  setting_clock_set: {url: '/rest/analysis/setting/device/clock/setJson'},
  setting_clock_get: {url: '/rest/analysis/setting/device/clock/get'},
  setting_clock_set_work: {url: '/rest/analysis/setting/device/clock/setWorkJson'},
  setting_dashboard_fetch: {url: '/rest/setting/dashboard/fetch'},
  setting_dashboard_list: {url: '/rest/setting/dashboard/list'},
  setting_dashboard_set_default: {url: '/rest/setting/dashboard/setDefault'},
  // line
  line_create: {url: '/rest/line/add'},
  line_update: {url: '/rest/line/update'},
  line_list: {url: '/rest/line/list'},
  line_delete: {url: '/rest/line/del'},
  line_device_add: {url: '/rest/line/device/add'},
  line_device_del: {url: '/rest/line/device/del'},
  line_device_list: {url: '/rest/line/device/list'},
  line_relation_list_select: {url: '/rest/line/relation/list4Select'},
  line_relation_product_list: {url: '/rest/line/relation/getProductList'},
  line_relation_list: {url: '/rest/line/relation/get'},
  line_relation_update: {url: '/rest/line/relation/update'},
  // line_product
  line_product_list: {url: '/rest/lineProductRecord/list'},
  line_product_select_list: {url: '/rest/line/relation/getProductList'},
  line_product_create: {url: '/rest/lineProductRecord/save'},
  line_product_update: {url: '/rest/lineProductRecord/update'},
  // line_work_order
  line_work_order_create: {url: '/rest/lineWorkOrder/save'},
  line_work_order_update: {url: '/rest/lineWorkOrder/update'},
  line_work_order_list: {url: '/rest/lineWorkOrder/list'},
  line_work_order_delete: {url: '/rest/lineWorkOrder/del'},
  // product
  product_create: {url: '/rest/product/save'},
  product_update: {url: '/rest/product/update'},
  product_del: {url: '/rest/product/del'},
  product_list: {url: '/rest/product/list'},
  product_list_with_depart_relation: {url: '/rest/product/listWithDepartRelation'},
  // production_plan
  plan_create: {url: '/rest/plan/save'},
  plan_update: {url: '/rest/plan/update'},
  plan_del: {url: '/rest/plan/del'},
  plan_list: {url: '/rest/plan/list'},
  // product part
  part_create: {url: '/rest/product/part/create'},
  part_update: {url: '/rest/product/part/update'},
  part_del: {url: '/rest/product/part/del'},
  // part_export: {url: '/rest/product/part/export'},
  part_list_by_product: {url: '/rest/product/part/listByProduct'},
  // part_opt_record 工序操作
  part_opt_record_submit: {url: '/rest/partOptRecord/submit'},
  part_opt_record_update: {url: '/rest/partOptRecord/update'},
  part_opt_record_close: {url: '/rest/partOptRecord/close'},
  part_opt_record_cancel: {url: '/rest/partOptRecord/cancel'},
  part_opt_record_list_mine: {url: '/rest/partOptRecord/listMine'},
  part_opt_record_list: {url: '/rest/partOptRecord/list'},
  // manual 手动录入部分
  input_manual_update: {url: '/rest/product/inputManual/update'},
  input_manual_del: {url: '/rest/product/inputManual/del'},
  input_manual_list: {url: '/rest/product/inputManual/list'},
  input_manual_store_update: {url: '/rest/product/inputManual/store/update'},
  input_manual_store_del: {url: '/rest/product/inputManual/store/del'},
  input_manual_store_list: {url: '/rest/product/inputManual/store/list'},
  input_manual_store_latestVal: {url: '/rest/product/inputManual/store/latestVal'},
  // alarm rule
  alarm_rule_list: {url: '/rest/alarm/rule/list'},
  alarm_rule_update: {url: '/rest/alarm/rule/update'},
  alarm_rule_off: {url: '/rest/alarm/rule/off'},
  alarm_rule_user_list: {url: '/rest/alarm/rule/user/list'},
  alarm_rule_user_update: {url: '/rest/alarm/rule/user/update'},
  alarm_rule_user_del: {url: '/rest/alarm/rule/user/del'},
  alarm_record_confirm: {url: '/rest/alarm/record/confirm'},
  // line
  analysis_setting_line_pe_set: {url: '/rest/analysis/setting/line/peBaseTime/set'},
  analysis_setting_line_pe_get: {url: '/rest/analysis/setting/line/peBaseTime/get'},
  // employee
  emp_list: {url: '/rest/employee/list'},
  emp_add: {url: '/rest/employee/save'},
  emp_update: {url: '/rest/employee/update'},
  emp_del: {url: '/rest/employee/del'},
  emp_export: {url: '/rest/employee/export'},
  emp_import_add: {url: '/rest/employee/import/add'},
  emp_export_add_template: {url: '/rest/employee/export/addTemplate'},
  emp_list_role: {url: '/rest/employee/listEmpRoles'},
  emp_attend: {url: '/rest/employee/attendance/attend'},
  emp_attendance_list: {url: '/rest/employee/attendance/list'},
  // maintenance
  maintenance_add: {url: '/rest/device/maintenance/new'},
  maintenance_update: {url: '/rest/device/maintenance/update'},
  maintenance_del: {url: '/rest/device/maintenance/del'},
  maintenance_list: {url: '/rest/device/maintenance/list'},
  // quality waste reason
  quality_waste_reason_add: {url: '/rest/quality/waste/reason/add'},
  quality_waste_reason_update: {url: '/rest/quality/waste/reason/update'},
  quality_waste_reason_list: {url: '/rest/quality/waste/reason/list'},
  quality_waste_reason_list_select: {url: '/rest/quality/waste/reason/list4Select'},
  quality_waste_reason_list_by: {url: '/rest/quality/waste/reason/listBy'},
  quality_waste_reason_del: {url: '/rest/quality/waste/reason/del'},
  quality_waste_reason_group_add: {url: '/rest/quality/waste/reason/group/add'},
  quality_waste_reason_group_update: {url: '/rest/quality/waste/reason/group/update'},
  quality_waste_reason_group_update_relation: {url: '/rest/quality/waste/reason/group/updateRelation'},
  quality_waste_reason_group_list: {url: '/rest/quality/waste/reason/group/list'},
  quality_waste_reason_group_del: {url: '/rest/quality/waste/reason/group/del'},
  // quality manual
  quality_manual_add: { url: '/rest/quality/manual/save'},
  quality_manual_update: { url: '/rest/quality/manual/update'},
  quality_manual_del: { url: '/rest/quality/manual/del'},
  quality_manual_list: { url: '/rest/quality/manual/list'},
  quality_manual_confirm: { url: '/rest/quality/manual/record/confirm'},
  quality_manual_record_list: { url: '/rest/quality/manual/record/list'},
  // adapter
  collector_list: {url: '/rest/collector/list'},
  collector_upgrade_list: {url: '/rest/collector/upgrade/list'},
  collector_bind: {url: '/rest/device/adapter/bind'},
  collector_unbind: {url: '/rest/device/adapter/unbind'},
  // call
  call_record_list: {url: '/rest/call/record/list'},
  call_record_save: {url: '/rest/call/record/save'},
  call_record_update: {url: '/rest/call/record/update'},
  call_type_list: {url: '/rest/call/type/list'},
  call_user_list: {url: '/rest/call/user/list'},
  call_user_list_with_depart_relation: {url: '/rest/call/user/listWithDepartRelation'},
  call_user_list4Select: {url: '/rest/call/user/list4Select'},
  call_user_add: {url: '/rest/call/user/add'},
  call_user_del: {url: '/rest/call/user/del'},
  // ali-oss
  ali_oss_sts_token: {url: '/rest/oss/sts'},
  alarm_rule_sd_list: { url: '/rest/alarm/sdrule/list' },
  alarm_rule_sd_update: { url: '/rest/alarm/sdrule/update' },
  alarm_rule_sd_del: { url: '/rest/alarm/sdrule/del' },
  alarm_rule_sd_available: { url: '/rest/alarm/sdrule/available' },
  user_update_info: {url: '/rest/user/updateUserInfo'},
  // type mng
  device_type_mng_list: { url: '/rest/device/type/mng/list' },
  device_type_mng_ptype_add: { url: '/rest/device/type/mng/pType/add' },
  device_type_mng_pname_add: { url: '/rest/device/type/mng/pName/add' },
  device_type_mng_add: { url: '/rest/device/type/mng/add' },
  device_type_mng_ctr_add: { url: '/rest/device/type/mng/ctrType/add' },
  device_type_mng_update: { url: '/rest/device/type/mng/update' },
  device_type_mng_del: { url: '/rest/device/type/mng/del' },
  device_type_mng_upload_image: { url: '/rest/device/type/mng/upload/image' },
};
