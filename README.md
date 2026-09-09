# 🌿 Task Tracker — Minimalist Productivity App

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A clean, responsive task management application built with a calming botanical sage-green theme. It allows users to break high-level tasks into actionable subtasks with automatic completion percentage tracking and client-side persistence.

Built entirely with pure **Vanilla JavaScript**, featuring zero external libraries.

---

## 🚀 Live Demo

Manage your tasks live here:  
👉 **[Open Task Tracker Live](https://amanaldaher.github.io/Task-Tracker/)**

---

## 📌 Features

- **Nested Subtasks Workflow:** Break down major objectives into granular checkable steps before adding the task.
- **Dynamic Progress Bar:** Real-time percentage meter reflecting subtask completion status on each card.
- **Onboarding Welcome Screen:** Introductory screen for first-time visitors with transition animations, bypassed automatically on subsequent visits.
- **Status Filtering:** Quickly segment items into `All`, `Active`, and `Completed` tabs.
- **Automatic Timestamps:** Records the exact creation time for every task entry.
- **Persistent State:** All tasks, subtasks, and completion statuses are synchronized with `localStorage`.
- **Empty State Illustration:** Friendly fallback screen when no tasks match the selected filter.

---

## 🛠️ Built With

- **HTML5:** Semantic card layout, nested draft lists, and accessible inputs.
- **CSS3:** Custom CSS variables, gradient backgrounds, responsive flexbox layout, and smooth keyframe transitions.
- **Vanilla JavaScript (ES6+):** Array operations (`filter`, `unshift`, `splice`), dynamic DOM construction, and `localStorage` integration.

---

## 📂 Project Structure

```text
├── index.html        # App layout, onboarding view & task list containers
├── style.css         # Herb palette styling, animations & progress bar
├── script.js        # State management, subtask logic & local persistence
└── README.md         # Documentation
