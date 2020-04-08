import {postService} from 'web-toolkit/src/case-main/index';

/**
 * 题目
 * RequestParam(required = false) String title,
 * 内容
 * RequestParam String content
 */
export async function NewsAdd(params: any) {
  await postService('/rest/news/add', params);
}

/**
 * RequestParam int id,
 * RequestParam(required = false) String title,
 * RequestParam(required = false) String content
 */
export async function NewsUpdate(params: any) {
  await postService('/rest/news/update', params);
}

/**
 * RequestParam int id
 */
export async function NewsDel(params: any) {
  await postService('/rest/news/del', params);
}

/**
 * ApiParam(value = "时间范围，用于管理的列表")
 * RequestParam(required = false) Long start,
 * RequestParam(required = false) Long end,
 * ApiParam(value = "显示数量，用于首页的列表") 如显示近5条
 * RequestParam(required = false) Integer count
 */
export async function NewsList(params: any) {
  const {data: {list}} = await postService('/rest/news/list', params);
  return list;
}
