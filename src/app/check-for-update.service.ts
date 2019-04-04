import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { stringify } from '@angular/core/src/render3/util';

@Injectable()
export class CheckForUpdateService {
  /** 声明更新事件 */
  updateSubjcet: Subject<string>;
  constructor(private appRef: ApplicationRef, private updates: SwUpdate) {
    this.updateSubjcet = new Subject<string>();

    // Allow the app to stabilize first, before starting polling for updates with `interval()`.
    const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);
    everySixHoursOnceAppIsStable$.subscribe(() => updates.checkForUpdate());

    updates.available.subscribe(event => {
      console.log('available:current version is', event.current);
      console.log('available:available version is', event.available);

      if (event.current.hash !== event.available.hash) {
        this.updateSubjcet.next(`有新版:${event.available.appData}`);
        console.log('10ms后获取新版本');
        setTimeout(() => {
          this.updateSubjcet.next(`开始获取版本:${event.available.appData}`);
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
      this.updateSubjcet.next(`获取版本:${event.current.appData}完成`);
    });
  }

  async checkUpdate(): Promise<void> {
    try {
      console.log('start check update....');
      await this.updates.checkForUpdate();
      console.log('end check update.');
    } catch (error) {
      console.error('check udpate error:', error, '--- error end --- ');
    }
  }
}
