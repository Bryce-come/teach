import {postService} from 'web-toolkit/src/case-main/index';

// 操作台模块

/**
 * 操作台列表 （只是单纯列表的话，simple=true）
 * RequestParam(required = false, defaultValue = "true") boolean simple
 */
export async function StationList(params: any) {
  const {data: {list}} = await postService('/rest/expStation/list', params);
  return list;
}

/**
 * 操作台详情
 * RequestParam int id
 */
export async function StationInfo(params: any) {
  const {data: {station}} = await postService('/rest/expStation/info', params);
  return station;
}

/**
 * 操作台增加
 * RequestParam String name,
 * ApiParam(value = "PCs:[{PCIP，PCNo, remark}], remark，cameras:[{ip,name,remark}]")
 * RequestParam(required = false) String extendJson
 */
export async function StationAdd(params: any) {
  await postService('/rest/expStation/add', params);
}

/**
 * RequestParam int id,
 * RequestParam(required = false) String name,
 * RequestParam(required = false) String extendJson
 */
export async function StationUpdate(params: any) {
  await postService('/rest/expStation/update', params);
}

/**
 * RequestParam int id
 */
export async function StationDel(params: any) {
  await postService('/rest/expStation/del', params);
}

/**
 * 增加设备/PC
 * RequestParam int id,
 * RequestParam(required = false) String deviceId
 * RequestParam(required = false) String adapterId,
 * ApiParam(value = "{PCIP，PCNo, remark}")
 * RequestParam(required = false) String pcJson,
 * ApiParam(value = "{ip,name,remark}")
 * RequestParam(required = false) String cameraJson,
 * RequestParam(required = false) String deviceIP
 */
export async function StationAddComponent(params: any) {
  await postService('/rest/expStation/addComponent', params);
}

/**
 * 删除设备/PC
 * RequestParam int id,
 * RequestParam(required = false) String deviceId,
 * RequestParam(required = false) String PCIP,
 * RequestParam(required = false) String cameraIP
 */
export async function StationDelComponent(params: any) {
  await postService('/rest/expStation/delComponent', params);
}
