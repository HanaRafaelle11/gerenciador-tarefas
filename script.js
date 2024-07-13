body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
}

.container {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    width: 400px;
    max-width: 100%;
    overflow: hidden;
}

h1 {
    margin: 0 0 20px;
    text-align: center;
}

.task-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
}

.task-form input[type="text"],
.task-form input[type="date"],
.task-form select,
.task-form input[type="file"] {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 3px;
}

.task-form button {
    padding: 10px 15px;
    border: none;
    background-color: #28a745;
    color: #fff;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.task-form button:hover {
    background-color: #218838;
}

.task-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 10px;
}

.filter-button {
    padding: 10px;
    border: none;
    color: #fff;
    border-radius: 3px;
    cursor: pointer;
    flex: 1;
    transition: background-color 0.3s;
}

.filter-button.blue {
    background-color: #007bff;
}

.filter-button.blue:hover {
    background-color: #0056b3;
}

.filter-button.red {
    background-color: #dc3545;
}

.filter-button.red:hover {
    background-color: #c82333;
}

.filter-button.green {
    background-color: #28a745;
}

.filter-button.green:hover {
    background-color: #218838;
}

.filter-select {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 3px;
    cursor: pointer;
}

.task-counters {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.task-counters span {
    font-weight: bold;
}

.task-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.task-item {
    display: flex;
    flex-direction: column;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 3px;
    margin-bottom: 10px;
    background-color: #fff;
    position: relative;
    transition: background-color 0.3s, box-shadow 0.3s;
}

.task-item.dragging {
    opacity: 0.5;
}

.task-item.completed {
    background-color: #d4edda;
    text-decoration: line-through;
}

.task-item input[type="checkbox"] {
    margin-right: 10px;
}

.task-item span {
    flex: 1;
}

.task-item button {
    background-color: #ffc107;
    border: none;
    padding: 5px 10px;
    margin-top: 10px;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.task-item button:hover {
    background-color: #e0a800;
}

.task-item button.delete-button {
    background-color: #dc3545;
    color: #fff;
}

.task-item button.delete-button:hover {
    background-color: #c82333;
}

.task-item img {
    max-width: 100px;
    max-height: 100px;
    margin-top: 10px;
}

.dark-theme {
    background-color: #333;
    color: #f4f4f4;
}

.dark-theme .container {
    background-color: #444;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
}

.dark-theme .task-item {
    background-color: #555;
    border: 1px solid #666;
}

.dark-theme .filter-button {
    background-color: #222;
}

.dark-theme .filter-button:hover {
    background-color: #111;
}

.dark-theme .filter-select {
    background-color: #555;
    border-color: #666;
    color: #f4f4f4;
}

.dark-theme #changeLog {
    color: #f4f4f4;
}
