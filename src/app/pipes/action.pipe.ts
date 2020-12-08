import { Pipe, PipeTransform } from '@angular/core';
import { Action } from '../models/action';

@Pipe({
  name: 'action'
})
export class ActionPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    switch (value) {
      case Action.buy: return '#9b59b6';
      case Action.buildFoobar: return '#2980b9';
      case Action.mineBar: return '#27ae60';
      case Action.mineFoo: return '#2c3e50';
      case Action.move: return '#f1c40f';
      case Action.sell: return '#e74c3c';
    }
    return 'transparent';
  }

}
