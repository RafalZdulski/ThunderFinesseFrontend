import { Component, OnInit } from '@angular/core';
import {PlayerVehiclesLists} from "../../../model/playerVehiclesLists";
import {ActivatedRoute} from "@angular/router";
import {PlayerService} from "../services/player.service";
import * as $ from 'jquery';
import {Vehicle} from "../../../model/vehicle";
import {get} from "jquery";

@Component({
  selector: 'app-player-vehicles-stats',
  templateUrl: './player-vehicles-stats.component.html',
  styleUrls: ['./player-vehicles-stats.component.css']
})
export class PlayerVehiclesStatsComponent implements OnInit {
  player!: PlayerVehiclesLists;
  login!: string;
  mode = 1; //0-ab 1-rb 2-sb = index in battleRating array
  type = 'ground'; //used for hiding appropriate class filter, possible values: 'ground' 'air

  allVehicles?: Vehicle[];
  filteredVehicles? :Vehicle[];

  victoriesSum = 0;
  battlesSum = 0;
  winRatioSum = 0;
  spawnsSum = 0;
  deathsSum = 0;
  groundKillsSum = 0;
  airKillsSum = 0;
  kdRatioSum = 0;
  ksRatioSum = 0;

  constructor(private activatedRoute: ActivatedRoute, private playerService : PlayerService) {
    //getting login from url
    this.activatedRoute.params.subscribe(params => {
      this.login = params['login'];
    });

    //getting player fromm backend
    this.playerService.getPlayer(this.login).subscribe(
      player => {
        this.player = player;
        this.allVehicles = player.ground_rb;
        this.filteredVehicles = this.allVehicles
          .copyWithin(this.allVehicles.length,0)
          //initial sorting by battles
          .sort((v1,v2) => {
            return v2.battles - v1.battles
          });
        //init filtering for setting values in summary-row after loading page;
        this.filterList();
      }
    )


    this.setRatiosColors()
  }

