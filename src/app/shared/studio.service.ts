import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class StudioService {
  baseUrl = 'http://13.232.30.248:8081/schedule';
  headers = new Headers();
  options: any;

  constructor(
    private http: HttpClient
  ) {
    this.headers.append('Content-Type', 'application/json');
    this.options = new RequestOptions({ headers: this.headers });
   }

  // check studio schedule 
  getStudioData(reqParams){
    return this.http.post(this.baseUrl + '/check', reqParams, this.options);
  }

  // save studio schedule 
  saveStudio(reqData){
    return this.http.post(this.baseUrl, reqData, this.options);
  }

  // update studio schedule
  updateStudio(reqData){
    return this.http.put(this.baseUrl, reqData, this.options);
  }
}
