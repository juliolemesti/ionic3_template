import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Resolve } from '@mbamobi/url-resolver';
import { RequestHeadersProvider, MessageProvider, GlobalEventsProvider } from '../../providers/providers';
import { Firebase } from '@ionic-native/firebase';
import { Network } from '@ionic-native/network';
import { NoConnectionError, DefaultServiceError, DefaultRequestError } from '../../config/constants';
import { isPresent, isBlank } from 'ionic-angular/util/util';
import { TimeoutError } from 'rxjs';

export const HTTP_TIMEOUT = 30;

@Injectable()
export class UrlInterceptor implements HttpInterceptor {

    constructor(
        private network: Network,
        private urlResolver: Resolve,
        private messageProvider: MessageProvider,
        private globalEventsProvider: GlobalEventsProvider,
        private firebase: Firebase,
        private requestHeadersProvider: RequestHeadersProvider,
    ) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('UrlInterceptor', req);

        let url = req.url;
        let params = req.body || {};
        if (!url.startsWith('http')) {
            if (req.method === 'GET') {
                req.params.keys().forEach(key => params[key] = req.params.get(key));
            }

            url = encodeURI(this.urlResolver.url(url, params));
        }

        let headers = {};
        req.headers.keys().forEach(key => headers[key] = req.headers.get(key));
        headers = this.requestHeadersProvider.getHeaders(headers);

        let responseType: any = "json";
        if (headers['Content-type'] === 'application/jwt') {
            responseType = "text";
        }

        req = req.clone({ url, responseType, setHeaders: headers });

        return next.handle(req).timeout(HTTP_TIMEOUT * 1000).do(() => { }, err => {
            console.log('UrlInterceptor error:', err);

            this.handleError(req, headers, params, err);

        });
    }

    handleError(req: HttpRequest<any>, headers: any, params: any, originalError: any): void {
        originalError && console.info('originalError', originalError);
        originalError.rejection && console.info('error.rejection', originalError.rejection);

        let error = originalError.rejection || originalError;

        console.log('error', error);
        error.error && console.info('error.error', error.error);
        error.stack && console.info('error.stack', error.stack);
        error.getMessage && error.getMessage() && console.info('error.getMessage()', error.getMessage());

        if (this.network.type === 'none') {
            this.showMessage(NoConnectionError);
            return;
        }

        if (error instanceof TimeoutError) {
            this.sendErrorToAnalytics(req, headers, error, "Timeout");
            setTimeout(() => this.showMessage(DefaultServiceError));
            return;
        }

        if (isPresent(error.status) && isPresent(error.error)) {
            let message;
            if (error.headers && error.headers['content-type'] === 'application/json') {
                let payload = JSON.parse(error.error);
                if (payload && payload[0]) {
                    message = payload[0].message;
                }
            }
            if ([401, 403, 990, 992].indexOf(error.status) > -1) {

                this.sendErrorToAnalytics(req, headers, params, error);

                this.globalEventsProvider.onUnauthorized.next();
                setTimeout(() => this.showMessage('Falha na requisição. Por favor tente novamente.'));

                return;
            }

            if ([500].indexOf(error.status) > -1) {
                this.sendErrorToAnalytics(req, headers, params, error);
                this.showMessage(message || DefaultServiceError);
                return;
            }

            if (error.status === 0 && this.isOffline) {
                this.showMessage(NoConnectionError);
                return;
            }

            message = message || DefaultRequestError;

            this.showMessage(message);
            this.sendErrorToAnalytics(req, headers, params, error);
        }
    }

    showMessage(msg: string) {
        if (msg && msg.toLocaleLowerCase && msg.toLocaleLowerCase() === 'unknown') msg = DefaultRequestError;
        console.log('ErrorHandlerApp showMessage', msg);
        this.messageProvider.http(msg);
    }

    sendErrorToAnalytics(req: HttpRequest<any>, headers: any, params:any, error: any, customMessage?: string) {
        this.logFirebaseEvent(req, headers, params, error);
    }

    private logFirebaseEvent(req: HttpRequest<any>, headers: any, requestParams:any, err: any) {
        let request_headers = Object.assign({}, headers);
        delete request_headers['Authorization'];

        let error = err.error || err;

        let params: any = {
            url: `${req.method} ${req.url}`.substring(0, 99),
            error: JSON.stringify(error).substring(0, 99),
            status: err.status
        }

        let reqHeaders = {};
        let reqHeadersStringify = JSON.stringify(request_headers);
        if (reqHeadersStringify.length >= 100) {
            let reqHeadersMatch = reqHeadersStringify.match(/.{1,99}/g);
            reqHeadersMatch.forEach((line, index) => {
                reqHeaders[`request_headers_${index}`] = line;
            });

            Object.assign(params, reqHeaders);
        } else {
            params.request_headers = reqHeadersStringify;
        }

        let reqParams = {};
        let reqParamsStringify = JSON.stringify(requestParams);
        if (reqParamsStringify.length >= 100) {
            let reqParamsMatch = reqParamsStringify.match(/.{1,99}/g);
            reqParamsMatch.forEach((line, index) => {
                reqParams[`request_params_${index}`] = line;
            });

            Object.assign(params, reqParams);
        } else {
            params.request_params = reqParamsStringify;
        }

        console.log('Loggin Firebase event: service_error', params);

        this.firebase.logEvent('service_error', params);
    }

    private get isOffline() {
        return this.network.type === 'none' || isBlank(this.network.type);
    }

    private get isDevice() {
        return !!window['cordova'];
    }

}

export class NoConnectionException extends Error {

}
