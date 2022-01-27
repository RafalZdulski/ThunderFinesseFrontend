import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Player } from '../model/player';
import { Vehicle } from '../model/vehicle';
import {Observable} from "rxjs";

@Injectable()
export class PlayerServiceService {

  private readonly usersUrl: string;

  constructor(private http: HttpClient,login: string) {
    this.usersUrl = 'http://localhost:8080/player/'+login;
  }

  public getPlayer(): Observable<Player> {
    return this.http.get<Player>(this.usersUrl);
  }

}
