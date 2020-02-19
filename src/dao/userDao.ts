import {postService} from 'web-toolkit/src/case-main/index';
import {urlMap} from '@/config';

export const Login = async (param: any) => {
  const { data } = await postService(urlMap.loginCommon.url, param);
  return data;
};

export const LoginOut = async () => {
  await postService(urlMap.logout.url);
};

export const UserUpdatePwd = async (params: any) => {
  await postService(urlMap.pwd_update.url, params);
};

export const UserUpdateInfo = async (params: any) => {
  await postService(urlMap.user_update_info.url, params);
};

/**
 * 班级列表-含分组
 */
export async function ClassList() {
  const {data: {list}} = await postService('/rest/class/list');
  return list;
}

/**
 * 班级列表-用于select备选
 */
export async function ClassList4Select() {
  const {data: {list}} = await postService('/rest/class/list4Select');
  return list;
}

/**
 * 增加/修改班级
 * @RequestParam String name,
 @RequestParam(required = false) Integer id
 */
export async function ClassUpdate(params: any) {
  await postService('/rest/class/update', params);
}

/**
 * 删除班级
 * @RequestParam int id
 */
export async function ClassDel(params: any) {
  await postService('/rest/class/del', params);
}

/**
 * 冻结班级
 * @RequestParam int id
 */
export async function ClassFreeze(params: any) {
  await postService('/rest/class/freeze', params);
}

/**
 * 分组更新/增加
 * @RequestParam String name,
 @RequestParam int cid,
 @RequestParam(required = false) Integer id
 */
export async function ClassGroupUpdate(params: any) {
  await postService('/rest/class/group/update', params);
}

/**
 * 分组删除
 * @RequestParam int id
 */
export async function ClassGroupDel(params: any) {
  await postService('/rest/class/group/del', params);
}

/**
 * 学生列表
 * @RequestParam(required = false) Integer classId,
 @RequestParam(required = false) Integer groupId,
 @ApiParam(value = "用于select待选列表")
 @RequestParam(required = false, defaultValue = "false") boolean forSelect
 */
export async function StudentList() {
  const {data: {list}} = await postService('/rest/student/list');
  return list;
}
