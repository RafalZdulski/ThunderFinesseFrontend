import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router'

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlayerComponent } from './player/player.component';
import {PlayerOverallStatsComponent} from "./player-overall-stats/player-overall-stats.component";
import {PlayerVehiclesStatsComponent} from "./player-vehicles-stats/player-vehicles-stats.component";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PlayerComponent,
    PlayerOverallStatsComponent,
    PlayerVehiclesStatsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
