import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { HttpClientModule} from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router'

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {PlayerOverallStatsComponent} from "./player/player-overall-stats/player-overall-stats.component";
import {PlayerVehiclesStatsComponent} from "./player/player-vehicles-stats/player-vehicles-stats.component";
import {MainNavbarComponent} from "./main-navbar/main-navbar.component";
import {PlayerService} from "./player/services/player.service";
import { PlayerNavbarComponent } from './player/player-navbar/player-navbar.component';
import { PlayerGraphsComponent } from './player/player-graphs/player-graphs.component';
import { SortTableDirective } from './directive/sort-table.directive';

@NgModule({
  declarations: [
    AppComponent,
    MainNavbarComponent,
    DashboardComponent,
    PlayerOverallStatsComponent,
    PlayerVehiclesStatsComponent,
    PlayerNavbarComponent,
    PlayerGraphsComponent,
    SortTableDirective
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [PlayerService],
  bootstrap: [AppComponent],
})
export class AppModule { }
