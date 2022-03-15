import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

const API_URL = 'https://integra1.solutions.webfg.ch/restweb/quotes/2970161-1058-814?fields=LVAL_NORM,CLOSE_ADJ_NORM,NC2_PR_NORM,NC2_NORM,VOL,TUR,PY_CLOSE,YTD_PR_NORM';
const OAUTH_CLIENT = 'webfg-test';
const OAUTH_SECRET = 'WW58YJj89ltR43Cr';
const TOKEN_URL = 'https://integra1.solutions.webfg.ch/restweb/oauth/token?grant_type=password&username=test001&scope=uaa.user&password=ryby3NTyKduAMcvZ';
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
export class DataService {
  

  constructor(
    private httpClient: HttpClient
  ) { }

  getToken(): Observable<any> {    
    return this.httpClient.post(TOKEN_URL, {}, HTTP_OPTIONS);
  }

  getItemData(): Observable<any> {
    return this.httpClient.get(API_URL);
  }

  getItemName(url: string): Observable<any> {
    return this.httpClient.get(url);
  }

}

