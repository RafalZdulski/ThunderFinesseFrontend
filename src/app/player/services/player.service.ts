import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Player } from '../../../model/player';
import { Vehicle } from '../../../model/vehicle';
import {Observable} from "rxjs";

@Injectable({ providedIn: 'root' })
export class PlayerService {

  private readonly usersUrl: string;

  constructor(private http: HttpClient) {
    this.usersUrl = 'http://localhost:8080/player/';
  }

  public getPlayer(login : string) : Observable<Player> {
    return this.http.get<Player>(this.usersUrl+login).pipe();
  }


}
