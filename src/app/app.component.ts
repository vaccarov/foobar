import { Component, OnInit } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { Action } from './models/action';
import { Robot } from './models/robot';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // Robots interactifs
  robots: Robot[];
  // Liste des actions possibles
  actions: {
    key: string;
    value: Action
  }[] = Object.keys(Action).map((a: string) => ({key: a, value: Action[a]}));
  // Items
  foos: number = 0;
  bars: number = 0;
  foobar: number = 0;
  argent: number = 0;

  ngOnInit() {
    // Commencer avec 2 robots
    this.robots = [{
      id: 0,
      actions: [],
      indisponible: 0
    }, {
      id: 1,
      actions: [],
      indisponible: 0
    }];
  }

  // Quand on click sur une action via le robot
  lancer(robot: Robot, action: string) {
    // Avant tout, le robot doit attendre 5sec (Action.move)
    if (!robot.actions.length && action !== Action.move)
      robot.actions.push(Action.move);
    // Puis ajouter l'action voulue
    robot.actions.push(action);
    // Lancer la production (uniquement quand le robot est disponible)
    if (!robot.indisponible)
      this.faireTravaillerRobot(robot);
  }

  private faireTravaillerRobot(robot: Robot) {
    // Envoyer le robot au charbon en fonction de la tâche à effectuer
    switch (robot.actions[0]) {
      case Action.acheter: this.acheter(robot); break;
      case Action.assembler: this.assembler(robot); break;
      case Action.minerBar: this.minerBar(robot); break;
      case Action.minerFoo: this.minerFoo(robot); break;
      case Action.move: this.move(robot); break;
      case Action.vendre: this.vendre(robot); break;
    }
  }

  private setTimerRobot(robot: Robot): Observable<number> {
    // Rendre le robot occupé pendant une période définie
    return timer(robot.indisponible * 1000).pipe(take(1))
  }

  private minerFoo(robot: Robot) {
    robot.indisponible = 1;
    this.setTimerRobot(robot).subscribe(
      () => {
        this.foos++
        this.doitContinuer(robot);
      }
    );
  }

  private minerBar(robot: Robot) {
    // Nombre aléatoire entre 0.5 et 2
    robot.indisponible = Math.random() * (1.5) + 0.5;
    this.setTimerRobot(robot).subscribe(
      () => {
        this.bars++;
        this.doitContinuer(robot);
      }
    );
  }

  private move(robot: Robot) {
    robot.indisponible = 5;
    this.setTimerRobot(robot).subscribe(
      () => this.doitContinuer(robot)
    );
  }

  private assembler(robot: Robot) {
    if (this.foos > 0 && this.bars > 0) {
      robot.indisponible = 2;
      this.setTimerRobot(robot).subscribe(
        () => {
          this.foos--;
          if (Math.random() < 0.6) {
            this.bars--;
            this.foobar++;
          }
          this.doitContinuer(robot);
        }
      );
    } else {
      console.log('Pas assez de ressources pour assembler');
      this.doitContinuer(robot);
    }
  }

  private vendre(robot: Robot) {
    if (this.foobar) {
      robot.indisponible = 10;
      this.setTimerRobot(robot).subscribe(
        () => {
          const foobarVendu: number = Math.min(5, this.foobar);
          this.foobar -= foobarVendu;
          this.argent += foobarVendu;        
          this.doitContinuer(robot);
        }
      );
    } else {
      console.log('Pas assez de ressources pour vendre');
      this.doitContinuer(robot);
    }
  }

  private acheter(robot: Robot) {
    if (this.argent >= 3 && this.foos >= 6) {
      this.argent -= 3;
      this.foos -= 6;
      this.robots.push({
        id: this.robots.length,
        actions: [],
        indisponible: 0
      });
      if (this.robots.length === 20) alert('Bien joué')
    } else {
      console.log('Pas assez de ressources pour acheter');
    }
    this.doitContinuer(robot);
  }

  // Lorsque le robot termine une tâche
  private doitContinuer(robot: Robot) {
    // A nouveau disponible
    robot.indisponible = 0;
    // Récupérer la dernière tâche
    const lastAction: string = robot.actions.shift();
    if (robot.actions.length) {
      // Si la prochaine action dans la pile diffère de la derniere, intercaler l'action 'move'
      if (![robot.actions[0], Action.move].includes(lastAction))
        robot.actions.unshift(Action.move);
      // Si la pile n'est pas vide, passer à la prochaine tâche
      this.faireTravaillerRobot(robot);
    }
  }
}