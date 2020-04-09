import {postService, download} from 'web-toolkit/src/case-main/index';
import axios from 'axios';

/**
 * 私有文件下载
 *
 */
export async function DownLoadPrivate( path: string, filename: string ) {
  await download('/rest/download', {name: path}, {filename});
}

/**
 * 用于图片显示-private
 */
export function ImageLink(path: string, dt?: Date) {
  if (path) { return axios.defaults.baseURL + '/rest/download?name=' + path + (dt ? ('&dt=' + dt?.getTime()) : ''); }
}

/**
 * 获取天气预报
 * list:
 *    "date": "2020-04-11",
 *    "dayweather": "小雨-中雨", // 这里用weather.ts获取图标
 *    "daytemp": "16", 温度
 */
export async function weather() {
  const {data: {list}} = await postService("/rest/common/weather");
  return list;
}
