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
  params.off = 0;
  await postService('/rest/class/del', params);
}

/**
 * 冻结班级
 * @RequestParam int id
 */
export async function ClassFreeze(params: any) {
  params.off = 1;
  await postService('/rest/class/del', params);
}

/**
 * 解冻班级
 * @RequestParam int id
 */
export async function ClassUnFreeze(params: any) {
  params.off = 2;
  await postService('/rest/class/del', params);
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

/**
 * 教师列表
 */
export async function TeacherList() {
  const {data: {list}} = await postService('/rest/admin/user/listUsers', {
    departmentId: 1,
  });
  return list;
}

export async function AdminUserList() {
  const {data: {list}} = await postService('/rest/admin/user/listUsers', {
    departmentId: 0,
  });
  return list;
}

/**
 * 获取角色列表. 如果是学生，root=2; 如果是教师 root=1
 * @RequestParam(required = false) Integer root
 */
export async function RoleList(params: any) {
  const {data: {roles}} = await postService('/rest/user/listRoles', params);
  return roles;
}

/**
 * 添加用户
 *  @RequestParam String username,
    @RequestParam(required = false) String name,
   @RequestParam(required = false) String phone,
   @RequestParam String pwd,
   @RequestParam int role,
   // no-学号/工号
   @RequestParam(required = false) String extendJson
 */
export async function UserAdd(params: any) {
  await postService('/rest/admin/user/addUser', params);
}

/**
 * 用户冻结/删除
 * @RequestParam int id,
 @ApiParam(value = "0-删除，1-冻结，2-解冻")
 @RequestParam int off
 */
export async function UserDel(params: any) {
  await postService('/rest/admin/user/del', params);
}

/**
 * 更新用户信息
 * @RequestParam int id,
 @RequestParam(required = false) String username,
 @RequestParam(required = false) String name,
 @RequestParam(required = false) String phone,
 @RequestParam(required = false,defaultValue = "0")int gender,
 @RequestParam(required = false)String pwd,
 @RequestParam(required = false,defaultValue = "0") int role,
 @RequestParam(required = false)String extendJson
 * @constructor
 */
export async function UserUpdate(params: any) {
  await postService('/rest/admin/user/updateUser', params);
}

export async function DepartmentList() {
  const {data: {departments}} = await postService('/rest/user/listDepartment');
  return departments;
}

export async function PrivilegeList() {
  const {data: {privileges}} = await postService('/rest/admin/user/role/listAllPrivileges');
  return privileges;
}
