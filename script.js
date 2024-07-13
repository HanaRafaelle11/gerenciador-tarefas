// script.js

// Seletores de elementos
const taskInput = document.getElementById('task-input');
const taskDueDate = document.getElementById('task-due-date');
const taskCategory = document.getElementById('task-category');
const taskPriority = document.getElementById('task-priority');
const taskFile = document.getElementById('task-file');
const addTaskButton = document.getElementById('add-task-button');
const taskList = document.getElementById('task-list-container');
const allTasksButton = document.getElementById('all-tasks-button');
const pendingTasksButton = document.getElementById('pending-tasks-button');
const completedTasksButton = document.getElementById('completed-tasks-button');
const filterCategory = document.getElementById('filter-category');
const filterPriority = document.getElementById('filter-priority');
const sortByDateButton = document.getElementById('sort-by-date-button');
const toggleThemeButton = document.getElementById('toggle-theme-button');
const pendingCount = document.createElement('div');
const completedCount = document.createElement('div');
const changeLog = document.getElementById('change-log-list');

// Adicionar contadores de tarefas ao main
document.querySelector('main').insertBefore(pendingCount, document.querySelector('#task-list'));
document.querySelector('main').insertBefore(completedCount, document.querySelector('#task-list'));

// Função para carregar as tarefas do localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const { text, completed, dueDate, category, priority, file } = task;
        const taskItem = createTask(text, completed, dueDate, category, priority, file);
        taskList.appendChild(taskItem);
    });
    updateCategoryFilter();
    updatePriorityFilter();
    updateCounters();
}

// Função para salvar as tarefas no localStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(taskItem => {
        const text = taskItem.querySelector('span').textContent;
        const completed = taskItem.classList.contains('completed');
        const dueDate = taskItem.getAttribute('data-due-date');
        const category = taskItem.getAttribute('data-category');
        const priority = taskItem.getAttribute('data-priority');
        const file = taskItem.querySelector('img') ? taskItem.querySelector('img').src : '';
        tasks.push({ text, completed, dueDate, category, priority, file });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para criar uma nova tarefa
function createTask(text, completed = false, dueDate = '', category = '', priority = '', file = '') {
    const taskItem = document.createElement('li');
    taskItem.className = `task-item${completed ? ' completed' : ''}`;
    taskItem.setAttribute('data-due-date', dueDate);
    taskItem.setAttribute('data-category', category);
    taskItem.setAttribute('data-priority', priority);
    taskItem.setAttribute('draggable', true);

    const taskText = document.createElement('span');
    taskText.textContent = text;
    taskItem.appendChild(taskText);

    if (file) {
        const taskImage = document.createElement('img');
        taskImage.src = file;
        taskItem.appendChild(taskImage);
    }

    const checkButton = document.createElement('button');
    checkButton.textContent = completed ? 'Desmarcar' : 'Concluir';
    checkButton.addEventListener('click', () => {
        if (taskItem.classList.contains('completed')) {
            taskItem.classList.remove('completed');
            checkButton.textContent = 'Concluir';
        } else {
            taskItem.classList.add('completed');
            checkButton.textContent = 'Desmarcar';
        }
        saveTasks();
        updateCounters();
    });
    taskItem.appendChild(checkButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', () => {
        if (confirm('Você tem certeza que deseja excluir esta tarefa?')) {
            taskItem.remove();
            saveTasks();
            updateCounters();
        }
    });
    taskItem.appendChild(deleteButton);

    return taskItem;
}

// Adicionar uma nova tarefa
addTaskButton.addEventListener('click', () => {
    const text = taskInput.value.trim();
    const dueDate = taskDueDate.value;
    const category = taskCategory.value;
    const priority = taskPriority.value;
    const file = taskFile.files[0] ? URL.createObjectURL(taskFile.files[0]) : '';

    if (text === '') {
        alert('Por favor, digite uma tarefa.');
        return;
    }

    const taskItem = createTask(text, false, dueDate, category, priority, file);
    taskList.appendChild(taskItem);
    saveTasks();
    updateCounters();
    taskInput.value = '';
    taskDueDate.value = '';
    taskCategory.value = '';
    taskPriority.value = '';
    taskFile.value = '';
    updateCategoryFilter();
    updatePriorityFilter();
    addChangeLog(`Tarefa "${text}" adicionada.`);
});

