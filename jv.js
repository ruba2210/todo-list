document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const categorySelect = document.getElementById("category");
    const deadlineInput = document.getElementById("dueDate");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const completedTasks = document.getElementById("completedTasks");
    const searchTask = document.getElementById("searchTask");
    const categoryFilter = document.getElementById("categoryFilter");

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        taskList.innerHTML = "";
        completedTasks.innerHTML = "";

        tasks.forEach(task => {
            addTaskToDOM(task.text, task.priority, task.category, task.completed, task.deadline);
        });

        filterTasks();  // Appliquer le filtrage initial après le chargement des tâches
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        const category = categorySelect.value;
        const deadline = deadlineInput.value;

        if (taskText === "" || deadline === "") {
            alert("Veuillez entrer une tâche et une date limite !");
            return;
        }

        const priority = "medium"; // Priorité par défaut
        addTaskToDOM(taskText, priority, category, false, deadline);
        saveTask(taskText, priority, category, false, deadline);

        taskInput.value = "";
        deadlineInput.value = "";
    }

    document.addEventListener("DOMContentLoaded", function () {
        const toggleThemeBtn = document.getElementById("toggleTheme");

        // Vérifie si un mode est enregistré dans localStorage
        if (localStorage.getItem("darkMode") === "enabled") {
            document.body.classList.add("dark");
            toggleThemeBtn.textContent = "🌞 Mode Clair";
        }

        // Ajouter un écouteur d'événement pour activer/désactiver le mode sombre
        toggleThemeBtn.addEventListener("click", function () {
            document.body.classList.toggle("dark");

            // Vérifier si le mode sombre est activé et sauvegarder dans localStorage
            if (document.body.classList.contains("dark")) {
                localStorage.setItem("darkMode", "enabled");
                toggleThemeBtn.textContent = "🌞 Mode Clair";
            } else {
                localStorage.setItem("darkMode", "disabled");
                toggleThemeBtn.textContent = "🌙 Mode Sombre";
            }
        });
    });


    function addTaskToDOM(text, priority, category, completed = false, deadline) {
        const li = document.createElement("li");
        li.className = `p-4 flex justify-between items-center bg-white border border-gray-200 rounded-lg shadow-md transition-all hover:bg-gray-100 transform hover:scale-105 duration-300`;
        li.dataset.category = category;

        const deadlineColor = getDeadlineColor(deadline);
        li.innerHTML = `
            <span class="font-medium text-lg">${text}</span>
            <span class="text-sm text-gray-500">📅 ${deadline} - ${category}</span>
            <span class="p-2 text-white rounded-full ${deadlineColor}">Échéance</span>
        `;

        if (completed) {
            li.classList.add("line-through", "text-gray-400");
            completedTasks.appendChild(li);
        } else {
            taskList.appendChild(li);
        }

        li.addEventListener("click", function () {
            li.classList.toggle("line-through");
            li.classList.toggle("text-gray-400");
            updateTaskStatus(text);
        });
    }

    function saveTask(text, priority, category, completed, deadline) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push({ text, priority, category, completed, deadline });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function updateTaskStatus(text) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.map(task => {
            if (task.text === text) {
                task.completed = !task.completed;
            }
            return task;
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
        loadTasks();  // Recharger les tâches après mise à jour
    }

    function filterTasks() {
        const searchValue = searchTask.value.toLowerCase();
        const categoryValue = categoryFilter.value;

        // Filtrer toutes les tâches, qu'elles soient complètes ou non
        const allTasks = [...taskList.children, ...completedTasks.children];

        allTasks.forEach(task => {
            const taskText = task.querySelector("span.font-medium").textContent.toLowerCase();
            const taskCategory = task.dataset.category;

            // Appliquer la recherche et le filtre par catégorie
            const matchesSearch = taskText.includes(searchValue);
            const matchesCategory = categoryValue === "all" || taskCategory === categoryValue;

            // Afficher ou cacher la tâche en fonction des critères de filtrage
            task.style.display = matchesSearch && matchesCategory ? "flex" : "none";
        });
    }

    function getDeadlineColor(deadline) {
        const today = new Date();
        const dueDate = new Date(deadline);
        const timeDiff = (dueDate - today) / (1000 * 3600 * 24);

        if (timeDiff < 0) return "bg-red-500";  // Dépassé (rouge)
        if (timeDiff <= 3) return "bg-orange-400"; // Proche (orange)
        return "bg-green-500"; // Normal (vert)
    }

    // Gestion des événements
    addTaskBtn.addEventListener("click", addTask);
    taskInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            addTask();
        }
    });

    searchTask.addEventListener("input", filterTasks);
    categoryFilter.addEventListener("change", filterTasks);

    loadTasks();
});
