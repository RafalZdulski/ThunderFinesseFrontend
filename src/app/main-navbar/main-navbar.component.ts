import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-main-navbar',
  templateUrl: './main-navbar.component.html',
  styleUrls: ['./main-navbar.component.css']
})
export class MainNavbarComponent implements OnInit {
  login: string ="";

  constructor(public router: Router) {}

  ngOnInit(): void {
  }

  search() {
    if (this.login.trim().length == 0){
      console.log("empty login");
    }else{
      this.router.navigate(['player/' + this.login]);
    }
  }
}
