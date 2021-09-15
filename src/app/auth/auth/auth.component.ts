import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { PlaceholderDirective } from 'src/app/shared/placeholder/placeholder.directive';
import { AuthResponseData, AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;

  private closeSub: Subscription

  constructor(private authService: AuthServiceService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(): void {}

  onHandleError(){
    this.error = null;
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true

    let authObs: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      authObs = this.authService.login(email,password)
    } else {
      authObs = this.authService.signUp(email, password)
    }

    authObs.subscribe(
      (response) => {
        console.log(response)
        this.isLoading = false
        this.router.navigate(['/recipes'])
      }, (errorMessage) => {
        this.error = errorMessage
        this.showErrorAlert(errorMessage)
        this.isLoading = false
      }
    )

    form.reset();
  }

  private showErrorAlert(message: string){
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    const hostViewContainerRef = this.alertHost.viewContainerRef;
 
    hostViewContainerRef.clear();
    
    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(
      () => {
        this.closeSub.unsubscribe();
        hostViewContainerRef.clear();
      }
    );
  }

  ngOnDestroy(){
    if(this.closeSub){
      this.closeSub.unsubscribe()
    }
  }


}
