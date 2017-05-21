import {Component} from '@angular/core';
import {TaskService} from '../../services/task.service';
import {Task} from '../../../models/models.task';
@Component({
    moduleId: module.id,
    selector : 'tasks',
    templateUrl : 'tasks.component.html'
})

export class TasksComponent {
tasks: Task[];
title: string;
constructor(private taskService:TaskService){
        this.taskService.getTasks()
            .subscribe(t => {
            this.tasks =t;
        });
}

addTask(event)
{
event.preventDefault();
var newTask = {title: this.title,
    isDone: false
};
this.taskService.addTask(newTask).subscribe(t=>{
    this.tasks.push(t);
    this.title='';
});
}

updateTask(task)
{
    var _task = {
        _id : task._id,
        title : task.title,
        isDone : !task.isDone
    };
 
 this.taskService.updateTask(_task).subscribe(t=>{
    task.isDone =!t.isDone;
 });
}

deleteTask(id)
{
    var tasks = this.tasks;
    this.taskService.deleteTask(id).subscribe(t=>{
       if (t.n == 1) {
         for (var i = 0; i < tasks.length; i++) {
             if (tasks[i]._id == id) {
                 tasks.splice(i,1);
             }
         }  
       }
    });
}

}



