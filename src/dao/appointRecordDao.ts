import {postService} from 'web-toolkit/src/case-main/index';

/**
 * 预约审核列表
 * RequestParam(required = false) String resultJson,
   RequestParam(required = false) String typeJson,
   RequestParam(required = false) Long start,
   RequestParam(required = false) Long end
 */
export const AppointList = async (params: any) => {
  const { data: {list} } = await postService('/rest/appoint/record/list', params);
  return list;
};

/**
 * 我的预约
 * RequestParam long start,
   RequestParam long end
 */
export const AppointListMine = async (params: any) => {
  const { data: {list} } = await postService('/rest/appoint/record/listMine', params);
  return list;
};

/**
 * 申请预约
 * ApiParam(value = "个人预约-2，授课预约-1",required = true)
   RequestParam int type,
   RequestParam(required = false) Integer courseId,
   RequestParam(required = false) Integer programId,
   RequestParam int teacherId,
   RequestParam(required = false) String studentJson,
   ApiParam(value = "个人预约时必填")
   RequestParam(required = false) String stationJson,
   RequestParam long start,
   RequestParam long end,
   ApiParam(value = "lessons:[], clasz-班级, claszGroup-分组，stationBind:{<stationId>:[uid]}")
   RequestParam String extendJson,
 */
export const AppointAdd = async (params: any) => {
  await postService('/rest/appoint/record/add', params);
};

/**
 * RequestParam int id,
   ApiParam(value = "个人预约-2，授课预约-1",required = true)
   RequestParam(required = false) Integer type,
   RequestParam(required = false) Integer courseId,
   RequestParam(required = false) Integer programId,
   RequestParam(required = false) Integer teacherId,
   RequestParam(required = false) String studentJson,
   ApiParam(value = "个人预约时必填")
   RequestParam(required = false) String stationJson,
   RequestParam(required = false) Long start,
   RequestParam(required = false) Long end,
   ApiParam(value = "lessons:[], clasz-班级, claszGroup-分组，stationBind:{<stationId>:[uid]}")
   RequestParam(required = false) String extendJson,
 */
export const AppointUpdate = async (params: any) => {
  await postService('/rest/appoint/record/update', params);
};

/**
 * 审核
 * RequestParam int id,
   ApiParam(required = true, value = "1-agree，2-disagree，3-cancel")
   RequestParam int result,
   ApiParam(value = "reason")
   RequestParam(required = false) String extendJson,
 */
export const AppointOperate = async (params: any) => {
  await postService('/rest/appoint/record/operate', params);
};
