// scripts.js

// Selecionar elementos
const taskInput = document.getElementById('taskInput');
const taskDueDate = document.getElementById('taskDueDate');
const taskCategory = document.getElementById('taskCategory');
const taskPriority = document.getElementById('taskPriority');
const taskFile = document.getElementById('taskFile');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const allTasksButton = document.getElementById('allTasks');
const pendingTasksButton = document.getElementById('pendingTasks');
const completedTasksButton = document.getElementById('completedTasks');
const filterCategory = document.getElementById('filterCategory');
const filterPriority = document.getElementById('filterPriority');
const sortByDateButton = document.getElementById('sortByDate');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');
const changeLog = document.getElementById('changeLog');
const toggleThemeButton = document.getElementById('toggleThemeButton');

// Função para carregar tarefas do local storage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    taskList.innerHTML = ''; // Limpar a lista antes de recarregar
    tasks.forEach(task => {
        const taskItem = createTask(task.text, task.completed, task.dueDate, task.category, task.priority, task.file);
        taskList.appendChild(taskItem);
    });
    updateCounters();
}

// Função para salvar tarefas no local storage
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
    taskItem.className = 'task-item';
    if (completed) taskItem.classList.add('completed');
    taskItem.setAttribute('data-due-date', dueDate);
    taskItem.setAttribute('data-category', category);
    taskItem.setAttribute('data-priority', priority);
    taskItem.setAttribute('data-file', file);
    taskItem.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${completed ? 'checked' : ''}>
        <span>${text}</span>
        <small>${dueDate ? `Vencimento: ${dueDate}` : ''} ${category ? `Categoria: ${category}` : ''} ${priority ? `Prioridade: ${priority}` : ''}</small>
        ${file ? `<img src="${file}" class="task-file-preview" alt="Anexo da Tarefa">` : ''}
        <button class="edit-button">Editar</button>
        <button class="delete-button">Excluir</button>
    `;

    // Adicionar a funcionalidade de marcar como concluída
    taskItem.querySelector('.task-checkbox').addEventListener('change', (event) => {
        if (event.target.checked) {
            taskItem.classList.add('completed');
            logChange(`Tarefa "${text}" marcada como concluída.`);
        } else {
            taskItem.classList.remove('completed');
            logChange(`Tarefa "${text}" marcada como pendente.`);
        }
        saveTasks();
        updateCounters();
    });

    // Adicionar a funcionalidade de editar tarefa
    taskItem.querySelector('.edit-button').addEventListener('click', () => {
        taskInput.value = text;
        taskDueDate.value = dueDate;
        taskCategory.value = category;
        taskPriority.value = priority;
        taskFile.value = '';
        taskList.removeChild(taskItem);
        saveTasks();
        updateCounters();
        logChange(`Tarefa "${text}" removida para edição.`);
    });

    // Adicionar a funcionalidade de excluir tarefa
    taskItem.querySelector('.delete-button').addEventListener('click', () => {
        taskList.removeChild(taskItem);
        saveTasks();
        updateCounters();
        logChange(`Tarefa "${text}" excluída.`);
    });

    return taskItem;
}

// Adicionar uma nova tarefa
addTaskButton.addEventListener('click', () => {
    const text = taskInput.value.trim();
    const dueDate = taskDueDate.value;
    const category = taskCategory.value;
    const priority = taskPriority.value;
    const file = taskFile.files[0] ? URL.createObjectURL(taskFile.files[0]) : '';

    if (text) {
        const taskItem = createTask(text, false, dueDate, category, priority, file);
        taskList.appendChild(taskItem);
        taskInput.value = '';
        taskDueDate.value = '';
        taskCategory.value = '';
        taskPriority.value = '';
        taskFile.value = '';
        saveTasks();
        updateCounters();
        logChange(`Nova tarefa adicionada: "${text}".`);
        // Atualiza opções de categoria para o filtro
        updateCategoryFilter();
    } else {
        alert('Digite uma tarefa.');
    }
});

// Atualiza as opções de categoria do filtro
function updateCategoryFilter() {
    const categories = new Set();
    document.querySelectorAll('.task-item').forEach(taskItem => {
        const category = taskItem.getAttribute('data-category');
        if (category) {
            categories.add(category);
        }
    });
    filterCategory.innerHTML = '<option value="">Filtrar por Categoria</option>';
    categories.forEach(category => {
        filterCategory.innerHTML += `<option value="${category}">${category}</option>`;
    });
}

// Filtrar tarefas
allTasksButton.addEventListener('click', () => {
    document.querySelectorAll('.task-item').forEach(taskItem => taskItem.style.display = 'flex');
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
    logChange('Tarefas ordenadas por data de vencimento.');
});

// Alternar entre temas escuro e claro
toggleThemeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    toggleThemeButton.textContent = document.body.classList.contains('dark-theme') ? 'Tema Claro' : 'Tema Escuro';
});

// Atualizar contadores de tarefas
function updateCounters() {
    const totalTasks = document.querySelectorAll('.task-item').length;
    const completedTasks = document.querySelectorAll('.task-item.completed').length;
    const pendingTasks = totalTasks - completedTasks;

    pendingCount.textContent = `Pendentes: ${pendingTasks}`;
    completedCount.textContent = `Concluídas: ${completedTasks}`;
}

// Registrar alterações nas tarefas
function logChange(message) {
    const logItem = document.createElement('li');
    logItem.textContent = message;
    changeLog.appendChild(logItem);
}

// Inicializar a página com as configurações do tema
document.addEventListener('DOMContentLoaded', () => {
    const isDarkTheme = document.body.classList.contains('dark-theme');
    toggleThemeButton.textContent = isDarkTheme ? 'Tema Claro' : 'Tema Escuro';
    loadTasks();
});
