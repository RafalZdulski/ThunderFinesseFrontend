import { Component, OnInit } from '@angular/core';
import {Player} from "../../../model/player";
import {ActivatedRoute} from "@angular/router";
import {PlayerService} from "../services/player.service";
import * as $ from 'jquery';

@Component({
  selector: 'app-player-vehicles-stats',
  templateUrl: './player-vehicles-stats.component.html',
  styleUrls: ['./player-vehicles-stats.component.css']
})
export class PlayerVehiclesStatsComponent implements OnInit {
  player!: Player;
  login!: string;
  vehicles!: any[];

  constructor(private activatedRoute: ActivatedRoute,
              private playerService : PlayerService) {
    this.activatedRoute.params.subscribe(params => {
      this.login = params['login'];
    });

    this.playerService.getPlayer(this.login).subscribe(
      player => {
        this.player = player;
        this.vehicles = player.ground_rb;
      }
    );


  }

  ngOnInit(): void {
    //adding attribute "checked" to all checkboxes of given filter
    // after user clicked on "all" in filters
    $('span.check-all').on('click',function (){
        $(this).parent().children('div').each(function (){
          let checkbox = $(this).children('input').first()
          checkbox.each(function (i,el){
            el.setAttribute('checked','checked');
          })
        })
    })

    //removing attribute "checked" from all checkboxes of given filter
    // after user clicked on "none" in filters
    $('span.uncheck-all').on('click',function (){
      $(this).parent().children('div').each(function (){
        let checkbox = $(this).children('input').first()
        checkbox.each(function (i,el){
          el.removeAttribute('checked');
        })
      })
    })

    //checking all checkboxes on start
    $('#filters').find('input').each(function (u,el){
      el.setAttribute('checked','checked');
    })
    $('#upper-11\\.3').each(function (i,el){el.setAttribute('selected','selected')})
  }

  changeMode(el: HTMLLIElement) {
    $(el).siblings().each(function (){
      $(this).removeClass("tab-active");
    })

    $(el).addClass("tab-active");

    //i dont like look of this func
    switch(el.id){
      case 'air_ab' :  this.vehicles = this.player.air_ab; break;
      case 'ground_ab' :  this.vehicles = this.player.ground_ab; break;
      case 'air_rb' :  this.vehicles = this.player.air_rb; break;
      case 'ground_rb' :  this.vehicles = this.player.ground_rb; break;
      case 'air_sb' :  this.vehicles = this.player.air_sb; break;
      case 'ground_sb' :  this.vehicles = this.player.ground_sb; break;
    }

  }
}
