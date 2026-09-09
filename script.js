// --- التحكم بالواجهات وتذكّر الزيارة السابقة ---
const welcomeView = document.getElementById("welcomeView");
const taskView = document.getElementById("taskView");
const startBtn = document.getElementById("startBtn");

const hasVisited = localStorage.getItem("herb_todo_has_visited");

if (hasVisited) {
  welcomeView.classList.add("hidden");
  taskView.classList.remove("hidden");
}

startBtn.addEventListener("click", () => {
  localStorage.setItem("herb_todo_has_visited", "true");
  welcomeView.classList.add("fade-out");

  setTimeout(() => {
    welcomeView.classList.add("hidden");
    taskView.classList.remove("hidden");
    taskView.classList.add("fade-in");
  }, 400);
});

// --- إدارة البيانات والمهام ---
let tasks = JSON.parse(localStorage.getItem("herb_todo_tasks")) || [];
let currentDraftSubtasks = [];
let currentFilter = "all";

const saveTasks = () => {
  localStorage.setItem("herb_todo_tasks", JSON.stringify(tasks));
};

// إدارة الخطوات الفرعية أثناء كتابة المهمة
const draftSubtasksList = document.getElementById("draftSubtasksList");
const subtaskInput = document.getElementById("subtaskInput");

const renderDraftSubtasks = () => {
  draftSubtasksList.innerHTML = "";
  currentDraftSubtasks.forEach((text, i) => {
    const li = document.createElement("li");
    li.className = "draft-item";
    li.innerHTML = `${text} <span onclick="removeDraftSubtask(${i})">&times;</span>`;
    draftSubtasksList.appendChild(li);
  });
};

const addDraftSubtask = () => {
  const val = subtaskInput.value.trim();
  if (!val) return;
  currentDraftSubtasks.push(val);
  subtaskInput.value = "";
  renderDraftSubtasks();
  subtaskInput.focus();
};

const removeDraftSubtask = (index) => {
  currentDraftSubtasks.splice(index, 1);
  renderDraftSubtasks();
};

document.getElementById("addSubtaskBtn").onclick = addDraftSubtask;
subtaskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addDraftSubtask();
  }
});

// بناء كرت المهمة مع شريط التقدّم والوقت
const createTaskNode = (task) => {
  const card = document.createElement("li");
  card.className = `task-card ${task.completed ? "all-done" : ""}`;

  const header = document.createElement("div");
  header.className = "task-header";

  const titleArea = document.createElement("div");
  titleArea.className = "task-title-area";

  const mainCheck = document.createElement("input");
  mainCheck.type = "checkbox";
  mainCheck.className = "custom-checkbox";
  mainCheck.checked = task.completed;
  mainCheck.onchange = () => toggleEntireTask(task.id);

  const titleWrap = document.createElement("div");
  titleWrap.className = "task-title-wrap";

  const title = document.createElement("span");
  title.className = "task-title";
  title.textContent = task.title;
  title.onclick = () => toggleEntireTask(task.id);

  const timeSpan = document.createElement("span");
  timeSpan.className = "task-time";
  timeSpan.textContent = task.createdAt || "Just now";

  titleWrap.appendChild(title);
  titleWrap.appendChild(timeSpan);

  titleArea.appendChild(mainCheck);
  titleArea.appendChild(titleWrap);

  const delBtn = document.createElement("button");
  delBtn.className = "del-btn";
  delBtn.innerHTML = "&times;";
  delBtn.onclick = () => deleteTask(task.id);

  header.appendChild(titleArea);
  header.appendChild(delBtn);
  card.appendChild(header);

  // شريط التقدّم وقائمة الخطوات الفرعية
  if (task.subtasks && task.subtasks.length > 0) {
    const total = task.subtasks.length;
    const completedCount = task.subtasks.filter((s) => s.done).length;
    const percent = Math.round((completedCount / total) * 100);

    const progressContainer = document.createElement("div");
    progressContainer.className = "progress-container";
    progressContainer.innerHTML = `
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" style="width: ${percent}%"></div>
      </div>
      <span class="progress-text">${completedCount}/${total} (${percent}%)</span>
    `;
    card.appendChild(progressContainer);

    const subtasksContainer = document.createElement("div");
    subtasksContainer.className = "subtasks-wrapper";

    task.subtasks.forEach((sub, subIndex) => {
      const row = document.createElement("div");
      row.className = `subtask-row ${sub.done ? "done" : ""}`;

      const subCheck = document.createElement("input");
      subCheck.type = "checkbox";
      subCheck.className = "custom-checkbox";
      subCheck.checked = sub.done;
      subCheck.onchange = () => toggleSubtask(task.id, subIndex);

      const subText = document.createElement("span");
      subText.className = "subtask-text";
      subText.textContent = sub.text;
      subText.onclick = () => toggleSubtask(task.id, subIndex);

      row.appendChild(subCheck);
      row.appendChild(subText);
      subtasksContainer.appendChild(row);
    });

    card.appendChild(subtasksContainer);
  }

  return card;
};

// إضافة مهمة جديدة مع Timestamp ومعرّف فريد
const addTask = () => {
  const titleInput = document.getElementById("mainTitle");
  const title = titleInput.value.trim();

  if (!title) {
    titleInput.focus();
    titleInput.style.borderColor = "var(--danger)";
    setTimeout(() => (titleInput.style.borderColor = "var(--border-color)"), 1000);
    return;
  }

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const newTask = {
    id: Date.now(),
    title: title,
    completed: false,
    createdAt: `Added at ${timeFormatted}`,
    subtasks: currentDraftSubtasks.map((text) => ({ text, done: false })),
  };

  tasks.unshift(newTask);
  saveTasks();

  titleInput.value = "";
  currentDraftSubtasks = [];
  renderDraftSubtasks();
  renderFilteredTasks();
};

const toggleEntireTask = (id) => {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  task.completed = !task.completed;
  task.subtasks.forEach((sub) => {
    sub.done = task.completed;
  });

  saveTasks();
  renderFilteredTasks();
};

const toggleSubtask = (id, subIndex) => {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  task.subtasks[subIndex].done = !task.subtasks[subIndex].done;
  task.completed = task.subtasks.every((s) => s.done);

  saveTasks();
  renderFilteredTasks();
};

const deleteTask = (id) => {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderFilteredTasks();
};

// الفلترة وعرض القائمة أو شاشة الـ Empty State
const renderFilteredTasks = () => {
  const taskList = document.getElementById("taskList");
  const emptyState = document.getElementById("emptyState");
  taskList.innerHTML = "";

  let filtered = tasks;
  if (currentFilter === "active") {
    filtered = tasks.filter((t) => !t.completed);
  } else if (currentFilter === "completed") {
    filtered = tasks.filter((t) => t.completed);
  }

  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
    filtered.forEach((task) => {
      taskList.appendChild(createTaskNode(task));
    });
  }
};

// تفعيل أزرار الفلترة
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderFilteredTasks();
  });
});

document.getElementById("createTaskBtn").onclick = addTask;
document.getElementById("mainTitle").addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

renderFilteredTasks();