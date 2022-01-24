var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var taskIdCounter = 0;
var tasks = [];

// taskFormHandler Function
var taskFormHandler = function(event) {
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // Check if input values are empty strings
    if (taskNameInput === "" || taskTypeInput === "") {
        alert("You need to fill out the task form!");
        return false;
    }

    //formEl.reset();
    // Reset form fields for next task to be entered
    document.querySelector("input[name='task-name']").value = "";
    document.querySelector("select[name='task-type']").selectedIndex = 0;

    // Check if task is new or one being edited by seeing if it has a data-task-id attribute
    var isEdit = formEl.hasAttribute("data-task-id");
    //console.log(isEdit);

    // Send it as an argument to createTaskEl
    //createTaskEl(taskDataObj);

    // Has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // No data attribute, so create object as normal and pass to createTaskEl function
    else {
        // Package up data as an object
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        }

        createTaskEl(taskDataObj);
    }
};

// createTaskEl Function
var createTaskEl = function(taskDataObj) {
    console.log(taskDataObj);
    console.log(taskDataObj.status);

    // Create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // Add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    // Create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    // Give it a class name
    taskInfoEl.className = "task-info";
    // Add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    // Using taskIdCounter as the argumnet, create corresponding buttons to the current task id
    var taskActionsEl = createTaskActions(taskIdCounter);
    //console.log(taskActionsEl);
    listItemEl.appendChild(taskActionsEl);

    // Add entire list item to list
    tasksToDoEl.appendChild(listItemEl);

    // Add taskIdCounter value as a property to the taskDataObj argument variable and add the entire object to the tasks array
    taskDataObj.id = taskIdCounter;

    tasks.push(taskDataObj);

    // Save tasks to localStorage
    saveTasks();

    // Increase task counter for next unique id
    taskIdCounter++;
};

// createTaskActions Function
var createTaskActions = function(taskId) {
    // Create container to hold elements
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // Create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // Create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    // Dropdown/<select> element
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    // Array of options
    var statusChoices = ["To Do", "In Progress", "Completed"];

    // For Loop for looping through options
    for (var i = 0; i < statusChoices.length; i++) {
        // Create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // Append to <select> element
        statusSelectEl.appendChild(statusOptionEl);
    }
    // Increase task counter for next unique id
    //taskIdCounter++;
    return actionContainerEl;
};

// completeEditTask = if isEdit is true then
var completeEditTask = function(taskName, taskType, taskId) {
    //console.log(taskName, taskType, taskId);

    // Find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // Set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    //debugger;
    // Loop through tasks array and task object with new content
    for (var i=0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };
    //debugger;

    // Save tasks to localStorage
    saveTasks();

    alert("Task Updated");

    // Reset the form by removing the task id and changing the button text back to normal
    formEl.removeAttribute("data-task-id");
    formEl.querySelector("#save-task").textContent = "Add Task";
};

var taskButtonHandler = function(event) {
    //console.log(event.target);
    // Get target element from event
    var targetEl = event.target;

    // Edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        console.log("edit", targetEl);
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    // Delete button was clicked
    else if (targetEl.matches(".delete-btn")) {
        console.log("delete", targetEl);
        // Get the element's task id
        var taskId = event.target.getAttribute("data-task-id");
        //console.log(taskId);
        deleteTask(taskId);
    }
};

// Once task is submitted choose a status - To Do, In Progress, or Completed
var taskStatusChangeHandler = function(event) {
    console.log(event.target.value);
    //console.log(event.target.getAttribute("data-task-id"));

    // Get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    // Find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id ='" + taskId + "']");

    // Get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    // Update task's in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    console.log(tasks);

    // Save tasks to localStorage
    saveTasks();
};

// Edit task function
var editTask = function(taskId) {
    console.log("editing task #" + taskId);

    // Get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // Get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    console.log(taskName);

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    console.log(taskType);

    // Write values of taskName and taskType to form to be edited
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    // Set data attribute to the form with a value of the task's id so it knows which one is being edited
    formEl.setAttribute("data-task-id", taskId);
    // Update form's button to reflect editing a task rather than creating a new one
    formEl.querySelector("#save-task").textContent = "Save Task";
};

// Delete Task Function
var deleteTask = function(taskId) {
    console.log(taskId);
    // Find task list element with taskId value and remove it
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId +  "']");
    //console.log(taskSelected);
    taskSelected.remove();

//    if (event.target.matches(".delete-btn")) {
//        var taskId = event.target.getAttribute("data-task-id");
//        deleteTask(taskId);
//    }

    // Create new array to hold update list of tasks
    var updatedTaskArr = [];

    // Loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        // If tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
         if (tasks[i].id !== parseInt(taskId)) {
             updatedTaskArr.push(tasks[i]);
         }
    }

    // Rassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

    // Save tasks to localStorage
    saveTasks();
};

// Save tasks to localStorage
var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Create a new task
formEl.addEventListener("submit", taskFormHandler);

// For edit and delete buttons
pageContentEl.addEventListener("click", taskButtonHandler);

// For changing the status
pageContentEl.addEventListener("change", taskStatusChangeHandler);