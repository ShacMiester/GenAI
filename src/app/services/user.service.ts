import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CreateUserRequest } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  createUser(userRequest: CreateUserRequest): Observable<any> {
    return of({
      success: true,
      message: 'User created successfully'
    }).pipe(delay(500));
  }
}
