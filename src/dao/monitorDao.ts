import {postService} from 'web-toolkit/src/case-main/index';

/**
 * 视频记录
 *  RequestParam String ip,
 RequestParam long start,
 RequestParam long end
 */
export async function CameraRecordList(params: any) {
  const {data: {list}} = await postService('/rest/camera/record/list', params);
  return list;
}

/**
 * 监控列表
 * 返回list:List<ExpStation>, record:CourseRecord
 */
export async function MonitorStationList() {
  const {data} = await postService('/rest/monitor/station/list');
  return data;
}

/**
 * 监控详情
 * RequestParam int stationId
 * 返回 station, record:CourseRecord
 */
export async function MonitorStationDetail(params: any) {
  const {data} = await postService('/rest/monitor/station/detail', params);
  return data;
}
