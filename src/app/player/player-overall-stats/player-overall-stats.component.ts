import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PlayerService} from "../services/player.service";
import {Player} from "../../../model/player";

@Component({
  selector: 'app-player-overall-stats',
  templateUrl: './player-overall-stats.component.html',
  styleUrls: ['./player-overall-stats.component.css']
})
export class PlayerOverallStatsComponent implements OnInit {
  ngOnInit(): void {
  }


}
