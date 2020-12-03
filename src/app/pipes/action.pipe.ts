import { Pipe, PipeTransform } from '@angular/core';
import { Action } from '../models/action';

@Pipe({
  name: 'action'
})
export class ActionPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    switch (value) {
      case Action.acheter: return '#9b59b6';
      case Action.assembler: return '#2980b9';
      case Action.minerBar: return '#27ae60';
      case Action.minerFoo: return '#2c3e50';
      case Action.move: return '#f1c40f';
      case Action.vendre: return '#e74c3c';
    }
    return 'transparent';
  }

}
