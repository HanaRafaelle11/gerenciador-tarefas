document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskNameInput = document.getElementById('task-name');
    const taskDateInput = document.getElementById('task-date');
    const taskPrioritySelect = document.getElementById('task-priority');
    const taskList = document.getElementById('task-list');
    const changeLogList = document.getElementById('change-log-list');
    const themeToggleButton = document.getElementById('theme-toggle');
    let darkTheme = localStorage.getItem('dark-theme') === 'true';

    const setDarkTheme = (isDark) => {
        if (isDark) {
            document.body.classList.add('dark-theme');
            themeToggleButton.textContent = 'Tema Claro';
        } else {
            document.body.classList.remove('dark-theme');
            themeToggleButton.textContent = 'Tema Escuro';
        }
        localStorage.setItem('dark-theme', isDark);
    };

    setDarkTheme(darkTheme);

    themeToggleButton.addEventListener('click', () => {
        darkTheme = !darkTheme;
        setDarkTheme(darkTheme);
    });

    const addTask = (name, date, priority) => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.draggable = true;

        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';
        taskContent.innerHTML = `
            <div>
                <strong>${name}</strong> - ${date} - Prioridade: ${priority}
            </div>
            <img src="https://via.placeholder.com/50" alt="Imagem Tarefa">
        `;

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Concluir';
        completeButton.addEventListener('click', () => {
            taskItem.classList.toggle('completed');
            logChange(`Tarefa "${name}" marcada como ${taskItem.classList.contains('completed') ? 'concluída' : 'pendente'}`);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                taskItem.remove();
                logChange(`Tarefa "${name}" excluída`);
            }
        });

        taskItem.append(taskContent, completeButton, deleteButton);
        taskList.appendChild(taskItem);

        taskItem.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', taskItem.innerHTML);
            event.dataTransfer.setData('text/task-name', name);
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
        changeLogList.appendChild(logItem);
    };

    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = taskNameInput.value.trim();
        const date = taskDateInput.value;
        const priority = taskPrioritySelect.value;

        if (name && date) {
            addTask(name, date, priority);
            logChange(`Tarefa "${name}" adicionada`);
            taskNameInput.value = '';
            taskDateInput.value = '';
        }
    });

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
            }
        });
    };

    document.getElementById('all-tasks').addEventListener('click', () => filterTasks('all'));
    document.getElementById('pending-tasks').addEventListener('click', () => filterTasks('pending'));
    document.getElementById('completed-tasks').addEventListener('click', () => filterTasks('completed'));
    document.getElementById('clear-tasks').addEventListener('click', () => {
        if (confirm('Tem certeza que deseja limpar todas as tarefas?')) {
            taskList.innerHTML = '';
            logChange('Todas as tarefas excluídas');
        }
    });
});
