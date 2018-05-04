import { Injectable } from '@angular/core';
import _ from 'lodash';

@Injectable()
export class RequestHeadersProvider {

  _defaultHeaders: any;

  constructor() { }

  appendDefaultHeaders(value: Object) {
    this._defaultHeaders = _.merge(this.defaultHeaders, value);

    this.bindDefaultHeaders();
  }

  clearDefaultHeaders() {
    delete this._defaultHeaders;
  }

  getHeaders(headers = {}) {
    return _.merge({}, this.defaultHeaders, headers);
  }

  bindDefaultHeaders(): void {
  }

  applyBaseHeaders(){
    this.appendDefaultHeaders(this.baseHeaders);
  }

  get defaultHeaders() {
    if (!this._defaultHeaders) {
      this._defaultHeaders = _.merge({}, this.baseHeaders);
    }

    return this._defaultHeaders;
  }

  baseHeaders: any = {
    'Accept': 'application/json',
    'Content-type': 'application/json'
  };

}

