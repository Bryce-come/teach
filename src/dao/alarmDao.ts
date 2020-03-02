import {postService} from 'web-toolkit/src/case-main/index';
import {urlMap} from '@/config';

export const AlarmRecordConfirm = async (params: any) => {
  await postService(urlMap.alarm_record_confirm.url, params);
};

export const MonitorAlarm = async () => {
  return await postService(urlMap.monitor_alarms.url, {}, {throwable: false, showMsg: false});
};

/**
 * 设备报警记录
 *    todo
 *    界面需要有设备类型筛选（多选）、设备筛选（多选）、时间范围（默认就设置为最近7天）
 *    操作中有个设备参数快照，先从roms抄过来，都是有用的。table的内容格式也都抄。
 * 返回：List<DeviceAlarmRecord>
 * // 设备类型的id数组
 * RequestParam(required = false) String deviceTypeJson,
 * // 设备的id数组
 * RequestParam(required = false) String devicesJson,
 * RequestParam long start,
 * RequestParam long end
 */
export async function AlarmDeviceHistory(params:any) {
  const {data:{list}} = await postService('/rest/analysis/device/alarm/history',params);
  return list;
}

/**
 *
 * 保养超期记录
 * todo
 *    界面上不需要输入天数，
 *    操作里只有一个查看，跳转到维保首页
 * List<DeviceMaintenRecord>
 */
export async function AlarmMaintenDelay() {
  const {data:{list}} = await postService('/rest/device/mainten/alarm');
  return list;
}

/**
 * 实验室使用报警
 *  todo 有类型筛选（多选）、操作台筛选（多选）、时间范围（默认定为7天）
 * ApiParam(value = "illegal_time非法时间内开启, illegal_user未授权的使用者 , [] json")
 * RequestParam(required = false) String typeJson,
 * ApiParam(value = "station id [] json")
 * RequestParam(required = false) String stationJson,
 * RequestParam long start,
 * RequestParam long end
 */
export async function AlarmUsageList(params:any) {
  const {data:{list}} = await postService('/rest/alarm/usage/list',params);
  return list;
}

// todo 后续用于实时报警信息
export async function AlarmUsageLatest() {
  const {data:{list}} = await postService('/rest/alarm/usage/latest');
  return list;
}
