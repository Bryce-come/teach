import {postService} from 'web-toolkit/src/case-main/index';
import {urlMap} from '@/config';

export const AlarmRecordConfirm = async (params: any) => {
  await postService(urlMap.alarm_record_confirm.url, params);
};

export const MonitorAlarm = async () => {
  return await postService(urlMap.monitor_alarms.url, {}, {throwable: false, showMsg: false});
};
