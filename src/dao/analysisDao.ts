import {postService} from 'web-toolkit/src/case-main/index';

/**
 * @RequestParam String deviceId,
 * @RequestParam long start,
 * @RequestParam long end,
 * return List<DeviceWorkStatusRecord>
 */
export async function AnalysisDeviceTime(params:any) {
  const {data: {list}} = await postService('/rest/analysis/device/time', params);
  return list;
}

/**
 * @RequestParam long start,
 * @RequestParam long end,
 * @RequestParam(required = false,defaultValue = "true") boolean needSummary,
 * @RequestParam(required = false) String devicesJson
 * return list<Device>
 */
export async function AnalysisDeviceTimes(params:any) {
  const {data: {list}} = await postService('/rest/analysis/device/times', params);
  return list;
}
