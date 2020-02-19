import {postService} from 'web-toolkit/src/case-main/index';

/**
 * @ApiParam(value = "学生端传course即可")
   @RequestParam(required = false) Integer courseId,
   @RequestParam(required = false) Integer programId,
   @RequestParam(required = false) String studentJson,
   @ApiParam(value = "可根据班级分组筛选")
   @RequestParam(required = false) Integer claszId,
   @RequestParam(required = false) Integer groupId,
   @ApiParam(value = "可用于查询历史数据，默认是当前学期")
   @RequestParam(required = false) Long start,
   @RequestParam(required = false) Long end
 */
export const ReportList = async (params: any) => {
  const {data: {list}} = await postService('/rest/program/report/list', params);
  return list;
};

/**
 *  @RequestParam int courseId,
    @RequestParam int programId,
    @RequestParam MultipartFile file
 */
export async function ReportSubmit(params: any) {
  await postService('/rest/program/report/submit', params);
}

/**
 * 评分
 * @RequestParam int id,
   @RequestParam Double score1,
   @RequestParam Double score2,
   @RequestParam(required = false) String comment
 */
export async function ReportScore(params: any) {
  await postService('/rest/program/report/score', params);
}

/**
 * 获取报告-学生用
 * @RequestParam int courseId,
   @RequestParam int programId
 */
export async function ReportDetail4Student(params: any) {
  const {data: {report}} = await postService('/rest/program/report/detail4student', params);
  return report;
}

/**
 * 学生- 上课笔记
 * @RequestParam int reportId,
   @RequestParam String note
 */
export async function ReportNote(params: any) {
  await postService('/rest/program/report/note', params);
}

/**
 * 模板-列表
 * @RequestParam MultipartFile file
 */
export async function ReportTemplateList(params: any) {
  const {data: {list}} = await postService('/rest/program/report/template/list', params);
  return list;
}

/**
 * 模板-新增
 * @RequestParam MultipartFile file
 */
export async function ReportTemplateAdd(params: any) {
  await postService('/rest/program/report/template/add', params);
}

/**
 * @RequestParam int id
 */
export async function ReportTemplateDel(params: any) {
  await postService('/rest/program/report/template/del', params);
}
