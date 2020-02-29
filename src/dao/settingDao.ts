import {postService} from 'web-toolkit/src/case-main/index';

/**
 * 获取所有设置
 * RequestParam(required = false, defaultValue = "false")boolean onlyLesson,
 * RequestParam(required = false, defaultValue = "false")boolean onlyLinkOn
 * RequestParam(required = false, defaultValue = "false")boolean onlyNVR
 */
export async function SettingGet(params: any) {
  const {data} = await postService('/rest/setting/get', params);
  return data;
}

/**
 * RequestParam String json
 */
export async function SettingSet(params: any) {
  await postService('/rest/setting/set', {
    json: JSON.stringify(params),
  });
}

/**
 * 判断当前时间是否在本学期
 * 返回 result:boolean
 */
export async function CheckInTerm() {
  const {data: {result}} = await postService('/rest/setting/checkInTerm');
  return result;
}
