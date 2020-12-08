import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { Action } from '../models/action';
import { Robot } from '../models/robot';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  // Interactive robots
  robots: Robot[];
  // Items
  foos: number = 0;
  bars: number = 0;
  foobar: number = 0;
  money: number = 0;

  constructor() { }

  letRobotWork(robot: Robot) {
    // Choose the correct action depending on the first item of the action array
    switch (robot.actions[0]) {
      case Action.buy: this.buy(robot); break;
      case Action.buildFoobar: this.buildFoobar(robot); break;
      case Action.mineBar: this.mineBar(robot); break;
      case Action.mineFoo: this.mineFoo(robot); break;
      case Action.move: this.move(robot); break;
      case Action.sell: this.sell(robot); break;
    }
  }

  // When robot ends an action
  shouldRobotContinue(robot: Robot) {
    // Robot is available
    robot.unavailability = 0;
    // Get last action and removes it
    const lastAction: Action = robot.actions.shift() as Action;
    if (robot.actions.length) {
      // If next action is different than last one, add 'move' Action between
      if (![robot.actions[0], Action.move].includes(lastAction))
        robot.actions.unshift(Action.move);
      // If list isn't empty, go to the next action
      this.letRobotWork(robot);
    }
  }
  
  // Set robot unavailable for given time
  private setTimerRobot = (robot: Robot): Observable<number> =>
    timer(robot.unavailability * 1000).pipe(take(1))

  mineFoo(robot: Robot) {
    robot.unavailability = 1;
    this.setTimerRobot(robot).subscribe(() => {
      this.foos++
      this.shouldRobotContinue(robot);
    });
  }

  mineBar(robot: Robot) {
    // Random number betweeen 0.5 et 2
    robot.unavailability = Math.random() * (1.5) + 0.5;
    this.setTimerRobot(robot).subscribe(() => {
      this.bars++;
      this.shouldRobotContinue(robot);
    });
  }

  move(robot: Robot) {
    robot.unavailability = 5;
    this.setTimerRobot(robot).subscribe(
      () => this.shouldRobotContinue(robot)
    );
  }

  buildFoobar(robot: Robot) {
    if (this.foos > 0 && this.bars > 0) {
      robot.unavailability = 2;
      this.setTimerRobot(robot).subscribe(() => {
        this.foos--;
        if (Math.random() < 0.6) {
          this.bars--;
          this.foobar++;
        }
        this.shouldRobotContinue(robot);
      });
    } else {
      console.log('Not enough ressources for bulding Foobar');
      this.shouldRobotContinue(robot);
    }
  }

  sell(robot: Robot) {
    if (this.foobar) {
      robot.unavailability = 10;
      this.setTimerRobot(robot).subscribe(() => {
        const foobarSold: number = Math.min(5, this.foobar);
        this.foobar -= foobarSold;
        this.money += foobarSold;
        this.shouldRobotContinue(robot);
      });
    } else {
      console.log('Not enough ressources for selling');
      this.shouldRobotContinue(robot);
    }
  }

  buy(robot: Robot) {
    if (this.money >= 3 && this.foos >= 6) {
      this.money -= 3;
      this.foos -= 6;
      this.robots.push({
        id: this.robots.length,
        actions: [],
        unavailability: 0
      });
      if (this.robots.length === 20)
        alert('Game finished')
    } else {
      console.log('Not enough ressources for buying robot');
    }
    this.shouldRobotContinue(robot);
  }
}
