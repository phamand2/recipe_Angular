import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from './auth/auth-service.service';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.reducer';
import { autoLogin } from './auth/auth/store/auth.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthServiceService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    // this.authService.autoLogin();
    this.store.dispatch(autoLogin());
  }
}
