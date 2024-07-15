document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const changeLogList = document.getElementById('change-log-list');
    const themeToggleButton = document.getElementById('theme-toggle');
    const changeLogTitle = document.getElementById('change-log-title');
    const filterButtons = document.querySelectorAll('.filter-button');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let changeLog = JSON.parse(localStorage.getItem('changeLog')) || [];
    let currentTheme = localStorage.getItem('theme') || 'light';

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const saveChangeLog = () => {
        localStorage.setItem('changeLog', JSON.stringify(changeLog));
    };

    const saveTheme = () => {
        localStorage.setItem('theme', currentTheme);
    };

    const renderTasks = (filter = 'all') => {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            if (filter === 'all' || filter === task.status) {
                const taskItem = document.createElement('li');
                taskItem.className = `task-item ${task.status}`;
                taskItem.innerHTML = `
                    <div class="task-content">
                        <p><strong>Nome:</strong> ${task.name}</p>
                        <p><strong>Data:</strong> ${task.date}</p>
                        <p><strong>Prioridade:</strong> ${task.priority}</p>
                        <p><strong>Segmento:</strong> ${task.segment}</p>
                    </div>
                    <div>
                        <button class="complete-button">${task.status === 'completed' ? 'Reabrir' : 'Concluir'}</button>
                        <button class="delete-button">Excluir</button>
                    </div>
                `;
                taskList.appendChild(taskItem);

                taskItem.querySelector('.complete-button').addEventListener('click', () => {
                    task.status = task.status === 'completed' ? 'pending' : 'completed';
                    addChangeLogEntry(task.name, `Tarefa ${task.status === 'completed' ? 'concluída' : 'reaberta'}`);
                    saveTasks();
                    renderTasks(filter);
                });

                taskItem.querySelector('.delete-button').addEventListener('click', () => {
                    task.status = 'deleted';
                    addChangeLogEntry(task.name, 'Tarefa excluída');
                    saveTasks();
                    renderTasks(filter);
                });
            }
        });
    };

    const renderChangeLog = () => {
        changeLogList.innerHTML = '';
        changeLog.forEach(entry => {
            const changeLogItem = document.createElement('li');
            changeLogItem.className = 'change-log-item';
            changeLogItem.innerHTML = `
                <div>${entry.taskName}: ${entry.action}</div>
                <div class="change-log-content">${entry.timestamp}</div>
            `;
            changeLogList.appendChild(changeLogItem);
        });
    };

    const addChangeLogEntry = (taskName, action) => {
        const timestamp = new Date().toLocaleString();
        changeLog.push({ taskName, action, timestamp });
        saveChangeLog();
    };

    taskForm.addEventListener('submit', e => {
        e.preventDefault();
        const taskName = document.getElementById('task-name').value;
        const taskDate = document.getElementById('task-date').value;
        const taskPriority = document.getElementById('task-priority').value;
        const taskSegment = document.getElementById('task-segment').value;

        tasks.push({
            name: taskName,
            date: taskDate,
            priority: taskPriority,
            segment: taskSegment,
            status: 'pending'
        });
        addChangeLogEntry(taskName, 'Tarefa adicionada');
        saveTasks();
        renderTasks();
        taskForm.reset();
    });

    themeToggleButton.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.className = currentTheme === 'dark' ? 'dark-theme' : '';
        themeToggleButton.textContent = currentTheme === 'dark' ? 'Tema Claro' : 'Tema Escuro';
        saveTheme();
    });

    changeLogTitle.addEventListener('click', () => {
        changeLogList.classList.toggle('hidden');
        changeLogTitle.textContent = changeLogList.classList.contains('hidden') ? 'Mostrar Histórico de Alterações' : 'Esconder Histórico de Alterações';
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            renderTasks(filter);
        });
    });

    document.body.className = currentTheme === 'dark' ? 'dark-theme' : '';
    themeToggleButton.textContent = currentTheme === 'dark' ? 'Tema Claro' : 'Tema Escuro';
    renderTasks();
    renderChangeLog();
});
