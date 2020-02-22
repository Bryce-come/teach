import {postService} from 'web-toolkit/src/case-main/index';

/**
 * 课表列表
 * RequestParam long start,
 * RequestParam long end
 */
export async function CourseRecordList(params: any) {
  const {data: {list}} = await postService('/rest/course/record/list', params);
  return list;
}

/**
 * 单次课详情
 * RequestParam int id
 */
export async function CourseRecordDetail(params: any) {
  const {data: {record}} = await postService('/rest/course/record/detail', params);
  return record;
}

/**
 * 增加课程记录
 * * ApiParam(value = "正常课程-0，个人预约-2，授课预约-1",required = true)
 * RequestParam int type,
 * RequestParam(required = false) Integer courseId,
 * RequestParam(required = false) Integer programId,
 * RequestParam(required = false) Integer teacherId,
 * RequestParam(required = false) String studentJson,
 * * ApiParam(value = "个人预约时必填")
 * RequestParam(required = false) String stationJson,
 * RequestParam long start,
 * RequestParam long end,
 * * ApiParam(value = "lessons:[], clasz-班级, claszGroup-分组，stationBind:{<stationId>:[uid]}")
 * RequestParam String extendJson,
 * * ApiParam(value = "重复选项：重复后续几周")
 * RequestParam(required = false) Integer optionRepeatWeeks
 */
export async function CourseRecordAdd(params: any) {
  await postService('/rest/course/record/add', params);
}

/**
 * 附加增加
 * RequestParam int id,
 * RequestParam MultipartFile file
 */
export async function CourseRecordAttachAdd(params: any) {
  await postService('/rest/course/record/attach/add', params);
}

/**
 * 附加删除
 * RequestParam int id,
 * RequestParam String path
 */
export async function CourseRecordAttachDel(params: any) {
  await postService('/rest/course/record/attach/del', params);
}

/**
 * 修改课程记录
 * RequestParam int id,
 * ApiParam(value = "正常课程-0，个人预约-2，授课预约-1",required = true)
 * RequestParam(required = false) Integer type,
 * RequestParam(required = false) Integer courseId,
 * RequestParam(required = false) Integer programId,
 * RequestParam(required = false) Integer teacherId,
 * RequestParam(required = false) String studentJson,
 * ApiParam(value = "个人预约时必填")
 * RequestParam(required = false) String stationJson,
 * RequestParam(required = false) Long start,
 * RequestParam(required = false) Long end,
 * ApiParam(value = "lessons:[], clasz-班级, claszGroup-分组，stationBind:{<stationId>:[uid]}")
 * RequestParam(required = false) String extendJson
 */
export async function CourseRecordUpdate(params: any) {
  await postService('/rest/course/record/update', params);
}

/**
 * RequestParam int id
 */
export async function CourseRecordDel(params: any) {
  await postService('/rest/course/record/del', params);
}

/**
 * 当前上课的记录
 *
 */
export async function CourseRecordInClass() {
  const {data: {record}} = await postService('/rest/course/record/findInClass');
  return record;
}

/**
 * 预习列表，最近课时记录
 * RequestParam int courseId
 */
export async function CourseRecordPreview(params: any) {
  const {data: {record}} = await postService('/rest/course/record/findPreview', params);
  return record;
}
