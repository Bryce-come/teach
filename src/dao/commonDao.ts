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
export function ImageLink(path: string) {
  if (path) { return axios.defaults.baseURL + '/rest/download?name=' + path + '&dt=' + new Date().getTime(); }
}
