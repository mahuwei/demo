import { Component } from '@angular/core';
import { MyLibService } from 'projects/my-lib/src/public-api';
import { CheckForUpdateService } from './update-entities/check-for-update.service';
import { environment } from 'src/environments/environment';
import { UpdateData } from './update-entities/update-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'demo';
  updateInfo: UpdateData;
  public version: string;
  constructor(private myLibService: MyLibService, private checkForUpdate: CheckForUpdateService) {
    this.version = environment.VERSION;
    checkForUpdate.updateSubjcet.subscribe((ret: UpdateData) => {
      this.updateInfo = ret;
    });
  }
  checkUpate(): void {
    console.log('AppComponent调用更新：');
    this.checkForUpdate.checkUpdate();
  }

  reload(): void {
    this.checkForUpdate.reload();
  }
}
