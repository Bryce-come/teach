import {postService} from 'web-toolkit/src/case-main/index';
import {urlMap} from '@/config';

export const Login = async (param:any) => {
  const { data } = await postService(urlMap.loginCommon.url,param);
  return data;
};

export const LoginOut = async ()=>{
  await postService(urlMap.logout.url);
};
