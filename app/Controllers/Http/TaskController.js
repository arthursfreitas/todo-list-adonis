"use strict";

const Task = require("../../Models/Task");
const { validateAll } = use("Validator");

const Tasks = use("App/Models/Task");

class TaskController {
  async index({ view }) {
    const tasks = await Tasks.all();

    return view.render("tasks", {
      title: "Latest tasks",
      tasks: tasks.toJSON(),
    });
  }

  async store({ request, response, session }) {
    const message = {
      "title.required": "Required",
      "title.min": "min 3",
    };

    const validation = await validateAll(
      request.all(),
      {
        title: "required|min:5|max:140",
        body: "required|min:10",
      },
      message
    );

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();
      return response.redirect("back");
    }

    const task = new Task();

    task.title = request.input("title");
    task.body = request.input("body");

    await task.save();

    session.flash({ notification: "Task added!" });

    return response.redirect("/tasks");
  }

  async detail({ params, view }) {
    const task = await Task.find(params.id);

    return view.render("detail", {
      task,
    });
  }

  async destroy({ params, response, session }){
    
  }
}

module.exports = TaskController;
