import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class GlobalEventsProvider {

  onUnauthorized: EventEmitter<any> = new EventEmitter();

}
