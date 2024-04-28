// Array to store tasks
let tasks = [];

// Load tasks from local storage
function loadTasks() {
  const tasksString = localStorage.getItem('tasks');
  if (tasksString) {
    tasks = JSON.parse(tasksString);
  }
}

// Save tasks to local storage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Find index of task in the tasks array
function findTaskIndex(taskId) {
  return tasks.findIndex((task) => task.id === taskId);
}

// Create a new task object
function createTask(name, date, category) {
  const task = {
    id: Date.now().toString(),
    name: name,
    date: date,
    category: category,
    completed: false,
  };

  tasks.push(task);
  return task;
}

// Delete a task from the tasks array
function deleteTask(taskId) {
  const taskIndex = findTaskIndex(taskId);
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    const taskElement = document.getElementById('task-' + taskId);
    taskElement.parentNode.removeChild(taskElement);
    saveTasks();
  }
}

// Get the tasks list element based on category
function getTasksListElement(category) {
  return category === 'urgent'
    ? document.querySelector('.urgent-works-section ul')
    : document.querySelector('.anytime-works-section ul');
}

// Get the completed tasks list element based on category
function getCompletedTasksListElement(category) {
  return category === 'urgent'
    ? document.querySelector('.completed-urgent-works-section ul')
    : document.querySelector('.completed-anytime-works-section ul');
}

// Render a task
function renderTask(task) {
  const li = createTaskElement(task);
  const checkbox = li.querySelector('.task-checkbox');
  checkbox.addEventListener('change', function () {
    if (checkbox.checked) {
      completeTask(task.id);
    } else {
      uncompleteTask(task.id);
    }
  });

  const tasksList = task.completed
    ? getCompletedTasksListElement(task.category)
    : getTasksListElement(task.category);

  tasksList.appendChild(li);
}

// Create an HTML element for a task
function createTaskElement(task) {
  const li = document.createElement('li');
  li.id = 'task-' + task.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';

  const taskName = document.createElement('span');
  taskName.className = 'task-name';
  taskName.textContent = task.name;

  const taskDate = document.createElement('span');
  taskDate.className = 'task-date';
  taskDate.textContent = task.date;

  li.appendChild(checkbox);
  li.appendChild(taskName);
  li.appendChild(taskDate);

  if (!task.completed) {
    const doneButton = document.createElement('button');
    doneButton.className = 'done-button';
    doneButton.textContent = 'Done';
    doneButton.addEventListener('click', function () {
      completeTask(task.id);
    });

    li.appendChild(doneButton);
  } else {
    li.classList.add('completed'); 
    checkbox.checked = true;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function () {
      deleteTask(task.id);
    });

    li.appendChild(deleteButton);
  }

  checkbox.addEventListener('change', function () {
    if (checkbox.checked) {
      completeTask(task.id);
    } else {
      uncompleteTask(task.id);
    }
  });

  return li;
}

// Render all tasks
function renderTasks() {
  const urgentTasksList = document.querySelector('.urgent-works-section ul');
  const anytimeTasksList = document.querySelector('.anytime-works-section ul');
  const completedUrgentTasksList = document.querySelector('.completed-urgent-works-section ul');
  const completedAnytimeTasksList = document.querySelector('.completed-anytime-works-section ul');

  urgentTasksList.innerHTML = '';
  anytimeTasksList.innerHTML = '';
  completedUrgentTasksList.innerHTML = '';
  completedAnytimeTasksList.innerHTML = '';

  tasks.forEach(function (task) {
    if (!task.completed) {
      renderTask(task);
    } else {
      const li = createTaskElement(task);
      const deleteButton = li.querySelector('.delete-button');
      deleteButton.addEventListener('click', function () {
        deleteTask(task.id);
      });

      li.classList.add('completed'); 
      const completedTasksList = getCompletedTasksListElement(task.category);
      completedTasksList.appendChild(li);
      const checkbox = li.querySelector('.task-checkbox');
      checkbox.addEventListener('change', function () {
        uncompleteTask(task.id);
      });
    }
  });
} 

// Complete a task
function completeTask(taskId) {
  const taskIndex = findTaskIndex(taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = true;
    saveTasks();
    renderTasks();
  }
}

// Uncomplete a task
function uncompleteTask(taskId) {
  const taskIndex = findTaskIndex(taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = false;
    saveTasks();
    renderTasks();
  }
}

// Handle form submission
document.querySelector('#add-button').addEventListener('click', function (e) {
  e.preventDefault();
  const taskNameInput = document.querySelector('#task-input');
  const taskDateInput = document.querySelector('#task-date');
  const taskCategoryInput = document.querySelector('input[name="category"]:checked');

  const taskName = taskNameInput.value;
  const taskDate = taskDateInput.value;
  const taskCategory = taskCategoryInput ? taskCategoryInput.value : '';

  if (taskName && taskDate && taskCategory) {
    const selectedDate = new Date(taskDate);
    const minDate = new Date('2020-01-01');
    const maxDate = new Date('2100-12-31');
    const year = selectedDate.getFullYear();
    const yearDigits = String(year).length;

    if (selectedDate >= minDate && selectedDate <= maxDate && yearDigits === 4) {
      const task = createTask(taskName, taskDate, taskCategory);
      renderTask(task);
      taskNameInput.value = '';
      taskDateInput.value = '';
      taskCategoryInput.checked = false;
      saveTasks();
    } else {
      alert('Please select a date between 2020 and 2100.');
    }
  } else {
    alert('Please fill in all the fields.');
  }
});

// Load and render tasks when the page is loaded
window.addEventListener('DOMContentLoaded', function () {
  loadTasks();
  renderTasks();
});
