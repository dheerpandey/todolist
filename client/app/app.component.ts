import { Component } from '@angular/core';
import {TaskService} from './services/task.service';
@Component({
  moduleId: module.id,
  selector: 'todo',
  templateUrl: 'app.component.html',
  providers : [TaskService]
})

export class AppComponent { }