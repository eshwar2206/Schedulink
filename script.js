document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskList = document.getElementById("task-list");
    const clearAllBtn = document.getElementById("clear-all-btn");
    
    document.getElementById("toggle-theme").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

    

    // Load tasks from local storage
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(task => addTask(task.text, task.datetime, task.completed));

    addTaskBtn.addEventListener("click", function () {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            addTask(taskText, "", false);
            taskInput.value = "";
            clearAllBtn.style.display = "inline-block";
            saveTasks();
        }
    });

    function addTask(taskText, datetime, completed) {
        const li = document.createElement("li");

        li.innerHTML = `
            <div class="flex justify-between items-center gap-2">
                <span class="task-text">${taskText}</span>
                <input type="datetime-local" class="expected-completion" value="${datetime}">
                <button class="complete-btn">Completed</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        const completeBtn = li.querySelector(".complete-btn");
        completeBtn.addEventListener("click", function () {
            li.classList.toggle("completed");
            saveTasks();

            
        });

        const deleteBtn = li.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", function () {
            li.remove();
            saveTasks();
            if (taskList.children.length === 0) {
                clearAllBtn.style.display = "none";
            }
        });

        if (completed) li.classList.add("completed");

        setTimeout(() => li.classList.add("task-entry"), 10);
        taskList.appendChild(li);
    }

    taskInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") addTaskBtn.click();
    });

    clearAllBtn.addEventListener("click", function () {
        taskList.innerHTML = "";
        localStorage.removeItem("tasks");
        clearAllBtn.style.display = "none";
    });

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll("li").forEach(li => {
            const text = li.querySelector(".task-text").textContent;
            const datetime = li.querySelector(".expected-completion").value;
            const completed = li.classList.contains("completed");
            tasks.push({ text, datetime, completed });
            tasks.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    
});

function updateProgress() {
    const tasks = taskList.querySelectorAll("li");
    const completed = taskList.querySelectorAll(".completed").length;
    const percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
    document.getElementById("progress-bar").style.width = percent + "%";
    document.getElementById("progress-text").innerText = `${percent}% completed`;
}

