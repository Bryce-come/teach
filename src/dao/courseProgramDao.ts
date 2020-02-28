import {postService, uploadService} from 'web-toolkit/src/case-main/index';
import {urlMap} from '@/config';

// params： containPrograms:boolean
export async function CourseList(params: any) {
  const {data: {list}} = await postService(urlMap.course_list.url, params);
  return list;
}

// 学生自己的课程
export async function CourseList4Student() {
  const {data: {list}} = await postService(urlMap.course_list4student.url);
  return list;
}

// params: *code, *name, *teacherId, extendJson, programJson
export async function CourseAdd(params: any) {
  await postService(urlMap.course_add.url, params);
}

// params: *id, code, name, teacherId, extendJson, programJson
export async function CourseUpdate(params: any) {
  await postService(urlMap.course_update.url, params);
}

// params: *id
export async function CourseDel(params: any) {
  await postService(urlMap.course_del.url, params);
}

// params: *courseId *programId
export async function UnbindProgram(params: any) {
  await postService('/rest/course/unbindProgram', params);
}

// 按label区分开,返回map
export async function ProgramList() {
  const {data: {list}} = await postService(urlMap.program_list.url);
  return list;
}

// params: *code, *name, purpose, principle, steps, results, label, stationJson, extendJson
export async function ProgramAdd(params: any) {
  await postService(urlMap.program_add.url, params);
}

// params: *id, code, name, purpose, principle, steps, results, label, stationJson, extendJson
export async function ProgramUpdate(params: any) {
  await postService(urlMap.program_update.url, params);
}

// params: *id
export async function ProgramDel(params: any) {
  await postService(urlMap.program_del.url, params);
}

// 上传附件-一个个传
// *id, *file
export async function ProgramUpload(params: any) {
  await uploadService(urlMap.program_upload.url, params);
}

// *id, *path
export async function ProgramUploadDel(params: any) {
  await postService(urlMap.program_upload_del.url, params);
}
