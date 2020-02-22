import {postService,download} from 'web-toolkit/src/case-main/index';
import axios from 'axios';

/**
 * 私有文件下载
 *
 */
export function DownLoadPrivate( params:any ){
  return params;
}

/**
 * 用于图片显示-private
 */
export function ImageLink(path:string) {
  return axios.defaults.baseURL+'/rest/download?name='+path;
}
