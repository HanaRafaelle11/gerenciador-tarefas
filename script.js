// Selecionar elementos
const taskInput = document.getElementById('taskInput');
const taskDueDate = document.getElementById('taskDueDate');
const taskCategory = document.getElementById('taskCategory');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const allTasksButton = document.getElementById('allTasks');
const pendingTasksButton = document.getElementById('pendingTasks');
const completedTasksButton = document.getElementById('completedTasks');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');

// Função para carregar tarefas do local storage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskItem = createTask(task.text, task.completed, task.dueDate, task.category);
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
        tasks.push({ text, completed, dueDate, category });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para criar uma nova tarefa
function createTask(text, completed = false, dueDate = '', category = '') {
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    if (completed) taskItem.classList.add('completed');
    taskItem.setAttribute('data-due-date', dueDate);
    taskItem.setAttribute('data-category', category);
    taskItem.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${completed ? 'checked' : ''}>
        <span>${text}</span>
        <small>${dueDate ? `Vencimento: ${dueDate}` : ''} ${category ? `Categoria: ${category}` : ''}</small>
        <button class="edit-button">Editar</button>
        <button class="delete-button">Excluir</button>
    `;

    // Adicionar a funcionalidade de marcar como concluída
    taskItem.querySelector('.task-checkbox').addEventListener('change', (event) => {
        if (event.target.checked) {
            taskItem.classList.add('completed');
        } else {
            taskItem.classList.remove('completed');
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
    });

    // Adicionar a funcionalidade de editar a tarefa
    taskItem.querySelector('.edit-button').addEventListener('click', () => {
        const newText = prompt('Edite a tarefa:', taskItem.querySelector('span').textContent);
        if (newText !== null && newText.trim() !== '') {
            taskItem.querySelector('span').textContent = newText;
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
    if (taskText) {
        const taskItem = createTask(taskText, false, taskDue, taskCat);
        taskList.appendChild(taskItem);
        taskInput.value = '';
        taskDueDate.value = '';
        taskCategory.value = '';
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

// Função para atualizar contadores de tarefas
function updateCounters() {
    const totalTasks = document.querySelectorAll('.task-item').length;
    const completedTasks = document.querySelectorAll('.task-item.completed').length;
    const pendingTasks = totalTasks - completedTasks;

    pendingCount.textContent = `Pendentes: ${pendingTasks}`;
    completedCount.textContent = `Concluídas: ${completedTasks}`;
}