// Filtros de Tarefas
allTasksButton.addEventListener('click', () => {
    document.querySelectorAll('.task-item').forEach(taskItem => {
        taskItem.style.display = 'flex';
    });
});

pendingTasksButton.addEventListener('click', () => {
    document.querySelectorAll('.task-item').forEach(taskItem => {
        if (taskItem.classList.contains('completed')) {
            taskItem.style.display = 'none';
        } else {
            taskItem.style.display = 'flex';
        }
    });
});

completedTasksButton.addEventListener('click', () => {
    document.querySelectorAll('.task-item').forEach(taskItem => {
        if (taskItem.classList.contains('completed')) {
            taskItem.style.display = 'flex';
        } else {
            taskItem.style.display = 'none';
        }
    });
});

filterCategory.addEventListener('change', () => {
    const selectedCategory = filterCategory.value;
    document.querySelectorAll('.task-item').forEach(taskItem => {
        if (selectedCategory === '' || taskItem.getAttribute('data-category') === selectedCategory) {
            taskItem.style.display = 'flex';
        } else {
            taskItem.style.display = 'none';
        }
    });
});

filterPriority.addEventListener('change', () => {
    const selectedPriority = filterPriority.value;
    document.querySelectorAll('.task-item').forEach(taskItem => {
        if (selectedPriority === '' || taskItem.getAttribute('data-priority') === selectedPriority) {
            taskItem.style.display = 'flex';
        } else {
            taskItem.style.display = 'none';
        }
    });
});

sortByDateButton.addEventListener('click', () => {
    const tasks = Array.from(document.querySelectorAll('.task-item'));
    tasks.sort((a, b) => {
        const dateA = new Date(a.getAttribute('data-due-date'));
        const dateB = new Date(b.getAttribute('data-due-date'));
        return dateA - dateB;
    });
    tasks.forEach(task => taskList.appendChild(task));
    saveTasks();
    updateCounters();
});

// Mudar tema
let darkMode = false;
toggleThemeButton.addEventListener('click', () => {
    darkMode = !darkMode;
    if (darkMode) {
        document.body.classList.add('dark-theme');
        toggleThemeButton.textContent = 'Tema Claro';
    } else {
        document.body.classList.remove('dark-theme');
        toggleThemeButton.textContent = 'Tema Escuro';
    }
});

// Atualizar filtros de categoria e prioridade
function updateCategoryFilter() {
    const categories = new Set();
    document.querySelectorAll('.task-item').forEach(taskItem => {
        categories.add(taskItem.getAttribute('data-category'));
    });
    filterCategory.innerHTML = '<option value="">Filtrar por Categoria</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        filterCategory.appendChild(option);
    });
}

function updatePriorityFilter() {
    const priorities = new Set();
    document.querySelectorAll('.task-item').forEach(taskItem => {
        priorities.add(taskItem.getAttribute('data-priority'));
    });
    filterPriority.innerHTML = '<option value="">Filtrar por Prioridade</option>';
    priorities.forEach(priority => {
        const option = document.createElement('option');
        option.value = priority;
        option.textContent = priority;
        filterPriority.appendChild(option);
    });
}

// Atualizar contadores
function updateCounters() {
    const totalTasks = document.querySelectorAll('.task-item').length;
    const completedTasks = document.querySelectorAll('.task-item.completed').length;
    const pendingTasks = totalTasks - completedTasks;

    pendingCount.textContent = `Pendentes: ${pendingTasks}`;
    completedCount.textContent = `Concluídas: ${completedTasks}`;
}

// Adicionar mudanças ao log
function addChangeLog(message) {
    const logItem = document.createElement('li');
    logItem.textContent = message;
    changeLog.appendChild(logItem);
}

// Arrastar e soltar
taskList.addEventListener('dragstart', (event) => {
    event.dataTransfer.setData('text/plain', event.target.id);
});

taskList.addEventListener('dragover', (event) => {
    event.preventDefault();
});

taskList.addEventListener('drop', (event) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    const taskElement = document.getElementById(taskId);
    taskList.appendChild(taskElement);
    saveTasks();
});

// Inicializar
loadTasks();
