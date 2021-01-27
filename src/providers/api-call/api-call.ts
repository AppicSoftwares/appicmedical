import { Injectable } from "@angular/core";
import { AppSettings } from "../../app/settings";
import { RequestOptions, Http } from "@angular/http";
import { Header } from "ionic-angular";

@Injectable()
export class ApiCallProvider {
  baseUrl: any = AppSettings.API_ENDPOINT;
  universalApi: any = AppSettings.universalApi;
  http_headers: any;
  options: any;
  rxapi_headers;
  authToken: any;
  headers :any;
  constructor(public http: Http) {
    this.http_headers = new Headers();
    this.http_headers.append("Accept", "application/json");
    this.http_headers.append("Content-Type", "application/json");
    this.http_headers.append("X-Amz-Date", "");
    this.http_headers.append("X-Api-Key", true);
    this.http_headers.append("X-Amz-Security-Token", "");
    this.options = new RequestOptions({ headers: this.http_headers });
    console.log('opmtopm os',this.options);
    this.headers = new Headers();
    this.setHeaders();
    this.rxapi_headers = new Headers();
    this.rxapi_headers.append("Accept", "application/json");
    this.rxapi_headers.append("Content-Type", "application/json");
  }
  setHeaders(token = null) {
    this.authToken = token;
    if (this.http_headers.get("Authorization")) {
      // this.http_headers.delete("Authorization");
    }
    if (token) {
      this.http_headers.append("Authorization", "Bearer " + token);
    } else {
      // this.http_headers.append("Authorization", "");
    }
  }

 getUniversal(subUrl: string, token = null): Promise<any> {
  this.headers = new Headers();
  this.headers.append("Accept", "application/json");
  this.headers.append("Content-Type", "application/json");
  console.log(token)
  if (token) {
    this.headers.append("Authorization","Bearer " + token);
  } else {
    this.headers.append("api-token","Uu8jSR6PoPEWcUGHs4OzoqxP1bub3jqEaUqHQg8zSNogDNPELmkeX7ehKhkG_LKb6Tg");
    this.headers.append("user-email",'jaydeepkataria@gmail.com');
  }
  console.log(this.headers)
  const options = new RequestOptions({ headers: this.headers });
    return new Promise((resolve, reject) => {
      const request: string = this.universalApi + subUrl;
      this.http.get(request, options).map((res) => res.json()).subscribe(
        (data) => {
          resolve(data);
        },
        (error) => reject(error)
      );
    });
 }
 postUniversal(subUrl: string, token = null): Promise<any> {
  this.headers = new Headers();
  this.headers.append("Accept", "application/json");
  this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization","Bearer " + token);
  const options = new RequestOptions({ headers: this.headers });
    return new Promise((resolve, reject) => {
      const request: string = this.universalApi + subUrl;
      this.http.post(request, options).map((res) => res.json()).subscribe(
        (data) => {
          resolve(data);
        },
        (error) => reject(error)
      );
    });
 }
  getData(subUrl: string): Promise<any> {
    const options = new RequestOptions({ headers: this.http_headers });
    return new Promise((resolve, reject) => {
      const request: string = this.baseUrl + subUrl;
      this.http.get(request, options).map((res) => res.json()).subscribe(
        (data) => {
          resolve(data);
        },
        (error) => reject(error)
      );
    });
  }

 async postData(subUrl: string, data: any): Promise<any> {
    const options = new RequestOptions({ headers: this.http_headers });
    console.log('option is:- 52',options);
    
    return await new Promise((resolve, reject) => {
      const request: string = this.baseUrl + subUrl;
      this.http.post(request, data, options).subscribe(
        (res) => resolve(res),
        (error) => {
          reject(error);
        }
      );
    });
  }

  putData(subUrl: string, data?: any): Promise<any> {
    const options = new RequestOptions({ headers: this.http_headers });
    return new Promise((resolve, reject) => {
      const request: string = this.baseUrl + subUrl;
      this.http.put(request, data, options).subscribe(
        (res) => resolve(res),
        (error) => reject(error)
      );
    });
  }
  deleteData(subUrl: string): Promise<any> {
    const options = new RequestOptions({ headers: this.http_headers });
    return new Promise((resolve, reject) => {
      const request: string = this.baseUrl + subUrl;
      this.http.delete(request, options).subscribe(
        (res) => resolve(res),
        (error) => reject(error)
      );
    });
  }
}
