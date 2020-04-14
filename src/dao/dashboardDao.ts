import {postService} from 'web-toolkit/src/case-main/index';

/**
 * 实训室使用率日变化
 * 返回 x, y
 *
 * long start,
 * long end
 */
export async function ClassroomUsageDaily(params:any) {
  const {data:{list}} = await postService("/rest/monitor/dashboard/classroomUsageDaily",params);
  return list
}

/**
 * 使用人数统计（时间范围自定义-近一周）
 * 返回 x, y
 *
 * long start,
 * long end
 */
export async function CountUsage(params:any) {
  const {data:{list}} = await postService("/rest/monitor/dashboard/countUsage",params);
  return list
}

/**
 * 开机时长日变化 今日不算
 * 返回 x, y
 *
 * long start,
 * long end
 */
export async function OpenHoursDaily(params:any) {
  const {data:{list}} = await postService("/rest/monitor/dashboard/openHoursDaily",params);
  return list
}

/**
 * 当日开机时长
 * 返回 sum 小时
 */
export async function TodayOpenHours() {
  const {data:{sum}} = await postService("/rest/monitor/dashboard/todayOpenHours");
  return sum
}

/**
 * 本周运行状态统计饼图
 */
export async function StatusAnalysisThisWeek() {
  const {data} = await postService("/rest/monitor/dashboard/statusAnalysisThisWeek");
  return data
}
