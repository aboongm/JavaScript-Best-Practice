import './styles/style.css';
import {
  Task,
  addTask,
  removeTask,
  checkLocalStorage,
  displayContent,
} from './module/utilityFunctions.js';
import * as Elements from './module/constElements.js';
import { completed, clearCompletedTasks, editTask } from './module/checkbox.js';

// add task from submit
Elements.submitInput.addEventListener('click', addTask);

// add task by pressing Enter Key
Elements.taskInput.addEventListener('keypress', (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    addTask();
  }
});

// clear all task
Elements.refreshTask.addEventListener('click', (e) => {
  e.preventDefault();
  Task.TaskObject = [];
  localStorage.setItem('TASKS_LIST', JSON.stringify(Task.TaskObject));
  checkLocalStorage();
});

// tasklist functionalities
Elements.taskList.addEventListener('click', (e) => {
  // e.stopPropagation();

  [...Elements.taskList.children].forEach((item, index) => {
    // all tasks to default ui
    if (item.classList.contains('bg-yellow')) {
      item.children[1].classList.remove('hide');
      item.children[2].classList.add('hide');
      item.classList.remove('bg-yellow');
    }
    // selected task applied styles
    if (index === parseInt(e.target.getAttribute('data-id'), 10)) {
      item.children[1].classList.add('hide');
      item.children[2].classList.remove('hide');
      item.classList.add('bg-yellow');
    }

    // click on description applies styles on the task ui
    const descriptionItem = item.children[0].children[1];
    const targetItem = e.target.parentElement.parentElement.parentElement;

    if (targetItem) {
      if (
        !targetItem.classList.contains('bg-yellow')
        && descriptionItem === e.target
      ) {
        item.children[1].classList.add('hide');
        item.children[2].classList.remove('hide');
        item.classList.add('bg-yellow');
        descriptionItem.classList.add('bg-yellow');
      }
    }

    // update the check checkbox to local storage
    const checkStatus = item.firstElementChild.firstElementChild.checked;
    if (
      index
      === parseInt(e.target.parentElement.parentElement.getAttribute('data-id'), 10)
    ) {
      completed(index, checkStatus);
    }
  });

  const trash = document.querySelectorAll('.trash');
  trash.forEach((deleteBtn, trashInd) => {
    deleteBtn.addEventListener('click', (e1) => {
      e1.stopPropagation();
      // e.preventDefault();
      const targetId = e1.target.parentElement;
      if (parseInt(targetId.getAttribute('data-id'), 10) === trashInd) {
        removeTask(e1.target.parentElement);
      }
    });
  });

  // edit the task
  const taskDescription = document.querySelectorAll('.description');
  taskDescription.forEach((description, index) => {
    if (
      index
      === parseInt(
        description.parentElement.parentElement.getAttribute('data-id'),
        10,
      )
    ) {
      description.addEventListener('input', (e) => {
        editTask(e.target.value, index);
      });
    }
  });
});

document.addEventListener('click', (e) => {
  [...Elements.taskList.children].forEach((item) => {
    const isClickInsideTaskList = Elements.taskList.contains(e.target);
    if (!isClickInsideTaskList) {
      item.children[1].classList.remove('hide');
      item.children[2].classList.add('hide');
      item.classList.remove('bg-yellow');
    }
  });

  // // clear all checked checkboxes
  Elements.clear.addEventListener('click', (e) => {
    clearCompletedTasks(e.target);
    displayContent();
  });
});

document.addEventListener('DOMContentLoaded', checkLocalStorage);
