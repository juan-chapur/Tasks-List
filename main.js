class Task {
    constructor(title, description) {
        this.title = title;
        this.description = description;
    }
}

document.getElementById('formTask').addEventListener('submit', setTask);

function createElementWithContent(element, content) {
    const node = document.createElement(element);
    node.textContent = content ?? "";
    return node;
}

function createElementWithAttributes(element, attributes) {
    const node = document.createElement(element);
    for (const key in attributes) {
        node.setAttribute(key, attributes[key]);
    }
    return node;
}

function createElementComplete(element, attributes, content) {
    const node = document.createElement(element);
    for (const key in attributes) {
        node.setAttribute(key, attributes[key]);
    }
    node.textContent = content ?? "";
    return node;
}

function isEmpty(task) {
    let isEmpty = false
    Object.entries(task).forEach(item => {
        if (item[1] == "" || item[1] == undefined || item[1] == null) {
            isEmpty = true;
        }
    })
    return isEmpty;
}

isEmpty({a:"", b:""})

function taskExist(task) {
    return getTasks().find(currentTask => currentTask.title == task.title);
}

function setTask(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const task = new Task(form.get("title"), form.get("description"));
    if (!isEmpty(task)) {
        if (!taskExist(task)) {
            const tasks = getTasks();
            tasks.push(task);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            displayTasks();
            document.getElementById('formTask').reset();
        } else {
            displayError("The task already exists")
        }
    } else {
        displayError("Field is empty");
    }
}

function deleteTask(titleTask) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(item => {
        if (item.title == titleTask) {
            tasks.splice(item, 1);
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

function createTaskCard({ title, description }) {
    const row = createElementWithAttributes("div", { class: "row mx-1" });
    const card = createElementWithAttributes("div", { class: "card mb-2 bg-dark text-light" });
    const cardBody = createElementWithAttributes("div", { class: "card-body" });
    const cardTitle = createElementWithAttributes("div", { class: "card-title" });
    const h5title = createElementWithContent("h5", title);
    const cardText = createElementComplete("p", { class: "card-text" }, description);
    const btnDelete = createElementComplete("a", { id: title, class: "btn btn-danger float-end" }, "Delete");
    row.appendChild(card);
    card.appendChild(cardBody);
    cardBody.appendChild(cardTitle);
    cardTitle.appendChild(h5title);
    cardBody.appendChild(cardText);
    btnDelete.addEventListener("click", function (e) {
        deleteTask(e.target.id);
    });
    cardBody.appendChild(btnDelete);
    return row;
}

function displayError(mensaje) {
    const alert = createElementComplete("div", { class: "alert alert-danger m-3" }, mensaje);
    document.getElementById("menuAdd").appendChild(alert);
    setTimeout(function () {
        document.querySelector('.alert').remove();
    }, 3000);
}

function displayTasks() {
    document.getElementById("tasks").textContent = "";
    getTasks().forEach(task => {
        document.getElementById("tasks").appendChild(createTaskCard(task));
    });
}

function getTasks() {
    const data = JSON.parse(localStorage.getItem('tasks'));
    console.log(data);
    return data ?? [];
}

displayTasks();