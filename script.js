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
const sortByDateButton = document.getElementById('sortByDateButton');
const toggleThemeButton = document.getElementById('toggleThemeButton');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');
const changeLog = document.getElementById('changeLog');

// Função para carregar tarefas do local storage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskItem = createTask(task.text, task.completed, task.dueDate, task.category, task.priority, task.file);
        taskList.appendChild(taskItem);
    });
    updateCounters();
    updateCategoryFilter();
    updatePriorityFilter();
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
function createTask(text, completed = false, dueDate = '', category = '', priority = 'Baixa', file = '') {
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    if (completed) taskItem.classList.add('completed');
    taskItem.setAttribute('data-due-date', dueDate);
    taskItem.setAttribute('data-category', category);
    taskItem.setAttribute('data-priority', priority);

    let priorityColor = '';
    switch(priority) {
        case 'Alta': priorityColor = '#dc3545'; break;
        case 'Média': priorityColor = '#ffc107'; break;
        case 'Baixa': priorityColor = '#28a745'; break;
    }

    taskItem.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${completed ? 'checked' : ''}>
        <span>${text}</span>
        <small>${dueDate ? `Vencimento: ${dueDate}` : ''} ${category ? `Categoria: ${category}` : ''} Prioridade: <span style="color: ${priorityColor}">${priority}</span></small>
        ${file ? `<img src="${file}" alt="Anexo" class="task-file-preview">` : ''}
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

    // Adicionar a funcionalidade de excluir a tarefa
    taskItem.querySelector('.delete-button').addEventListener('click', (event) => {
        event.stopPropagation();
        taskItem.remove();
        saveTasks();
        updateCounters();
        logChange(`Tarefa "${text}" excluída.`);
    });

    // Adicionar a funcionalidade de editar a tarefa
    taskItem.querySelector('.edit-button').addEventListener('click', () => {
        const newText = prompt('Edite a tarefa:', text);
        if (newText !== null && newText.trim() !== '') {
            taskItem.querySelector('span').textContent = newText;
            saveTasks();
            logChange(`Tarefa editada para "${newText}".`);
        }
    });

    return taskItem;
}

// Adicionar nova tarefa
addTaskButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    const taskDue = taskDueDate.value;
    const taskCat = taskCategory.value.trim();
    const taskPri = taskPriority.value;
    const taskFileURL = taskFile.files[0] ? URL.createObjectURL(taskFile.files[0]) : '';

    if (taskText) {
        const taskItem = createTask(taskText, false, taskDue, taskCat, taskPri, taskFileURL);
        taskList.appendChild(taskItem);
        taskInput.value = '';
        taskDueDate.value = '';
        taskCategory.value = '';
        taskPriority.value = '';
        taskFile.value = '';
        saveTasks();
        updateCounters();
        logChange(`Nova tarefa adicionada: "${taskText}".`);
    }
});

// Atualiza os filtros de categoria e prioridade
function updateCategoryFilter() {
    const categories = new Set();
    document.querySelectorAll('.task-item').forEach(taskItem => {
        const category = taskItem.getAttribute('data-category');
        if (category) categories.add(category);
    });
    filterCategory.innerHTML = '<option value="">Filtrar por Categoria</option>';
    categories.forEach(category => {
        filterCategory.innerHTML += `<option value="${category}">${category}</option>`;
    });
}

function updatePriorityFilter() {
    const priorities = new Set();
    document.querySelectorAll('.task-item').forEach(taskItem => {
        const priority = taskItem.getAttribute('data-priority');
        if (priority) priorities.add(priority);
    });
    filterPriority.innerHTML = '<option value="">Filtrar por Prioridade</option>';
    priorities.forEach(priority => {
        filterPriority.innerHTML += `<option value="${priority}">${priority}</option>`;
    });
}

// Filtrar tarefas por categoria
filterCategory.addEventListener('change', () => {
    const selectedCategory = filterCategory.value;
    document.querySelectorAll('.task-item').forEach(task => {
        task.style.display = selectedCategory === '' || task.getAttribute('data-category') === selectedCategory ? 'flex' : 'none';
    });
});

// Filtrar tarefas por prioridade
filterPriority.addEventListener('change', () => {
    const selectedPriority = filterPriority.value;
    document.querySelectorAll('.task-item').forEach(task => {
        task.style.display = selectedPriority === '' || task.getAttribute('data-priority') === selectedPriority ? 'flex' : 'none';
    });
});

// Ordenar tarefas por data
sortByDateButton.addEventListener('click', () => {
    const sortedTasks = Array.from(taskList.children).sort((a, b) => {
        const dateA = new Date(a.getAttribute('data-due-date'));
        const dateB = new Date(b.getAttribute('data-due-date'));
        return dateA - dateB;
    });
    taskList.innerHTML = '';
    sortedTasks.forEach(task => taskList.appendChild(task));
    saveTasks();
    logChange('Tarefas ordenadas por data de vencimento.');
});

// Alternar entre tema claro e escuro
toggleThemeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    toggleThemeButton.textContent = document.body.classList.contains('dark-theme') ? 'Tema Claro' : 'Tema Escuro';
    logChange(`Tema alterado para ${document.body.classList.contains('dark-theme') ? 'escuro' : 'claro'}.`);
});

// Adiciona nova tarefa ao registro de alterações
function logChange(message) {
    const listItem = document.createElement('li');
    listItem.textContent = message;
    changeLog.appendChild(listItem);
}

// Atualizar contadores de tarefas
function updateCounters() {
    const totalTasks = document.querySelectorAll('.task-item').length;
    const completedTasks = document.querySelectorAll('.task-item.completed').length;
    const pendingTasks = totalTasks - completedTasks;

    pendingCount.textContent = `Pendentes: ${pendingTasks}`;
    completedCount.textContent = `Concluídas: ${completedTasks}`;
}

// Carregar tarefas ao carregar a página
window.addEventListener('load', loadTasks);
