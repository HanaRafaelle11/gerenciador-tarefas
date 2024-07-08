// Selecionar elementos
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const allTasksButton = document.getElementById('allTasks');
const pendingTasksButton = document.getElementById('pendingTasks');
const completedTasksButton = document.getElementById('completedTasks');

// Função para criar uma nova tarefa
function createTask(text) {
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.innerHTML = `
        <span>${text}</span>
        <button class="delete-button">Excluir</button>
    `;

    // Adicionar a funcionalidade de marcar como concluída
    taskItem.addEventListener('click', () => {
        taskItem.classList.toggle('completed');
    });

    // Adicionar a funcionalidade de excluir a tarefa
    taskItem.querySelector('.delete-button').addEventListener('click', (event) => {
        event.stopPropagation();
        taskItem.remove();
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
    }
});

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
