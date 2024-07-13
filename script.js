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
        logChange(`Tarefa '${text}' marcada como ${taskItem.classList.contains('completed') ? 'concluída' : 'pendente'}`);
    });
    taskItem.appendChild(checkButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            taskItem.remove();
            saveTasks();
            updateCounters();
            logChange(`Tarefa '${text}' excluída`);
        }
    });
    taskItem.appendChild(deleteButton);

    // Adicionar eventos de arrastar e soltar
    taskItem.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', text);
        event.dataTransfer.setData('text/dueDate', dueDate);
        event.dataTransfer.setData('text/category', category);
        event.dataTransfer.setData('text/priority', priority);
        event.dataTransfer.setData('text/file', file);
        event.target.classList.add('dragging');
    });

    taskItem.addEventListener('dragend', () => {
        taskItem.classList.remove('dragging');
    });

    taskItem.addEventListener('dragover', (event) => {
        event.preventDefault();
        const afterElement = getDragAfterElement(taskList, event.clientY);
        const dragging = document.querySelector('.dragging');
        if (afterElement == null) {
            taskList.appendChild(dragging);
        } else {
            taskList.insertBefore(dragging, afterElement);
        }
    });

    return taskItem;
}

// Função para atualizar a lista de categorias no filtro
function updateCategoryFilter() {
    filterCategory.innerHTML = '<option value="">Filtrar por Categoria</option>';
    const categories = new Set();
    document.querySelectorAll('.task-item').forEach(taskItem => {
        categories.add(taskItem.getAttribute('data-category'));
    });
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        filterCategory.appendChild(option);
    });
}

// Função para atualizar a lista de prioridades no filtro
function updatePriorityFilter() {
    filterPriority.innerHTML = '<option value="">Filtrar por Prioridade</option>';
    const priorities = new Set();
    document.querySelectorAll('.task-item').forEach(taskItem => {
        priorities.add(taskItem.getAttribute('data-priority'));
    });
    priorities.forEach(priority => {
        const option = document.createElement('option');
        option.value = priority;
        option.textContent = priority;
        filterPriority.appendChild(option);
    });
}

// Função para atualizar os contadores de tarefas
function updateCounters() {
    const pending = document.querySelectorAll('.task-item:not(.completed)').length;
    const completed = document.querySelectorAll('.task-item.completed').length;
    pendingCount.textContent = `Pendentes: ${pending}`;
    completedCount.textContent = `Concluídas: ${completed}`;
}

// Função para adicionar uma nova tarefa
function addTask() {
    const text = taskInput.value.trim();
    const dueDate = taskDueDate.value;
    const category = taskCategory.value;
    const priority = taskPriority.value;
    const file = taskFile.files[0] ? URL.createObjectURL(taskFile.files[0]) : '';

    if (text) {
        const taskItem = createTask(text, false, dueDate, category, priority, file);
        taskList.appendChild(taskItem);
        saveTasks();
        updateCounters();
        logChange(`Nova tarefa adicionada: '${text}'`);
        taskInput.value = '';
        taskDueDate.value = '';
        taskCategory.value = '';
        taskPriority.value = '';
        taskFile.value = '';
    }
}

// Função para filtrar tarefas
function filterTasks() {
    const category = filterCategory.value;
    const priority = filterPriority.value;

    document.querySelectorAll('.task-item').forEach(taskItem => {
        const taskCategory = taskItem.getAttribute('data-category');
        const taskPriority = taskItem.getAttribute('data-priority');

        if ((category === '' || taskCategory === category) &&
            (priority === '' || taskPriority === priority)) {
            taskItem.style.display = '';
        } else {
            taskItem.style.display = 'none';
        }
    });
    updateCounters();
}

// Função para ordenar tarefas por data
function sortTasksByDate() {
    const tasks = Array.from(document.querySelectorAll('.task-item'));
    tasks.sort((a, b) => {
        const dateA = new Date(a.getAttribute('data-due-date') || 0);
        const dateB = new Date(b.getAttribute('data-due-date') || 0);
        return dateA - dateB;
    });
    tasks.forEach(task => taskList.appendChild(task));
}

// Função para alternar entre temas claro e escuro
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    toggleThemeButton.textContent = document.body.classList.contains('dark-theme') ? 'Tema Claro' : 'Tema Escuro';
}

// Função para registrar mudanças
function logChange(change) {
    const logItem = document.createElement('li');
    logItem.textContent = change;
    changeLog.appendChild(logItem);
}

// Função para encontrar o item após o qual o item arrastado deve ser colocado
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)']]);
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Inicializar
loadTasks();

// Adicionar evento de clique para adicionar tarefa
addTaskButton.addEventListener('click', addTask);

// Adicionar eventos para filtros e botão de tema
allTasksButton.addEventListener('click', () => {
    document.querySelectorAll('.task-item').forEach(taskItem => taskItem.style.display = '');
    updateCounters();
});

pendingTasksButton.addEventListener('click', () => {
    document.querySelectorAll('.task-item').forEach(taskItem => {
        taskItem.style.display = taskItem.classList.contains('completed') ? 'none' : '';
    });
    updateCounters();
});

completedTasksButton.addEventListener('click', () => {
    document.querySelectorAll('.task-item').forEach(taskItem => {
        taskItem.style.display = taskItem.classList.contains('completed') ? '' : 'none';
    });
    updateCounters();
});

filterCategory.addEventListener('change', filterTasks);
filterPriority.addEventListener('change', filterTasks);
sortByDateButton.addEventListener('click', sortTasksByDate);
toggleThemeButton.addEventListener('click', toggleTheme);
