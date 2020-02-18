import {postService} from 'web-toolkit/src/case-main/index';
import {urlMap} from '@/config';

export const Login = async (param: any) => {
  const { data } = await postService(urlMap.loginCommon.url, param);
  return data;
};

export const LoginOut = async () => {
  await postService(urlMap.logout.url);
};

export const UserUpdatePwd = async (params: any) => {
  await postService(urlMap.pwd_update.url, params);
};

export const UserUpdateInfo = async (params: any) => {
  await postService(urlMap.user_update_info.url, params);
};
