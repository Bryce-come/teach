import {postService, mesPostUntilSuccess} from 'web-toolkit/src/case-main/index';

/**
 * RequestParam String deviceId,
 * RequestParam long start,
 * RequestParam long end,
 * return List<DeviceWorkStatusRecord>
 */
export async function AnalysisDeviceTime(params: any) {
  const {data: {list}} = await postService('/rest/analysis/device/time', params);
  return list;
}

/**
 * RequestParam long start,
 * RequestParam long end,
 * RequestParam(required = false,defaultValue = "true") boolean needSummary,
 * RequestParam(required = false) String devicesJson
 * return list<Device>
 */
export async function AnalysisDeviceTimes(params: any) {
  const {data: {list}} = await postService('/rest/analysis/device/times', params);
  return list;
}

/**
 * ApiParam(value = "[{ deviceId:xxx, keys:['fullkey1','fullkey1'] }]")
 * RequestParam(required = false) String paramsJson,
 * RequestParam(required = false) Long start,
 * RequestParam(required = false) Long end,
 * ApiParam(value = "抽样个数，不传或0代表不抽样")
 * RequestParam(required = false) Integer sampleNum
 */
export async function AnalysisParams(params: any) {
  const {data: {list}} = await postService('/rest/analysis/device/params/queryByKeys', params);
  return list;
}

export async function AnalysisDeviceParam(params: any) {
  const { data } = await mesPostUntilSuccess('/rest/monitor/station/device/detail/params', params);
  return data;
}

/**
 * 参数快照
 * RequestParam String deviceId,
 * RequestParam long dt,
 * ApiParam(value = "用于判断数据无效的时间差（从dt时间点向前找有效数据点），默认无")
 * RequestParam(required = false) Long minutes
 */
export async function AnalysisParamSnapshot(params: any) {
  const {data: {record}} = await postService('/rest/analysis/device/params/snapshot', params);
  return record;
}

/**
 * 实验人时数
 * 课程可筛选（多选），选择时间范围统计（daterange，一开始不填），将会统计这个时间范围内的课程的人时数，
 * 返回list<Map>: [ { x:课程名, y:值 } ]
 *
 * ApiParam(value = "course id [] json")
 * RequestParam(required = false) String courseJson,
 * RequestParam long start,
 * RequestParam long end
 */
export async function AnalysisCourseManClassHours(params: any) {
  const {data: {list}} = await postService('/rest/analysis/classHours', params);
  return list;
}
