import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { browserRefresh } from 'src/app/app.component';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user: string;
  constructor(private loginService: LoginService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      if(val instanceof NavigationEnd && val.url === '/dashboard') {
        if(!this.user) {
          this.user = this.loginService.getUserName();
        }
      }
    }); 
  }

  getUserName() {
    this.loginService.getUserData().subscribe( userName => {
      this.user = userName;
    })
  }

  logout() {
    this.loginService.clearUserData();
    this.user = '';
    this.router.navigate(['/'])
  }

}
