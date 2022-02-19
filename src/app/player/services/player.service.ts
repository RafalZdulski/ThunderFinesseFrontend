import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { PlayerVehiclesLists } from '../../../model/playerVehiclesLists';
import {Observable} from "rxjs";
import {GameModeDetails} from "../../../model/GameModeDetails";
import {GameModeOverall} from "../../../model/GameModeOverall";

@Injectable({ providedIn: 'root' })
export class PlayerService {

  private readonly usersUrl: string;

  constructor(private http: HttpClient) {
    this.usersUrl = 'http://localhost:8080/player/';
  }

  public getPlayer(login : string) : Observable<PlayerVehiclesLists> {
    return this.http.get<PlayerVehiclesLists>(this.usersUrl+login).pipe();
  }

  public getGameModeDetails(login : string) : Observable<GameModeDetails[]> {
    return this.http.get<GameModeDetails[]>(this.usersUrl+login+'/graphs').pipe();
  }

  public getGameModeOverallData(login:string) : Observable<GameModeOverall[]>{
    return this.http.get<GameModeOverall[]>(this.usersUrl+login+'/overall').pipe();
  }


  update(login: string) {
    this.http.post(this.usersUrl, login).subscribe();
    console.log(login);
  }
}
