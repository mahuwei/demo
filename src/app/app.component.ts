import { Component } from '@angular/core';
import { MyLibService } from 'projects/my-lib/src/public-api';
import { CheckForUpdateService } from './check-for-update.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'demo';
  public version: string;
  constructor(private myLibService: MyLibService, private checkForUpdate: CheckForUpdateService) {
    this.version = environment.VERSION;
  }
  checkUpate(): void {
    this.checkForUpdate.checkUpdate();
  }
}
