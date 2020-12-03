import { Component, Input, OnInit } from '@angular/core';
import { Action } from '../models/action';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  @Input() status: Action;
  
  constructor() { }

  ngOnInit(): void {
  }

}
