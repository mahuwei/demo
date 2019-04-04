import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { IUpdateAppData } from './i-update-app-data';
import { UpdateData } from './update-data';
import { UpdateStatus } from './update-status';

@Injectable()
export class CheckForUpdateService {
  /** 声明更新事件 */
  updateSubjcet: Subject<UpdateData>;
  updateData: UpdateData;
  constructor(private appRef: ApplicationRef, private updates: SwUpdate) {
    this.updateData = new UpdateData();
    this.updateSubjcet = new Subject<UpdateData>();

    // Allow the app to stabilize first, before starting polling for updates with `interval()`.
    const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);
    everySixHoursOnceAppIsStable$.subscribe(() => updates.checkForUpdate());

    updates.available.subscribe(event => {
      console.log('available:current version is', event.current);
      console.log('available:available version is', event.available);

      if (event.current.hash !== event.available.hash) {
        const updateInfo = event.available.appData as IUpdateAppData;
        this.updateData.change(UpdateStatus.activateUpdate, updateInfo);
        this.updateSubjcet.next(this.updateData);
        console.log('10ms后获取新版本');
        setTimeout(() => {
          this.updateSubjcet.next(this.updateData);
          updates.activateUpdate().then(() => {
            console.log('activateUpdate更新完成可以重新加载。');
            // document.location.reload();
          });
        }, 10 * 1000);
      }
    });

    updates.activated.subscribe(event => {
      console.log('activated:old version was', event.previous);
      console.log('activated:new version is', event.current);
      const updateInfo = event.current.appData as IUpdateAppData;
      this.updateData.change(UpdateStatus.activated, updateInfo);
      this.updateSubjcet.next(this.updateData);
    });
  }

  async checkUpdate(): Promise<void> {
    try {
      console.log('start check update....');
      this.updateData.change(UpdateStatus.check);
      this.updateSubjcet.next(this.updateData);
      await this.updates.checkForUpdate();
      // 执行完依然没有状态依然是初始状态，标识没有更新
      if (this.updateData.status === UpdateStatus.check) {
        this.updateData.change(UpdateStatus.none);
        this.updateSubjcet.next(this.updateData);
      }
      console.log('end check update.');
    } catch (error) {
      console.error('check udpate error:', error, '--- error end --- ');
    }
  }

  /** 重新加载网站 */
  reload() {
    document.location.reload();
  }
}
