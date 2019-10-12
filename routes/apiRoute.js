var db = require("../models");

module.exports = function(app) {
  app.get("/projects", function(req, res) {
    // res.render("newprojects")
    res.send("This is add new project page!");
  });

  app.post("/projects", function(req, res) {
    db.Project.create(req.body).then(function(result) {
      /* result will be like below:
      {"id":1,"name":"Sunny's birthday Party","description":"a nice small party for Sunny",
      "projectDate":"2019-12-12","creatorName":"Elisa","ProjectTypeId":"1",
      "updatedAt":"2019-10-12T00:52:36.141Z","createdAt":"2019-10-12T00:52:36.141Z"}
      Also got an error on terminal about moment.js regarding project date
      */
      var projectTypeId = result.ProjectTypeId;
      var projectId = result.id;

      addTemplateTaskToProject(projectTypeId, projectId);

      res.json(result);
    });
  });

  app.delete("/projects/:id", function(req, res) {
    db.Project.destroy({ where: { id: req.params.id } }).then(function(result) {
      res.json(result);
      // result is number 1
    });
  });

  app.get("/projects/:id", function(req, res) {
    db.Task.findAll({
      where: { ProjectId: req.params.id },
      order: [["CategoryTypeId", "ASC"]]
    }).then(function(result) {
      res.json(result);
      /* result will be an array of task objects ordered by task's category type
      [
    {
        "id": 2,
        "description": "task b",
        "completed": false,
        "completeByDate": "2019-11-10",
        "createdAt": "2019-10-12T04:01:45.000Z",
        "updatedAt": "2019-10-12T04:01:45.000Z",
        "ProjectId": 2,
        "CategoryTypeId": 1
    },
    {
        "id": 1,
        "description": "task a",
        "completed": false,
        "completeByDate": "2019-11-01",
        "createdAt": "2019-10-12T04:00:17.000Z",
        "updatedAt": "2019-10-12T04:00:17.000Z",
        "ProjectId": 2,
        "CategoryTypeId": 3
    }
]
    */
    });
  });

  app.post("/tasks", function(req, res) {
    db.Task.create(req.body).then(function(result) {
      res.json(result);
      /* result returned is
      {"completed":false,"id":1,"description":"task a","completeByDate":"2019-11-01",
      "ProjectId":"2","CategoryTypeId":"3","updatedAt":"2019-10-12T04:00:17.549Z",
      "createdAt":"2019-10-12T04:00:17.549Z"}
      */
    });
  });

  app.put("/tasks/:id", function(req, res) {
    var updateObj = {};

    if (req.body.description) {
      updateObj.description = req.body.description;
    }

    if (req.body.completed) {
      updateObj.completed = req.body.completed;
    }

    if (req.body.completeByDate) {
      updateObj.completeByDate = req.body.completeByDate;
    }

    if (req.body.CategoryTypeId) {
      updateObj.CategoryTypeId = req.body.CategoryTypeId;
    }

    db.Task.update(updateObj, {
      where: { id: req.params.id }
    }).then(function(result) {
      res.json(result);
      // result is an array with a number 1
    });
  });

  app.delete("/tasks/:id", function(req, res) {
    db.Task.destroy({ where: { id: req.params.id } }).then(function(result) {
      res.json(result);
      // result is number 1
    });
  });

  function addTemplateTaskToProject(ProjectTypeId, ProjectId) {
    db.TemplateTask.findAll({
      where: { ProjectTypeId: ProjectTypeId },
      order: [["CategoryTypeId", "ASC"]]
    }).then(function(results) {
      // results is an array of template task objects

      for (var i = 0; i < results.length; i++) {
        var taskObj = {};

        taskObj.description = results[i].description;
        taskObj.ProjectId = ProjectId;
        taskObj.CategoryTypeId = results[i].CategoryTypeId;

        db.Task.create(taskObj)
          .then(function() {
            /* result returned is the newly ceated task object
          {"completed":false,"id":1,"description":"task a","completeByDate":"2019-11-01",
          "ProjectId":"2","CategoryTypeId":"3","updatedAt":"2019-10-12T04:00:17.549Z",
          "createdAt":"2019-10-12T04:00:17.549Z"}
          */
          })
          .catch(function(error) {
            if (error) {
              return false;
            }
          });
      }
    });
    return true;
  }
};
