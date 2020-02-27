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
export async function AnalysisParams(params:any) {
  const {data: {list}} = await postService('/rest/analysis/device/params/queryByKeys', params)
  return list;
}

export async function AnalysisDeviceParam(params:any) {
  const { data } = await mesPostUntilSuccess('/rest/monitor/station/device/detail/params',params);
  return data;
}
