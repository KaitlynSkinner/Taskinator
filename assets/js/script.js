var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var taskIdCounter = 0;

// taskFormHandler Function
var taskFormHandler = function(event) {
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // Check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    formEl.reset();

    // Package up data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };

    // Send it as an argument to createTaskEl
    createTaskEl(taskDataObj);
};

// createTaskEl Function
var createTaskEl = function(taskDataObj) {
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

    // Increase task counter for next unique id
    taskIdCounter++;
};

// createTaskActions Function
var createTaskActions = function(taskId) {
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

    return actionContainerEl;
};

formEl.addEventListener("submit", taskFormHandler);

var taskButtonHandler = function(event) {
    //console.log(event.target);
    // Get target element from event
    var targetEl = event.target;

    // Edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }

    // Delete button was clicked
    if (event.target.matches(".delete-btn")) {
        // Get the element's task id
        var taskId = event.target.getAttribute("data-task-id");
        //console.log(taskId);
        deleteTask(taskId);
    }
};

// Edit task function
var editTask = function(taskId) {
    console.log("editing task #" + taskId);

    // Get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // Get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    //console.log(taskName);

    var taskType = taskSelected.querySelector("span.task-type").textContent;
   
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";

    formEl.setAttribute("data-task-id", taskId);
};

// Delete Task Function
var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId +  "']");
    //console.log(taskSelected);
    taskSelected.remove();

//    if (event.target.matches(".delete-btn")) {
//        var taskId = event.target.getAttribute("data-task-id");
//        deleteTask(taskId);
//    }
};

pageContentEl.addEventListener("click", taskButtonHandler);