  ngOnInit(): void {
    //****** init  functions *******//

    //checking all checkboxes on start
    $('#filters').find('input[type|="checkbox"]').each(function (){
      $(this).prop('checked','checked');
    })
    //setting upper-br-bound to 11.3
    $('#upper-11\\.3').each(function (i,el){el.setAttribute('selected','selected')})
    //hiding filters
    $('#filters').prop('hidden',true);
    //sorting by battles
    $('th[data-name|=battles]').prop('sorted',true);
    //*******************************//


    //******* 'on' functions *******//

    //adding attribute "checked" to all checkboxes of given filter
    // after user clicked on "all" in filters
    $('span.check-all').on('click',function (){
      $(this).parent().find('input').each(function (){
        $(this).prop('checked','checked');
      })
    })
    //removing attribute "checked" from all checkboxes of given filter
    // after user clicked on "none" in filters
    $('span.uncheck-all').on('click',function (){
      $(this).parent().find('input').each(function (){
        $(this).prop('checked',false);
      })
    })

    //function mentioned in directive/sort-table.directive.ts
    $('thead tr th').on('click',function (){
      $(this).siblings('[data-name]').each(function (i,el){
        el.setAttribute('data-order','desc');
        el.removeAttribute("sorted");
      })
    })

    //binding values in battles-slider-output and battles-slider - should be better way to do this?
    $('#battles-slider').on('input',function (){
      let value = $(this).val();
      $('#battles-slider-output').val(value!);
    })
    //if for filtering i use battle-slider-output should is still bind slider to output?
    $('#battles-slider-output').on('input',function (){
      let value = $(this).val();
      $('#battles-slider').val(value!);
    })

    //hiding and showing filters
    $('#filters-tab').on('click',function () {
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        $('#filters').prop('hidden',true);
      }
      else {
      $(this).addClass('active');
        $('#filters').prop('hidden',false);
      }
    })
    //***************************//
  }

  changeMode(el: HTMLLIElement) {
    $(el).siblings().each(function (){
      $(this).removeClass("tab-active");
    })

    $(el).addClass("tab-active");

    let mode:string;
    //i dont like look of this func
    switch(el.id){
      case 'air_ab' :
        this.allVehicles = this.player.air_ab;
        this.filteredVehicles = this.allVehicles
          .copyWithin(this.allVehicles.length,0)
          .sort(function (v1,v2){return v2.battles-v1.battles});
        this.mode=0;
        mode = "br-ab";
        this.type = 'air';
        break;
      case 'ground_ab' :
        this.allVehicles = this.player.ground_ab;
        this.filteredVehicles = this.allVehicles
          .copyWithin(this.allVehicles.length,0)
          .sort(function (v1,v2){return v2.battles-v1.battles});
        this.mode=0;
        mode = "br-ab";
        this.type = 'ground';
        break;
      case 'air_rb' :
        this.allVehicles = this.player.air_rb;
        this.filteredVehicles = this.allVehicles
          .copyWithin(this.allVehicles.length,0)
          .sort(function (v1,v2){return v2.battles-v1.battles});
        this.mode=1;
        mode = "br-rb";
        this.type = 'air';
        break;
      case 'ground_rb' :
        this.allVehicles = this.player.ground_rb;
        this.filteredVehicles = this.allVehicles
          .copyWithin(this.allVehicles.length,0)
          .sort(function (v1,v2){return v2.battles-v1.battles});
        this.mode=1;
        mode = "br-rb";
        this.type = 'ground';
        break;
      case 'air_sb' :
        this.allVehicles = this.player.air_sb;
        this.filteredVehicles = this.allVehicles
          .copyWithin(this.allVehicles.length,0)
          .sort(function (v1,v2){return v2.battles-v1.battles});
        this.mode=2;
        mode = "br-sb";
        this.type = 'air';
        break;
      case 'ground_sb' :
        this.allVehicles = this.player.ground_sb;
        this.filteredVehicles = this.allVehicles
          .copyWithin(this.allVehicles.length,0)
          .sort(function (v1,v2){return v2.battles-v1.battles});
        this.mode=2;
        mode = "br-sb";
        this.type = 'ground';
        break;
    }

    //setting data-type appropriate to displayed mode
    $('th[data-type^="br-"]').each(function (i,el){
      el.setAttribute("data-type",mode)
    });

    //init filterList to set values in summary-row after each change of mode

    this.filterList();

    this.setRatiosColors();
  }

  filterList() {
    //fetching filters from filters-form
    let ranks = getVals('rank');
    let nations = getVals('nation');
    let classes: string[];classes = [];
    switch (this.type){
      case 'ground': classes = getVals('ground-class'); break;
      case 'air': classes = getVals('air-class'); break;
    }
    let statuses = getVals('status')
    let mode = this.mode;
    let lowerBrBond = Number.parseFloat(<string>$('select[name|="br-lower"]').val());
    let upperBrBond = Number.parseFloat(<string>$('select[name|="br-upper"]').val());
    let minBattles = <number>$('#battles-slider-output').val();

    //variables for summary-row
    let battlesSum=0;
    let victoriesSum=0;
    let spawnsSum=0;
    let deathsSum=0;
    let groundKillsSum=0;
    let airKillsSum=0;


    this.filteredVehicles = this.allVehicles?.filter(filter)

    this.victoriesSum = victoriesSum;
    this.battlesSum = battlesSum;
    this.winRatioSum = victoriesSum / battlesSum;
    this.spawnsSum = spawnsSum;
    this.deathsSum = deathsSum;
    this.groundKillsSum = groundKillsSum;
    this.airKillsSum = airKillsSum;
    this.kdRatioSum = (groundKillsSum + airKillsSum) / deathsSum;
    this.ksRatioSum = (groundKillsSum + airKillsSum) / spawnsSum;

    //auxiliary functions
    function filter(el:Vehicle){
      if (!ranks.includes(el.rank)) return false;
      if (!nations.includes(el.nation)) return false;
      if (!classes.includes(el.klass)) return false;
      if (!statuses.includes(el.status)) return false;
      if (lowerBrBond > el.battleRating[mode]) return false;
      if (upperBrBond < el.battleRating[mode]) return false;
      if (minBattles > el.battles) return false;

      //summing values for summary-row - doing it here to save doing one more loop
      battlesSum += el.battles;
      victoriesSum += el.victories;
      spawnsSum += el.respawns;
      deathsSum += el.deaths;
      groundKillsSum += el.groundKills;
      airKillsSum += el.airKills;

      return true;
    }

    function getVals(name:string) {
      let vals: any[];
      vals = [];
      $('input[name|='+name+']').each(function (){
        if($(this).prop('checked'))
          vals.push($(this).attr('value'));
      })
      return vals;
    }

    this.setRatiosColors();
  }

  setRatiosColors(){
    //TODO needs refactoring asap but i dont know other way to wait until ngFor finish
    setTimeout(function (){
      //setting win ratio colors
      $('td.win-ratio').each(function (i,el){
        let val = $(this);
        if(Number.parseFloat(el.innerHTML) <= 45 ) val.css('background-color','tomato');
        else if(Number.parseFloat(el.innerHTML) <= 52 ) val.css('background-color','khaki');
        else if(Number.parseFloat(el.innerHTML) <= 58 ) val.css('background-color','lightgreen');
        else if(Number.parseFloat(el.innerHTML) <= 63 ) val.css('background-color','CornflowerBlue');
        else val.css('background-color','darkorchid');
      });
      //setting kd ratio colors
      $('td.kd-ratio').each(function (i,el){
        let val = $(this);
        if(Number.parseFloat(el.innerHTML) <= 1.0 ) val.css('background-color','tomato');
        else if(Number.parseFloat(el.innerHTML) <= 1.5 ) val.css('background-color','khaki');
        else if(Number.parseFloat(el.innerHTML) <= 2.0 ) val.css('background-color','lightgreen');
        else if(Number.parseFloat(el.innerHTML) <= 2.5 ) val.css('background-color','CornflowerBlue');
        else val.css('background-color','darkorchid');
      });
      //setting ks ratio colors
      $('td.ks-ratio').each(function (i,el){
        let val = $(this);
        if(Number.parseFloat(el.innerHTML) <= 1.0 ) val.css('background-color','tomato');
        else if(Number.parseFloat(el.innerHTML) <= 1.5 ) val.css('background-color','khaki');
        else if(Number.parseFloat(el.innerHTML) <= 2.0 ) val.css('background-color','lightgreen');
        else if(Number.parseFloat(el.innerHTML) <= 2.5 ) val.css('background-color','CornflowerBlue');
        else val.css('background-color','darkorchid');
      });
    },1000)
  }
}
