import { Component, OnInit } from '@angular/core';
import { Action } from './models/action';
import { Robot } from './models/robot';
import { ActionsService } from './services/actions.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // Possible action list
  actions: {
    key: string;
    value: Action;
  }[] = Object.keys(Action).map((a: string) => ({key: a, value: Action[a]}));

  constructor(
    public actionService: ActionsService
  ) {}

  ngOnInit() {
    // Start with 2 robots
    this.actionService.robots = [{
      id: 0,
      actions: [],
      unavailability: 0
    }, {
      id: 1,
      actions: [],
      unavailability: 0
    }];
  }

  // An action is triggered by the user
  launch(robot: Robot, action: string) {
    // Wait 5 seconds (Action.move)
    if (!robot.actions.length && action !== Action.move)
      robot.actions.push(Action.move);
    // Then add desired action
    robot.actions.push(action);
    // Start production (only when robot is available)
    if (!robot.unavailability)
      this.actionService.letRobotWork(robot);
  }
}