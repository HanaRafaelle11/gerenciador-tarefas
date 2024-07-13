document.addEventListener('DOMContentLoaded', () => {
    solicitarPermissaoNotificacao();
    loadTasks();
    document.getElementById('addTaskButton').addEventListener('click', addTask);
    document.getElementById('allTasks').addEventListener('click', () => filterTasks('all'));
    document.getElementById('pendingTasks').addEventListener('click', () => filterTasks('pending'));
    document.getElementById('completedTasks').addEventListener('click', () => filterTasks('completed'));
    document.getElementById('priorityFilter').addEventListener('change', (event) => {
        filterTasks(event.target.value);
    });
});

function solicitarPermissaoNotificacao() {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
}

function mostrarNotificacao(titulo, mensagem) {
    if (Notification.permission === 'granted') {
        new Notification(titulo, {
            body: mensagem,
            icon: 'https://example.com/icon.png'
        });
    }
}

function mostrarNotificacaoPagina(mensagem) {
    const notificationElement = document.getElementById('notification');
    notificationElement.textContent = mensagem;
    notificationElement.style.display = 'block';
    setTimeout(() => {
        notificationElement.style.display = 'none';
    }, 5000);
}

function addTask() {
    const taskText = document.getElementById('taskInput').value.trim();
    const taskDue = document.getElementById('taskDueDate').value;
    const taskCat = document.getElementById('taskCategory').value.trim();
    const taskPriority = document.getElementById('taskPriority').value;
    const taskShareEmail = document.getElementById('taskShareEmail').value.trim();

    if (taskText) {
        const taskItem = createTask(taskText, false, taskDue, taskCat, taskPriority);
        document.getElementById('taskList').appendChild(taskItem);
        saveTasks();
        updateCounters();

        mostrarNotificacao('Nova Tarefa Adicionada!', `Tarefa: ${taskText} adicionada com sucesso.`);
        mostrarNotificacaoPagina(`Tarefa: ${taskText} adicionada com sucesso.`);

        if (taskShareEmail) {
            compartilharTarefa(taskText, taskDue, taskCat, taskPriority, taskShareEmail);
        }
    }
}

function compartilharTarefa(taskText, taskDue, taskCat, taskPriority, email) {
    const subject = 'Nova Tarefa Compartilhada';
    const body = `Você recebeu uma nova tarefa: ${taskText}\n
    Categoria: ${taskCat}\n
    Prioridade: ${taskPriority}\n
    Data de Vencimento: ${taskDue}\n
    Acesse o Gerenciador de Tarefas para mais detalhes.`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function createTask(text, completed, dueDate, category, priority) {
    const taskItem = document.createElement('li');
    taskItem.className = `task ${completed ? 'completed' : ''}`;
    taskItem.dataset.completed = completed;
    taskItem.dataset.priority = priority;
    taskItem.innerHTML = `
        <span class="task-text">${text}</span>
        <span class="task-category">${category}</span>
        <span class="task-priority">${priority}</span>
        <span class="task-due-date">${dueDate}</span>
        <button class="complete-task">✔</button>
        <button class="delete-task">✖</button>
    `;

    taskItem.querySelector('.complete-task').addEventListener('click', () => {
        taskItem.classList.toggle('completed');
        taskItem.dataset.completed = taskItem.classList.contains('completed');
        saveTasks();
        updateCounters();
    });

    taskItem.querySelector('.delete-task').addEventListener('click', () => {
        taskItem.remove();
        saveTasks();
        updateCounters();
    });

    return taskItem;
}

function filterTasks(filter) {
    const tasks = Array.from(document.getElementById('taskList').children);
    tasks.forEach(task => {
        const taskPriority = task.dataset.priority;
        const taskStatus = task.dataset.completed;
        if (filter === 'all' ||
            (filter === 'pending' && taskStatus === 'false') ||
            (filter === 'completed' && taskStatus === 'true') ||
            (filter === taskPriority)) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });
}

function saveTasks() {
    const tasks = Array.from(document.getElementById('taskList').children).map(task => ({
        text: task.querySelector('.task-text').textContent,
        completed: task.dataset.completed === 'true',
        dueDate: task.querySelector('.task-due-date').textContent,
        category: task.querySelector('.task-category').textContent,
        priority: task.querySelector('.task-priority').textContent,
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskItem = createTask(task.text, task.completed, task.dueDate, task.category, task.priority);
        document.getElementById('taskList').appendChild(taskItem);
    });
    updateCounters();
}

function updateCounters() {
    const tasks = Array.from(document.getElementById('taskList').children);
    const pendingCount = tasks.filter(task => task.dataset.completed === 'false').length;
    const completedCount = tasks.filter(task => task.dataset.completed === 'true').length;

    document.getElementById('pendingCount').textContent = `Pendentes: ${pendingCount}`;
    document.getElementById('completedCount').textContent = `Concluídas: ${completedCount}`;
}
