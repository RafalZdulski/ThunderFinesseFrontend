import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {DashboardComponent} from "./dashboard/dashboard.component";
import {PlayerVehiclesStatsComponent} from "./player-vehicles-stats/player-vehicles-stats.component";
import {PlayerOverallStatsComponent} from "./player-overall-stats/player-overall-stats.component";
import {MainNavbarComponent} from "./main-navbar/main-navbar.component";

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'player/vehicles',
    component: PlayerVehiclesStatsComponent,
  },
  {
    path: 'player',
    component: PlayerOverallStatsComponent,
  },
];

@NgModule({
  declarations: [
    MainNavbarComponent
  ],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule,
    MainNavbarComponent
  ]
})
export class AppRoutingModule { }
