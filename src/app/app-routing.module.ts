import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {DashboardComponent} from "./dashboard/dashboard.component";
import {PlayerOverallStatsComponent} from "./player/player-overall-stats/player-overall-stats.component";
import {PlayerVehiclesStatsComponent} from "./player/player-vehicles-stats/player-vehicles-stats.component";
import {PlayerGraphsComponent} from "./player/player-graphs/player-graphs.component";

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },

  {
    path: 'player/:login',
    component: PlayerOverallStatsComponent,
  },
  {
    path: 'player/:login/graphs',
    component: PlayerGraphsComponent,
  },
  {
    path: 'player/:login/vehicles',
    component: PlayerVehiclesStatsComponent,
  },

];

@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule { }
