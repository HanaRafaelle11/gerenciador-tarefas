// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Seleciona elementos
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const categorySelect = document.getElementById('categorySelect');
    const prioritySelect = document.getElementById('prioritySelect');
    const taskList = document.getElementById('taskList');
    const addTaskButton = document.getElementById('addTaskButton');
    const filterCategorySelect = document.getElementById('filterCategorySelect');
    const filterPrioritySelect = document.getElementById('filterPrioritySelect');
    const filterStatusSelect = document.getElementById('filterStatusSelect');
    const sortByDateButton = document.getElementById('sortByDateButton');
    const themeToggleButton = document.getElementById('themeToggleButton');
    const taskCounter = document.getElementById('taskCounter');
    const completedCounter = document.getElementById('completedCounter');
    const logList = document.getElementById('logList');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let categories = new Set();
    let priorities = new Set();

    // Inicializa a interface
    loadTasks();
    updateCategoryFilter();
    updatePriorityFilter();
    updateCounters();

    // Função para carregar tarefas do localStorage
    function loadTasks() {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = createTask(task.text, task.completed, task.dueDate, task.category, task.priority, task.file);
            taskList.appendChild(taskElement);
        });
    }

    // Função para salvar tarefas no localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Função para criar um novo item de tarefa
    function createTask(text, completed, dueDate, category, priority, file) {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        if (completed) {
            taskItem.classList.add('completed');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = completed;
        checkbox.addEventListener('change', () => {
            taskItem.classList.toggle('completed');
            updateTaskStatus(text, !completed);
            updateCounters();
        });

        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = text;

        if (file) {
            const filePreview = document.createElement('img');
            filePreview.className = 'task-file-preview';
            filePreview.src = URL.createObjectURL(file);
            taskItem.appendChild(filePreview);
        }

        const dueDateElement = document.createElement('span');
        dueDateElement.className = 'task-due-date';
        dueDateElement.textContent = `Due: ${dueDate}`;

        const categoryElement = document.createElement('span');
        categoryElement.className = 'task-category';
        categoryElement.textContent = `Category: ${category}`;

        const priorityElement = document.createElement('span');
        priorityElement.className = 'task-priority';
        priorityElement.textContent = `Priority: ${priority}`;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-button';
        editButton.addEventListener('click', () => {
            const newText = prompt('Edit task:', text);
            if (newText !== null && newText.trim() !== '') {
                editTask(text, newText);
                taskText.textContent = newText;
                logChange(`Edited task from "${text}" to "${newText}"`);
            }
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                deleteTask(text);
                taskList.removeChild(taskItem);
                logChange(`Deleted task: "${text}"`);
                updateCounters();
            }
        });

        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(dueDateElement);
        taskItem.appendChild(categoryElement);
        taskItem.appendChild(priorityElement);
        taskItem.appendChild(editButton);
        taskItem.appendChild(deleteButton);

        // Permite arrastar e soltar tarefas
        taskItem.draggable = true;
        taskItem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', text);
        });
        taskList.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        taskList.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedTaskText = e.dataTransfer.getData('text/plain');
            const draggedTask = tasks.find(t => t.text === draggedTaskText);
            if (draggedTask) {
                tasks = tasks.filter(t => t.text !== draggedTaskText);
                tasks.push(draggedTask);
                saveTasks();
                loadTasks();
            }
        });

        return taskItem;
    }

    // Adiciona uma nova tarefa
    addTaskButton.addEventListener('click', () => {
        const text = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        const category = categorySelect.value;
        const priority = prioritySelect.value;
        const file = document.getElementById('fileInput').files[0];

        if (text === '') {
            alert('Please enter a task!');
            return;
        }

        const newTask = { text, completed: false, dueDate, category, priority, file };
        tasks.push(newTask);
        saveTasks();
        logChange(`Added new task: "${text}"`);
        const taskElement = createTask(text, false, dueDate, category, priority, file);
        taskList.appendChild(taskElement);
        taskInput.value = '';
        dueDateInput.value = '';
        document.getElementById('fileInput').value = '';
        updateCategoryFilter();
        updatePriorityFilter();
        updateCounters();
    });

    // Atualiza o filtro de categorias
    function updateCategoryFilter() {
        filterCategorySelect.innerHTML = '<option value="">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            filterCategorySelect.appendChild(option);
        });
    }

    // Atualiza o filtro de prioridades
    function updatePriorityFilter() {
        filterPrioritySelect.innerHTML = '<option value="">All Priorities</option>';
        priorities.forEach(priority => {
            const option = document.createElement('option');
            option.value = priority;
            option.textContent = priority;
            filterPrioritySelect.appendChild(option);
        });
    }

    // Atualiza os contadores de tarefas
    function updateCounters() {
        const pendingCount = tasks.filter(t => !t.completed).length;
        const completedCount = tasks.filter(t => t.completed).length;
        taskCounter.textContent = `Pending Tasks: ${pendingCount}`;
        completedCounter.textContent = `Completed Tasks: ${completedCount}`;
    }

    // Registra alterações na lista de logs
    function logChange(change) {
        const logEntry = document.createElement('li');
        logEntry.textContent = change;
        logList.appendChild(logEntry);
    }

    // Atualiza o status da tarefa
    function updateTaskStatus(oldText, newStatus) {
        const task = tasks.find(t => t.text === oldText);
        if (task) {
            task.completed = newStatus;
            saveTasks();
        }
    }

    // Edita uma tarefa
    function editTask(oldText, newText) {
        const task = tasks.find(t => t.text === oldText);
        if (task) {
            task.text = newText;
            saveTasks();
        }
    }

    // Exclui uma tarefa
    function deleteTask(text) {
        tasks = tasks.filter(t => t.text !== text);
        saveTasks();
    }

    // Filtra tarefas
    filterCategorySelect.addEventListener('change', () => {
        const category = filterCategorySelect.value;
        const priority = filterPrioritySelect.value;
        const status = filterStatusSelect.value;
        filterTasks(category, priority, status);
    });

    filterPrioritySelect.addEventListener('change', () => {
        const category = filterCategorySelect.value;
        const priority = filterPrioritySelect.value;
        const status = filterStatusSelect.value;
        filterTasks(category, priority, status);
    });

    filterStatusSelect.addEventListener('change', () => {
        const category = filterCategorySelect.value;
        const priority = filterPrioritySelect.value;
        const status = filterStatusSelect.value;
        filterTasks(category, priority, status);
    });

    // Função de filtragem de tarefas
    function filterTasks(category, priority, status) {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            return (category === '' || task.category === category) &&
                   (priority === '' || task.priority === priority) &&
                   (status === '' || (status === 'completed' ? task.completed : !task.completed));
        });
        filteredTasks.forEach(task => {
            const taskElement = createTask(task.text, task.completed, task.dueDate, task.category, task.priority, task.file);
            taskList.appendChild(taskElement);
        });
    }

    // Ordena tarefas por data
    sortByDateButton.addEventListener('click', () => {
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        saveTasks();
        loadTasks();
    });

    // Alterna entre tema escuro e claro
    themeToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
    });

    // Adiciona categorias e prioridades únicas
    tasks.forEach(task => {
        categories.add(task.category);
        priorities.add(task.priority);
    });

    // Adiciona eventos de arrastar e soltar tarefas
    taskList.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    taskList.addEventListener('drop', (e) => {
        e.preventDefault();
        const text = e.dataTransfer.getData('text/plain');
        const task = tasks.find(t => t.text === text);
        if (task) {
            tasks = tasks.filter(t => t.text !== text);
            tasks.push(task);
            saveTasks();
            loadTasks();
        }
    });
});
