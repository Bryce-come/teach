import {postService, uploadService} from 'web-toolkit/src/case-main/index';

// 教学过程模块

/**
 * cnc网关连接状态
 * extend.linkStatus, null/true/false
 */
export async function CNCLinkStatus() {
  const {data: {list}} = await postService('/rest/inClass/link/status');
  return list;
}

/**
 * cnc网关连接状态设置
 * RequestParam String stationJson,
 * RequestParam boolean status
 */
export async function CNCLinkSet(params: any) {
  await postService('/rest/inClass/link/set', params);
}

/**
 * 下课
 */
export async function ClassOver() {
  await postService('/rest/inClass/classOver');
}

/**
 * 延长课时
 * RequestParam int id,
 * RequestParam int minutes
 */
export async function ClassLengthen(params: any) {
  await postService('/rest/inClass/lengthen', params);
}

/**
 * nc程序提交列表
 * RequestParam int recordId,
 * RequestParam(required = false) Integer studentId,
 * RequestParam(required = false) Integer limit,
 * ApiParam(value = "当从报告中获取nc列表时，通过course/program/student")
 * RequestParam(required = false) Integer courseId,
 * RequestParam(required = false) Integer programId
 */
export async function NCExamList(params: any) {
  const {data: {list}} = await postService('/rest/inClass/ncExam/list', params);
  return list;
}

/**
 * nc程序提交列表
 * RequestParam int id,
 */
export async function NCExamDetail(params: any) {
  const {data: {record}} = await postService('/rest/inClass/ncExam/detail', params);
  return record;
}

/**
 * nc程序审核
 * RequestParam int id,
 * ApiParam(required = true, value = "通过并同意加工-2、退回修改-0")
 * RequestParam int result,
 * RequestParam(required = false) String remark,
 */
export async function NCExamOperate(params: any) {
  await postService('/rest/inClass/ncExam/operate', params);
}

/**
 * 临时文件-上传
 * RequestParam MultipartFile file
 */
export async function TempFileAdd(params: any) {
  await uploadService('/rest/inClass/tempFile/add', params);
}
/**
 * RequestParam String path
 */
export async function TempFileDel(params: any) {
  await postService('/rest/inClass/tempFile/del', params);
}

/**
 * 临时文件-列表
 */
export async function TempFileList() {
  const {data: {list}} = await postService('/rest/inClass/tempFile/list');
  return list;
}
