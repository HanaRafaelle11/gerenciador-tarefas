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
const toggleThemeButton = document.getElementById('toggleTheme');

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
        const file = taskItem.getAttribute('data-file');
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
        ${file ? `<a href="${file}" target="_blank">Arquivo Anexado</a>` : ''}
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
        logChange(`Tarefa "${text}" excluída.`);
        taskItem.remove();
        saveTasks();
        updateCounters();
    });

    // Adicionar a funcionalidade de editar a tarefa
    taskItem.querySelector('.edit-button').addEventListener('click', () => {
        const newText = prompt('Edite a tarefa:', taskItem.querySelector('span').textContent);
        const newCategory = prompt('Edite a categoria:', category);
        const newPriority = prompt('Edite a prioridade:', priority);
        if (newText !== null && newText.trim() !== '') {
            taskItem.querySelector('span').textContent = newText;
            taskItem.setAttribute('data-category', newCategory);
            taskItem.setAttribute('data-priority', newPriority);
            logChange(`Tarefa alterada para "${newText}", Categoria: "${newCategory}", Prioridade: "${newPriority}".`);
            saveTasks();
        }
    });

    // Função para permitir drag and drop
    taskItem.draggable = true;
    taskItem.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', text);
    });

    taskList.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    taskList.addEventListener('drop', (event) => {
        event.preventDefault();
        const draggedText = event.dataTransfer.getData('text/plain');
        const draggedTask = Array.from(taskList.children).find(item => item.querySelector('span').textContent === draggedText);
        if (draggedTask) {
            const rect = taskList.getBoundingClientRect();
            const offset = (event.clientY - rect.top) / rect.height;
            if (offset < 0.5) {
                taskList.insertBefore(draggedTask, taskList.children[0]);
            } else {
                taskList.appendChild(draggedTask);
            }
            saveTasks();
        }
    });

    return taskItem;
}

// Adicionar nova tarefa
addTaskButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    const taskDue = taskDueDate.value;
    const taskCat = taskCategory.value.trim();
    const taskPri = taskPriority.value.trim();
    const file = taskFile.files[0] ? URL.createObjectURL(taskFile.files[0]) : '';
    if (taskText) {
        const taskItem = createTask(taskText, false, taskDue, taskCat, taskPri, file);
        taskList.appendChild(taskItem);
        taskInput.value = '';
        taskDueDate.value = '';
        taskCategory.value = '';
        taskPriority.value = '';
        taskFile.value = '';
        saveTasks();
        updateCounters();
    }
});

// Carregar tarefas ao carregar a página
window.addEventListener('load', loadTasks);

// Adicionar funcionalidade de filtragem de tarefas
allTasksButton.addEventListener('click', () => {
    document.querySelectorAll('.task-item').forEach(task => {
        task.style.display = 'flex';
    });
});

pendingTasksButton.addEventListener('click', () => {
    document.querySelectorAll('.task-item').forEach(task => {
        task.style.display = task.classList.contains('completed') ? 'none' : 'flex';
    });
});

completedTasksButton.addEventListener('click', () => {
    document.querySelectorAll('.task-item').forEach(task => {
        task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
    });
});

// Filtrar tarefas por categoria
filterCategory.addEventListener('change', () => {
    const selectedCategory = filterCategory.value;
    document.querySelectorAll('.task-item').forEach(task => {
        const category = task.getAttribute('data-category');
        task.style.display = selectedCategory === '' || category === selectedCategory ? 'flex' : 'none';
    });
});

// Filtrar tarefas por prioridade
filterPriority.addEventListener('change', () => {
    const selectedPriority = filterPriority.value;
    document.querySelectorAll('.task-item').forEach(task => {
        const priority = task.getAttribute('data-priority');
        task.style.display = selectedPriority === '' || priority === selectedPriority ? 'flex' : 'none';
    });
});

// Ordenar tarefas por data de vencimento
sortByDateButton.addEventListener('click', () => {
    const tasks = Array.from(document.querySelectorAll('.task-item'));
    tasks.sort((a, b) => {
        const dateA = new Date(a.getAttribute('data-due-date') || 0);
        const dateB = new Date(b.getAttribute('data-due-date') || 0);
        return dateA - dateB;
    });
    tasks.forEach(task => taskList.appendChild(task));
    saveTasks();
    updateCounters();
});

// Alternar entre tema escuro e claro
toggleThemeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDarkTheme = document.body.classList.contains('dark-theme');
    toggleThemeButton.textContent = isDarkTheme ? 'Tema Claro' : 'Tema Escuro';
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
});
