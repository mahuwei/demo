import { IUpdateAppData } from './i-update-app-data';

import { UpdateStatus } from './update-status';

export class UpdateData {
  appData: IUpdateAppData;
  status: UpdateStatus;
  statusInfo: string;

  change(status: UpdateStatus, appData?: IUpdateAppData) {
    this.status = status;
    if (appData) {
      this.appData = appData;
    }
    let info: string;
    switch (status) {
      case UpdateStatus.check:
        info = '检查更新';
        break;
      case UpdateStatus.activateUpdate:
        info = '下载更新';
        break;
      case UpdateStatus.activated:
        info = '下载更新成功';
        break;
      case UpdateStatus.none:
        info = '没有更新';
        break;
    }
    this.statusInfo = info;
  }
}
