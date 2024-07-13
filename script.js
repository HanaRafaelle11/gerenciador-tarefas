document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskNameInput = document.getElementById('task-name');
    const taskDateInput = document.getElementById('task-date');
    const taskPrioritySelect = document.getElementById('task-priority');
    const taskSegmentSelect = document.getElementById('task-segment');
    const taskList = document.getElementById('task-list');
    const changeLogList = document.getElementById('change-log-list');
    const themeToggleButton = document.getElementById('theme-toggle');
    const changeLogTitle = document.getElementById('change-log-title');

    let darkTheme = localStorage.getItem('dark-theme') === 'true';
    let changeLogVisible = localStorage.getItem('change-log-visible') === 'true';

    // Definir o tema escuro
    const setDarkTheme = (isDark) => {
        if (isDark) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        themeToggleButton.textContent = isDark ? 'Tema Claro' : 'Tema Escuro';
    };

    // Definir o estado do histórico de alterações
    const setChangeLogVisibility = (isVisible) => {
        if (isVisible) {
            changeLogList.classList.add('open');
            changeLogTitle.textContent = 'Histórico de Alterações';
        } else {
            changeLogList.classList.remove('open');
            changeLogTitle.textContent = 'Mostrar Histórico de Alterações';
        }
        localStorage.setItem('change-log-visible', isVisible);
    };

    const addTask = (name, date, priority, segment) => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.draggable = true;
        taskItem.innerHTML = `
            <div class="task-content">
                <p><strong>${name}</strong></p>
                <p>Data: ${date}</p>
                <p>Prioridade: ${priority}</p>
                <p>Segmento: ${segment}</p>
            </div>
            <button class="complete-button">Concluir</button>
            <button class="delete-button">Excluir</button>
        `;

        const completeButton = taskItem.querySelector('.complete-button');
        completeButton.addEventListener('click', () => {
            taskItem.classList.toggle('completed');
            logChange(`Tarefa "${name}" ${taskItem.classList.contains('completed') ? 'concluída' : 'revertida'}`);
            saveTasks();
        });

        const deleteButton = taskItem.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                taskItem.classList.add('deleted');
                taskItem.style.display = 'none';
                logChange(`Tarefa "${name}" excluída`);
                saveTasks();
            }
        });

        taskList.appendChild(taskItem);

        taskItem.addEventListener('dragstart', () => {
            taskItem.classList.add('dragging');
        });

        taskItem.addEventListener('dragend', () => {
            taskItem.classList.remove('dragging');
        });

        taskList.addEventListener('dragover', (event) => {
            event.preventDefault();
            const afterElement = getDragAfterElement(taskList, event.clientY);
            const draggingItem = document.querySelector('.dragging');
            if (afterElement == null) {
                taskList.appendChild(draggingItem);
            } else {
                taskList.insertBefore(draggingItem, afterElement);
            }
        });

        taskList.addEventListener('drop', () => {
            logChange(`Tarefa "${name}" movida`);
            saveTasks();
        });
    };

    const getDragAfterElement = (container, y) => {
        const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];

        return draggableElements.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            { offset: Number.NEGATIVE_INFINITY }
        ).element;
    };

    const logChange = (message) => {
        const logItem = document.createElement('li');
        logItem.textContent = message;
        logItem.classList.add('change-log-item');
        logItem.addEventListener('click', () => {
            logItem.classList.toggle('open');
        });
        logItem.innerHTML = `
            ${message}
            <div class="change-log-content">
                <p>${message}</p>
            </div>
        `;
        changeLogList.appendChild(logItem);
    };

    const saveTasks = () => {
        const tasks = Array.from(taskList.children).map(taskItem => ({
            name: taskItem.querySelector('strong').textContent,
            date: taskItem.querySelector('p').textContent.replace('Data: ', ''),
            priority: taskItem.querySelector('p').nextElementSibling.textContent.replace('Prioridade: ', ''),
            segment: taskItem.querySelector('p').nextElementSibling.nextElementSibling.textContent.replace('Segmento: ', ''),
            completed: taskItem.classList.contains('completed'),
            deleted: taskItem.classList.contains('deleted'),
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.forEach(task => {
            addTask(task.name, task.date, task.priority, task.segment);
            if (task.completed) {
                taskList.lastChild.classList.add('completed');
            }
            if (task.deleted) {
                taskList.lastChild.classList.add('deleted');
                taskList.lastChild.style.display = 'none';
            }
        });
    };

    const setFilters = () => {
        document.getElementById('all-tasks').addEventListener('click', () => filterTasks('all'));
        document.getElementById('pending-tasks').addEventListener('click', () => filterTasks('pending'));
        document.getElementById('completed-tasks').addEventListener('click', () => filterTasks('completed'));
        document.getElementById('deleted-tasks').addEventListener('click', () => filterTasks('deleted'));
        document.getElementById('clear-tasks').addEventListener('click', () => {
            if (confirm('Tem certeza que deseja limpar todas as tarefas?')) {
                taskList.innerHTML = '';
                logChange('Todas as tarefas excluídas');
                saveTasks();
            }
        });
    };

    const filterTasks = (filter) => {
        Array.from(taskList.children).forEach(taskItem => {
            switch (filter) {
                case 'all':
                    taskItem.style.display = '';
                    break;
                case 'pending':
                    taskItem.style.display = taskItem.classList.contains('completed') ? 'none' : '';
                    break;
                case 'completed':
                    taskItem.style.display = taskItem.classList.contains('completed') ? '' : 'none';
                    break;
                case 'deleted':
                    taskItem.style.display = taskItem.classList.contains('deleted') ? '' : 'none';
                    break;
            }
        });
    };

    const toggleChangeLog = () => {
        const isVisible = !changeLogList.classList.contains('open');
        setChangeLogVisibility(isVisible);
    };

    changeLogTitle.addEventListener('click', toggleChangeLog);

    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = taskNameInput.value.trim();
        const date = taskDateInput.value;
        const priority = taskPrioritySelect.value;
        const segment = taskSegmentSelect.value;

        if (name && date) {
            addTask(name, date, priority, segment);
            logChange(`Tarefa "${name}" adicionada`);
            saveTasks();
            taskNameInput.value = '';
            taskDateInput.value = '';
        }
    });

    themeToggleButton.addEventListener('click', () => {
        darkTheme = !darkTheme;
        localStorage.setItem('dark-theme', darkTheme);
        setDarkTheme(darkTheme);
    });

    // Carregar tarefas e tema ao iniciar
    loadTasks();
    setDarkTheme(darkTheme);
    setChangeLogVisibility(changeLogVisible);
    setFilters();
});
