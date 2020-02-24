import {postService} from 'web-toolkit/src/case-main/index';

/**
 * 刀具增加
 * RequestParam String name,
 * RequestParam String no,
 * ApiParam(value = "适配设备类型数组json")
 * RequestParam(required = false) String dTypeJson
 */
export async function ComponentStoreAdd(params: any) {
  await postService('/rest/device/component/store/add', params);
}

/**
 * RequestParam int id,
 * RequestParam(required = false) String name,
 * RequestParam(required = false) String no,
 * RequestParam(required = false) String dTypeJson
 */
export async function ComponentStoreUpdate(params: any) {
  await postService('/rest/device/component/store/update', params);
}

/**
 * RequestParam int id
 */
export async function ComponentStoreDel(params: any) {
  await postService('/rest/device/component/store/del', params);
}

/**
 * 刀具列表
 */
export async function ComponentStoreList() {
  const {data: {list}} = await postService('/rest/device/component/store/list');
  return list;
}

/**
 * 出入库
 * RequestParam int componentId,
 * ApiParam(value = "0-新购，1-借出，2-还回，3-报废",required = true)
 * RequestParam int type,
 * RequestParam int quantity,
 * RequestParam long dt,
 * RequestParam(required = false) String remark,
 * ApiParam(value = "person-经手人/申请人； 操作台借的记录stationRecord:{id, quantity}；新购：批次batchNo、厂商company、供货商supplier、供货商联系方式supplierTel、购入时间buyDt、保管人keeper")
 * RequestParam(required = false) String extendJson
 */
export async function ComponentStoreRecordAdd(params: any) {
  await postService('/rest/device/component/store/record/add', params);
}

/**
 * RequestParam int id,
 * ApiParam(value = "0-新购，1-借出，2-还回，3-报废")
 * RequestParam(required = false) Integer type,
 * RequestParam(required = false) Integer quantity,
 * RequestParam(required = false) Long dt,
 * RequestParam(required = false) String remark,
 * RequestParam(required = false) String extendJson
 */
export async function ComponentStoreRecordUpdate(params: any) {
  await postService('/rest/device/component/store/record/update', params);
}

/**
 * RequestParam int id
 */
export async function ComponentStoreRecordDel(params: any) {
  await postService('/rest/device/component/store/record/del', params);
}

/**
 * 出入库历史记录
 * RequestParam int componentId,
 * RequestParam(required = false) String typeJson,
 * RequestParam(required = false) Long start,
 * RequestParam(required = false) Long end
 */
export async function ComponentStoreRecordList(params: any) {
  const {data: {list}} = await postService('/rest/device/component/store/record/list', params);
  return list;
}
