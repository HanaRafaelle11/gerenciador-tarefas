// Selecionar elementos
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const allTasksButton = document.getElementById('allTasks');
const pendingTasksButton = document.getElementById('pendingTasks');
const completedTasksButton = document.getElementById('completedTasks');

// Função para carregar tarefas do local storage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskItem = createTask(task.text, task.completed);
        taskList.appendChild(taskItem);
    });
}

// Função para salvar tarefas no local storage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(taskItem => {
        const text = taskItem.querySelector('span').textContent;
        const completed = taskItem.classList.contains('completed');
        tasks.push({ text, completed });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para criar uma nova tarefa
function createTask(text, completed = false) {
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    if (completed) taskItem.classList.add('completed');
    taskItem.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${completed ? 'checked' : ''}>
        <span>${text}</span>
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
    });

    // Adicionar a funcionalidade de excluir a tarefa
    taskItem.querySelector('.delete-button').addEventListener('click', (event) => {
        event.stopPropagation();
        taskItem.remove();
        saveTasks();
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
    if (taskText) {
        const taskItem = createTask(taskText);
        taskList.appendChild(taskItem);
        taskInput.value = '';
        saveTasks();
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
