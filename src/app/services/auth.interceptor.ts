import { HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(
        private tokenService: TokenService,
        private authService: AuthService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {

        if (req.url.includes('refresh_token')) {
            return next.handle(req);
        }
        const token = this.tokenService.getToken();
        if (token != null) {
            req = this.addTokenHeader(req, token);
        }
        return next.handle(req).pipe(catchError(error => {
            if (error instanceof HttpErrorResponse) {
                return this.handleError(req, next);
            }
            return throwError(error);
        }));

    }

    private handleError(request: HttpRequest<any>, next: HttpHandler) {

        const refreshToken = this.tokenService.getRefreshToken();
        if (refreshToken) {
            return this.authService.refreshToken(refreshToken).pipe(
                switchMap((refreshToken: any) => {
                    this.tokenService.saveToken(refreshToken.access_token);
                    this.refreshTokenSubject.next(refreshToken.access_token);
                    return next.handle(this.addTokenHeader(request, refreshToken.access_token));
                }),
                catchError((err) => {
                    localStorage.clear();
                    return throwError(err);
                })
            );
        } else {
            console.log('Token is not valid & there is not refresh-token');
        }

        return this.refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap((token) => next.handle(this.addTokenHeader(request, token)))
        );
    }

    private addTokenHeader(request: HttpRequest<any>, token: string) {
        return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
    }

}