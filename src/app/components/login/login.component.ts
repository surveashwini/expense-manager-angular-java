import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
declare var gapi : any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  auth2: any;
  showLoader: boolean;
  
  constructor(private router: Router, 
    private ngZone: NgZone, 
    private loginService: LoginService, 
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.showLoader = false;
    var googleUser = {};
    //var startApp = function() {
      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '1074246000478-2tek9c04sv7l8o6otjui0bdjk2bkhobt.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          // Request scopes in addition to 'profile' and 'email'
          //scope: 'additional_scope'
        });
        this.attachSignin(document.getElementById('customBtn'));
      });
    //};

    
  }

  attachSignin(element) {
    this.showLoader = true;
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {
        this.ngZone.run(() => {
          this.loginService.saveUserData(googleUser.getAuthResponse(true).access_token, googleUser.getBasicProfile().getName());
          this.loginService.authenticateUser(
            googleUser.getBasicProfile().getName(),
            googleUser.getBasicProfile().getEmail(),
            googleUser.getAuthResponse(true).access_token
          ).subscribe(response => {
            this.showLoader = false;
            this.router.navigate(['dashboard']);
            this.cdr.detectChanges();
          })
        });
      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });
  }

  login() {
    this.router.navigate(['dashboard']);
  }
}
