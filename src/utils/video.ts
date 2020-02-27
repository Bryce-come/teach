
export function initScript(document:Document) {
  let script = document.createElement("script");
  script.src = 'https://factorismart.oss-cn-hangzhou.aliyuncs.com/assets/videoJs/jquery-1.7.1.min.js';
  document.head.appendChild(script);
  script = document.createElement("script");
  script.src = 'https://factorismart.oss-cn-hangzhou.aliyuncs.com/assets/videoJs/webVideoCtrl.js';
  document.head.appendChild(script)
  script = document.createElement("script")
  script.src = 'https://factorismart.oss-cn-hangzhou.aliyuncs.com/assets/videoJs/demo.js'
  document.head.appendChild(script)
}
