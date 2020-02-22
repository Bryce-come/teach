import {postService} from 'web-toolkit/src/case-main/index';
import {urlMap} from '@/config';

export const DeviceTypeList = async () => {
  const { data: {list} } = await postService(urlMap.device_type_list.url);
  return list;
};

// params: types, start, end
export const DeviceList = async (params: any) => {
  const {data: {list}} = await postService(urlMap.device_list.url, params);
  return list;
};

// params: *id, *name, *type, extendJson
export const DeviceAdd = async (params: any) => {
  await postService(urlMap.device_create.url, params);
};

// params: *deviceId, name, type, extendJson
export async function DeviceUpdate(params: any) {
  await postService(urlMap.device_update.url, params);
}

// params: *deviceId
export async function DeviceDel(params: any) {
  await postService(urlMap.device_del.url, params);
}

/**
 * 设备维保记录添加
 * RequestParam String deviceId,
 ApiParam(required = true,value = "0-巡检, 1-保养，2-维修")
 RequestParam int type,
 RequestParam String executor,
 ApiParam(value = "维护状态：正常、维护中、故障、告警、报废")
 RequestParam(required = false) String status,
 RequestParam(required = false) String treatment,
 RequestParam long restorationDt,
 RequestParam(required = false) Long nextDt,
 ApiParam(value = "executorPhone:联系方式")
 RequestParam(required = false) String extendJson
 */
export async function DeviceMaintenAdd(params: any) {
  await postService('/rest/device/mainten/add', params);
}

/**
 * RequestParam long id
 */
export async function DeviceMaintenDel(params: any) {
  await postService('/rest/device/mainten/del', params);
}

/**
 * 每台设备的最新记录
 */
export async function DeviceMaintenLatest() {
  const {data: {list}} = await postService('/rest/device/mainten/latest');
  return list;
}

/**
 * 设备维保历史
 * RequestParam(required = false) String devicesJson,
 RequestParam(required = false) String typesJson,
 RequestParam(required = false) String executorsJson,
 RequestParam(required = false) Long start,
 RequestParam(required = false) Long end
 */
export async function DeviceMaintenList() {
  const {data: {list}} = await postService('/rest/device/mainten/list');
  return list;
}

/**
 执行人备选列表
 */
export async function DeviceMaintenListExecutor() {
  const {data: {list}} = await postService('/rest/device/mainten/listExecutor');
  return list;
}
