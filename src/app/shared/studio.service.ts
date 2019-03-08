import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class StudioService {
  baseUrl = 'http://13.232.30.248:8081/schedule';
  constructor(
    private http: HttpClient
  ) { }

  getStudioData(reqParams){
    return this.http.post(this.baseUrl + '/check', reqParams);
  }

  saveStudio(reqData){
    return this.http.post(this.baseUrl, reqData);
  }

  updateStudio(reqData){
    return this.http.put(this.baseUrl, reqData);
  }
}
