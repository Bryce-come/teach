import {postService, uploadService, download} from 'web-toolkit/src/case-main/index';

/**
 * 刀具增加
 * RequestParam String name,
 * RequestParam String no,
 * ApiParam(value = "类型, 1-耗材, 2-量具",required = true)
 * RequestParam int type,
 * ApiParam(value = "适配设备类型数组json")
 * RequestParam(required = false) String dTypeJson,
 * ApiParam(value = "place-货架位置字段, unit单位, model-型号")
 * RequestParam(required = false) String extendJson
 */
export async function ComponentStoreAdd(params: any) {
  await postService('/rest/device/component/store/add', params);
}

/**
 * RequestParam int id,
 * RequestParam(required = false) String name,
 * RequestParam(required = false) String no,
 * ApiParam(value = "类型, 1-耗材, 2-量具")
 * RequestParam(required = false) Integer type,
 * RequestParam(required = false) String dTypeJson,
 * ApiParam(value = "place-货架位置字段, unit单位, model-型号")
 * RequestParam(required = false) String extendJson
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
 * RequestParam(required = false, defaultValue = "false") boolean forSelect,
 * RequestParam(required = false) String typesJson
 */
export async function ComponentStoreList(params: any) {
  const {data: {list}} = await postService('/rest/device/component/store/list', params);
  return list;
}

/**
 * 出入库
 * RequestParam int componentId,
 * ApiParam(value = "1-新购, 2-利旧, 3-还回, 10-借出, 11-领用, 12-报废",required = true)
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
 * ApiParam(value = "1-新购, 2-利旧, 3-还回, 10-借出, 11-领用, 12-报废")
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



/**
 * 工具包增加
 * RequestParam String name
 */
export async function ComponentStoreGroupAdd(params: any) {
  await postService('/rest/device/component/store/group/add', params);
}

/**
 * 工具包修改
 * RequestParam int id
 * RequestParam String name
 */
export async function ComponentStoreGroupUpdate(params: any) {
  await postService('/rest/device/component/store/group/update', params);
}

/**
 * RequestParam int id
 */
export async function ComponentStoreGroupDel(params: any) {
  await postService('/rest/device/component/store/group/del', params);
}

/**
 * 工具包list
 * RequestParam(required = false, defaultValue = "false") boolean forSelect
 */
export async function ComponentStoreGroupList(params: any) {
  const {data: {list}} = await postService('/rest/device/component/store/group/list', params);
  return list;
}

/**
 * 工具包item增加
 * RequestParam int grpId, - 工具包id
 * RequestParam int componentId,
 * RequestParam int quantity
 */
export async function ComponentStoreGroupItemAdd(params: any) {
  await postService('/rest/device/component/store/group/item/add', params);
}

/**
 * 工具包item修改
 * RequestParam int id,
 * RequestParam(required = false) Integer componentId,
 * RequestParam(required = false) Integer quantity
 */
export async function ComponentStoreGroupItemUpdate(params: any) {
  await postService('/rest/device/component/store/group/item/update', params);
}

/**
 * RequestParam int id // item的id
 */
export async function ComponentStoreGroupItemDel(params: any) {
  await postService('/rest/device/component/store/group/item/del', params);
}

/**
 * 工具包itemlist
 * RequestParam int grpId -工具包id
 */
export async function ComponentStoreGroupItemList(params: any) {
  const {data: {list}} = await postService('/rest/device/component/store/group/item/list', params);
  return list;
}


/**
 * 导入添加
 * RequestParam MultipartFile file
 */
export async function ComponentStoreAddImport(params: any) {
  await uploadService('/rest/device/component/store/add/import', params);
}

/**
 * 导出Excel
 * RequestParam(required = false)String typesJson
 */
export async function ComponentStoreExport(params: any) {
  await download('/rest/device/component/store/export', params, {filename: '物料信息.xlsx'});
}

/**
 * 下载导入模板
 */
export async function ComponentStoreImportSample() {
  await download('/rest/device/component/store/import/sample', {}, {filename: '物料信息导入模板.xlsx'});
}
