import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PlayerService} from "../services/player.service";
import * as $ from 'jquery';

@Component({
  selector: 'app-player-navbar',
  templateUrl: './player-navbar.component.html',
  styleUrls: ['./player-navbar.component.css']
})
export class PlayerNavbarComponent implements OnInit {
  login!: string;

  constructor(private activatedRoute: ActivatedRoute,
              private playerService : PlayerService) {
    this.activatedRoute.params.subscribe(params => {
      this.login = params['login'];
    });
  }

  ngOnInit(): void {
      let href = $(location).attr('href');
      let id = href?.substr(href?.lastIndexOf("/")+1);
      if(id == 'vehicles'){
        $('#vehicles').addClass("tab-active")
      }else if(id == 'graphs'){
        $('#graphs').addClass("tab-active")
      }else{
        $('#dashboard').addClass("tab-active")
      }
  }


  update(login: string) {
    this.playerService.update(login);
    window.location.reload();
  }
}
