import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Player } from '../../../model/player';
import {Observable} from "rxjs";
import {Graphs} from "../../../model/graphs";

@Injectable({ providedIn: 'root' })
export class PlayerService {

  private readonly usersUrl: string;

  constructor(private http: HttpClient) {
    this.usersUrl = 'http://localhost:8080/player/';
  }

  public getPlayer(login : string) : Observable<Player> {
    return this.http.get<Player>(this.usersUrl+login).pipe();
  }

  public getPlayerGraphData(login : string) : Observable<Graphs[]> {
    return this.http.get<Graphs[]>(this.usersUrl+login+'/graphs').pipe();
  }

}
