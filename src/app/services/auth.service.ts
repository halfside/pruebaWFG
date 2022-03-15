import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const OAUTH_CLIENT = 'webfg-test';
const OAUTH_SECRET = 'WW58YJj89ltR43Cr';
const REFRESH_TOKEN_URL = 'https://integra1.solutions.webfg.ch/restweb/oauth/token?grant_type=refresh_token&refresh_token=';
const HTTP_OPTIONS = {
  headers: new HttpHeaders(
    {
      'Authorization': 'Basic ' + btoa(OAUTH_CLIENT + ':' + OAUTH_SECRET),
      'Contet-Type': 'application/x-www-form-urlencoded'
    }
  )
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  refreshToken(token: string) {
    return this.httpClient.post(`${REFRESH_TOKEN_URL}${token}`,{}, HTTP_OPTIONS);
  } 

}
