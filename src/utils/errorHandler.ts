import {HttpErrors} from '@loopback/rest';

export class ErrorHandler {
  constructor(code: number, message: string) {
    throw new HttpErrors[code](message);
  }
}
