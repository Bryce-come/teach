import {postService} from 'web-toolkit/src/case-main/index';
import {urlMap} from '@/config';

export const ListDeviceType = async () => {
  const { data: {list} } = await postService(urlMap.device_type_list.url);
  return list;
};
