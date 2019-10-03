
const tasksURL = "http://localhost:3000/tasks";
const userURL = "http://localhost:3000/users"
let CURRENT_USER_ID = null;

let CURRENT_EDIT_TASK_ID = null

document.addEventListener("DOMContentLoaded",() => {
    const forms = getForms();
    // console.log(forms.loginForm);
    forms.newTaskForm.addEventListener('submit', e => addTask(e));
    forms.editTaskForm.addEventListener('submit', e => updateTask(e));
    forms.loginForm.addEventListener('submit', e => handleLoginSubmit(e));
    forms.deleteUserForm.addEventListener('submit', e => deleteUser(e));
})

function getForms() {
    return { 
        "newTaskForm": document.getElementById("new_task_form"),
        "editTaskForm": document.getElementById("edit_task_form"),
        "loginForm": document.getElementById("login_form"),
        "deleteUserForm": document.getElementById("delete_user_form")
    };
}

function togglePage() {
    const loginPage = document.querySelector('.login_page');
    const taskPage = document.querySelector('.task_page');
    loginPage.style.display = "none";
    taskPage.style.display = "block";
}

function deleteUser(event) {
    // event.preventDefault();

    fetch(`${userURL}/${CURRENT_USER_ID}`, {
        method: "DELETE"
    })
    .catch(err => alert(err.message));
    // CURRENT_USER_ID = null;
    // debugger .then(togglePage)
    // .then(response => response.json())
    // window.location.reload(false);
    // console.log(window)
    // togglePage();
}

function handleLoginSubmit(event) {
    event.preventDefault();
    const forms = getForms();
    const username = event.target.username_input.value;
    fetch(userURL)
    .then(response => response.json())
    .then(json => findOrCreateUser(json, username))
    .catch(err => alert(err.message));
    forms.loginForm.reset();
}

function findOrCreateUser(usersArray, username) {
    const user = usersArray.find(user => user.name === username);
    const usernameTitle = document.getElementById('username_title');
    // console.log(user)
    if (user) {
        //toggle to Task Page and populate it with user's tasks
        CURRENT_USER_ID = user.id;
        displayUserTasks();
    } else {
        //create user and toggle to empty Task Page
        createUser(username);
    }
    usernameTitle.textContent = `${username}`
    togglePage();
}

function createUser(username) {
    fetch(userURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
                "name": username
        })
    })
    .then(response => response.json())
    .then(json => setNewUserAsCurrent(json))
    .catch(err => alert(err.message));
}

function setNewUserAsCurrent(user) {
    CURRENT_USER_ID = user.id
    // console.log("in set ", CURRENT_USER_ID);
}

function displayUserTasks() {
    fetch(
        `${userURL}/${CURRENT_USER_ID}`
        ).then(response => response.json())
        .then(json =>displayTasks(json))
        .catch(err => alert(err.message));
}

function displayTasks(user) {
    for (task of user.tasks) {
        // console.log(task);
        createTaskNode(task);
    }
}

function createTaskNode(taskObj){
    // console.log(taskObj)
    let li = document.createElement('li');
    const blockquote = document.createElement('blockquote');
    const pTag = document.createElement('p');

    const br = document.createElement('br');
    const editButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    li.id = taskObj.id;
    
    blockquote.className = 'blockquote';
    
    pTag.textContent = taskObj.text;

    editButton.textContent = 'Edit';
    editButton.addEventListener('click', (e) => populateEditTaskForm(taskObj.id));
    deleteButton.className = 'btn-danger'
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', (e) => deleteTask(taskObj.id));
   
    blockquote.appendChild(pTag);
    blockquote.appendChild(br);
    blockquote.appendChild(editButton);
    blockquote.appendChild(deleteButton);
    li.appendChild(blockquote)
    
    taskStateSwitch(taskObj.state, li);
}

function taskStateSwitch(state, li) {
    switch (state) {
        case 'To Do':
            document.getElementById('To Do').appendChild(li);
            break;
        case 'Working':
            document.getElementById('Working').appendChild(li)
            break;
        case 'Done':
            document.getElementById('Done').appendChild(li)
            break;
        default:
            console.log('Game over, man. Game over! Now what are we supposed to do?!');
    }

}

function addTask(event){
    event.preventDefault();
    const forms = getForms();
    const newTask = new Task(event.target[0].value, event.target[1].value, CURRENT_USER_ID);
    // console.log(newTask)
    postNewTask(newTask);
    forms.newTaskForm.reset();
}

function postNewTask(taskObj) {
    // console.log(taskObj)
    fetch(tasksURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
                "text": taskObj.text,
                "state": taskObj.state,
                "user_id": taskObj.userId
        })
    }).then(response => response.json())
    .then(json => createTaskNode(json))
    .catch(err => alert(err.message)); 
}


function populateEditTaskForm(taskId) {
    CURRENT_EDIT_TASK_ID = taskId
    // console.log("In populateEditTaskForm = ", CURRENT_EDIT_TASK_ID)
    const forms = getForms();
    const li = document.getElementById(`${taskId}`)
    forms.editTaskForm.parentElement.style.display = 'block';
    forms.editTaskForm.querySelector('input').value = li.querySelector('p').textContent;
    document.getElementById('edit_task_state').value = li.parentElement.id;
}

function updateTask(event){
    event.preventDefault();
    // console.log("In updateTask = ", CURRENT_EDIT_TASK_ID)
    const text = event.target[0].value;
    const state = event.target[1].value;
    const id = CURRENT_EDIT_TASK_ID;
    const forms = getForms();
    // console.log(id)
    fetch(`${tasksURL}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            id,
            text,
            state
        })
    }).then(response => response.json())
    .then(json => updateDOMTask(json))
    .catch(err => alert(err.message));
    forms.editTaskForm.reset();
    forms.editTaskForm.parentElement.style.display = 'none';
}

function updateDOMTask(taskObj) {
    const li = document.getElementById(`${taskObj.id}`);
    li.querySelector('p').textContent = taskObj.text;
    if (li.parentElement.id !== taskObj.state) {
        li.remove();
        createTaskNode(taskObj);
    }
}

function deleteTask(taskId) {
    event.preventDefault();
    const taskLi = document.getElementById(taskId);
    taskLi.remove();
    fetch(`${tasksURL}/${taskId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({"id": taskId })
    }).catch(err => alert(err.message));
        //.then(console.log) .then(response => response.json()) json => removeTaskFromDOM(json, taskId)).catch(err => alert(err.message));
}



