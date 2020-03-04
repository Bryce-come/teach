// @ts-ignore
import {WebVideoCtrl} from '@/utils/webVideoCtrl';

export async function init(containId: string, windowType: number) {
  // 检查插件是否已经安装过
  const iRet = WebVideoCtrl.I_CheckPluginInstall();
  if (-1 == iRet) {
    alert('您还未安装过插件WebComponentsKit.exe');
    return;
  }
  return new Promise((resolve, reject) => {
    WebVideoCtrl.I_InitPlugin('100%', '100%', {
      bWndFull: true,    // 是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
      iPackageType: 2,    // 2:PS 11:MP4
      bNoPlugin: true,
      iWndowType: windowType, // 分屏类型:1-8，默认值为 1，单画面
      bDebugMode: false,  // js debug
      cbSelWnd(xmlDoc: XMLDocument) {
        // 选择窗口的
        // console.log('选中窗口：', xmlDoc.getElementsByTagName<any>('SelectWnd')[0].textContent);
      },
      cbEvent(iEventType: any, iParam1: any, iParam2: any) {
        if (2 == iEventType) {// 回放正常结束
          // console.log('窗口' + iParam1 + '回放结束！');
        } else if (-1 == iEventType) {
          // console.log('设备' + iParam1 + '网络错误！');
        } else if (3001 == iEventType) {
          // clickStopRecord(g_szRecordType, iParam1);
        }
      },
      cbInitPluginComplete() {
        WebVideoCtrl.I_InsertOBJECTPlugin(containId);
        resolve();
      },
    });
  });
}

export async function login(ip: string, port: string, username: string, pwd: string) {
  return new Promise((resolve, reject) => {
    const iRet = WebVideoCtrl.I_Login(
      ip, 1, port, username, pwd,
      {
        success(xmlDoc: any) {
          // console.log(' 登录成功！');
          resolve();
          //   getChannelInfo();
          //   getDevicePort();
        },
        error(status: any, xmlDoc: any) {
          reject(' 登录失败！' + status);
        },
      });
    if (-1 == iRet) {
      // console.log(' 已登录过！');
      resolve();
    }
  });

}

export async function startRealPlay(window: any, szDeviceIdentify: string, channelId: number) {
  return new Promise((resolve, reject) => {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(window);
    if (!oWndInfo) {
      WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
        iWndIndex: window,
        iStreamType: 1,
        iChannelID: channelId,
        bZeroChannel: false,
        success() {
          // console.log('开始预览成功！');
          resolve();
        },
        error(status: any, xmlDoc: XMLDocument) {
          reject('开始预览失败！' + status ? status : '');
        },
      });
    }else {
      resolve();
    }
  });
}
export async function stopPlay(window: any) {
  return new Promise((resolve, reject) => {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(window);
    if (oWndInfo) {
      const iRet = WebVideoCtrl.I_Stop({
        iWndIndex: window,
        success() {
          resolve();
        },
        error() {
          reject('停止失败');
        },
      });
    }else {
      resolve();
    }
  });

}
// 开始回放
export async function startPlayback(window: any, szDeviceIdentify: string, channelId: number, start: string, end: string) {
  return new Promise((resolve, reject) => {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(window);
    if (!oWndInfo) {
      WebVideoCtrl.I_StartPlayback(szDeviceIdentify, {
        iWndIndex: window,
        iStreamType: 1,
        iChannelID: channelId,
        szStartTime: start,
        szEndTime: end,
        success() {
          resolve();
        },
        error(status: any, xmlDoc: XMLDocument) {
          reject('开始回放失败 ' + status ? status : '');
        },
      });
    }else {
      resolve();
    }
  });
}

export function fullScreen() {
  WebVideoCtrl.I_FullScreen(true);
}
