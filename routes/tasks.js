var express = require("express");
var routes = express.Router();
var mongojs = require("mongojs");

var db = mongojs("mongodb://<your-username>:<your-password>@ds147821.mlab.com:47821/mean_todb_db",["tasks"]);

routes.get("/tasks",function(req, res, next){
    db.tasks.find(function(err, tasks)
    {
        if(err)
        {
            res.send(err);
        }
        res.json(tasks);
    });

});

routes.get("/task/:id",function(req, res, next){
    db.tasks.findOne({_id : mongojs.ObjectId(req.params.id)},function(err, task)
    {
        if(err)
        {
            res.send(err);
        }
        res.json(task);
    });

});

routes.post("/task", function(req, res, next){
    var task = req.body;
    if(!task.title)
    {
        res.status(400);
        res.json({"error" : "Bad Request !!!"});        
    }else
    {
        db.tasks.save(task, function(err, task){
            if(err)
            {
            res.send(err);
            }
            else
            {
            res.json(task);
            } 
        });
    }

});

routes.put("/task/:id", function(req, res, next){
    var task = req.body;
    var uptask = {};
    if(task.title)
    {
        uptask.title = task.title;
    }
    if(task.isDone)
    {
        uptask.isDone = task.isDone;
    }

    if(!uptask)
    {
        res.status(400);
        res.send({"Error":"Bad Request"});
    }else{
        db.tasks.update({_id : mongojs.ObjectId(req.params.id)},uptask,{},function(err, task){
            if(err)
            {
                res.send(err);
            }
            res.json(task);
        });
    }
});


routes.delete("/task/:id",function(req, res, next){
    db.tasks.remove({_id : mongojs.ObjectId(req.params.id)}, function(err, task){
        if(err)
        {
            res.send(err);
        }
     res.json(task);
    });
});



module.exports = routes;