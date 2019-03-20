import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable()
export class CheckForUpdateService {
  constructor(private appRef: ApplicationRef, private updates: SwUpdate) {
    // Allow the app to stabilize first, before starting polling for updates with `interval()`.
    const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    everySixHoursOnceAppIsStable$.subscribe(() => updates.checkForUpdate());

    updates.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);

      if (event.current.hash !== event.available.hash) {
        console.log('重新加载，30ms后');
        setTimeout(() => {
          updates.activateUpdate().then(() => document.location.reload());
        }, 30 * 1000);
      }
    });

    updates.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });
  }

  async checkUpdate(): Promise<void> {
    try {
      console.log('start check update....');
      await this.updates.checkForUpdate();
      console.log('end check update....');
    } catch (error) {
      console.error('check udpate error:', error, '--- error end --- ');
    }
  }
}
