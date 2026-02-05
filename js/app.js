// To-Do List Application
class TodoApp {
  constructor() {
    this.todos = this.loadTodos();
    this.currentFilter = "all";
    this.init();
  }

  init() {
    // Get DOM elements
    this.todoForm =
      document.getElementById("todoForm");
    this.todoInput =
      document.getElementById("todoInput");
    this.dateInput =
      document.getElementById("dateInput");
    this.todoList =
      document.getElementById("todoList");
    this.emptyState =
      document.getElementById("emptyState");
    this.todoError =
      document.getElementById("todoError");
    this.dateError =
      document.getElementById("dateError");

    // Set minimum date to today
    const today = new Date()
      .toISOString()
      .split("T")[0];
    this.dateInput.setAttribute("min", today);

    // Event listeners
    this.todoForm.addEventListener(
      "submit",
      (e) => this.handleSubmit(e),
    );

    // Filter buttons
    const filterButtons =
      document.querySelectorAll(".btn-filter");
    filterButtons.forEach((button) => {
      button.addEventListener("click", (e) =>
        this.handleFilter(e),
      );
    });

    // Initial render
    this.renderTodos();
  }

  handleSubmit(e) {
    e.preventDefault();

    // Clear previous errors
    this.todoError.textContent = "";
    this.dateError.textContent = "";

    // Get values
    const todoText = this.todoInput.value.trim();
    const todoDate = this.dateInput.value;

    // Validate
    let isValid = true;

    if (!todoText) {
      this.todoError.textContent =
        "TUGAS DIPERLUKAN!";
      isValid = false;
    } else if (todoText.length < 3) {
      this.todoError.textContent =
        "TUGAS SETIDAKNYA 3 KARAKTER!";
      isValid = false;
    }

    if (!todoDate) {
      this.dateError.textContent =
        "TANGGAL DIPERLUKAN!";
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Create todo object
    const todo = {
      id: Date.now(),
      text: todoText,
      date: todoDate,
      createdAt: new Date().toISOString(),
    };

    // Add to todos array
    this.todos.push(todo);

    // Save to localStorage
    this.saveTodos();

    // Reset form
    this.todoForm.reset();

    // Re-render
    this.renderTodos();
  }

  deleteTodo(id) {
    this.todos = this.todos.filter(
      (todo) => todo.id !== id,
    );
    this.saveTodos();
    this.renderTodos();
  }

  handleFilter(e) {
    // Update active button
    document
      .querySelectorAll(".btn-filter")
      .forEach((btn) => {
        btn.classList.remove("active");
      });
    e.target.classList.add("active");

    // Set current filter
    this.currentFilter = e.target.dataset.filter;

    // Re-render
    this.renderTodos();
  }

  getFilteredTodos() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (this.currentFilter) {
      case "today":
        return this.todos.filter((todo) => {
          const todoDate = new Date(todo.date);
          todoDate.setHours(0, 0, 0, 0);
          return (
            todoDate.getTime() === today.getTime()
          );
        });

      case "upcoming":
        return this.todos.filter((todo) => {
          const todoDate = new Date(todo.date);
          todoDate.setHours(0, 0, 0, 0);
          return (
            todoDate.getTime() > today.getTime()
          );
        });

      case "past":
        return this.todos.filter((todo) => {
          const todoDate = new Date(todo.date);
          todoDate.setHours(0, 0, 0, 0);
          return (
            todoDate.getTime() < today.getTime()
          );
        });

      default: // 'all'
        return this.todos;
    }
  }

  renderTodos() {
    const filteredTodos = this.getFilteredTodos();

    // Clear list
    this.todoList.innerHTML = "";

    // Check if empty
    if (filteredTodos.length === 0) {
      this.todoList.classList.remove("show");
      this.emptyState.style.display = "block";
      return;
    }

    this.emptyState.style.display = "none";
    this.todoList.classList.add("show");

    // Sort by date (earliest first)
    filteredTodos.sort(
      (a, b) =>
        new Date(a.date) - new Date(b.date),
    );

    // Render each todo
    filteredTodos.forEach((todo) => {
      const todoItem =
        this.createTodoElement(todo);
      this.todoList.appendChild(todoItem);
    });
  }

  createTodoElement(todo) {
    const div = document.createElement("div");
    div.className = "todo-item";

    // Format date
    const date = new Date(todo.date);
    const formattedDate = date.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );

    // Check if overdue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todoDate = new Date(todo.date);
    todoDate.setHours(0, 0, 0, 0);
    const isOverdue =
      todoDate.getTime() < today.getTime();

    div.innerHTML = `
            <div class="todo-content">
                <div class="todo-text">${this.escapeHtml(todo.text)}</div>
                <div class="todo-date ${isOverdue ? "overdue" : ""}">
                    ${formattedDate}${isOverdue ? " (OVERDUE)" : ""}
                </div>
            </div>
            <button class="btn-delete" data-id="${todo.id}">DELETE</button>
        `;

    // Add delete event listener
    const deleteBtn = div.querySelector(
      ".btn-delete",
    );
    deleteBtn.addEventListener("click", () => {
      this.deleteTodo(todo.id);
    });

    return div;
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  saveTodos() {
    localStorage.setItem(
      "todos",
      JSON.stringify(this.todos),
    );
  }

  loadTodos() {
    const stored = localStorage.getItem("todos");
    return stored ? JSON.parse(stored) : [];
  }
}

// Initialize app when DOM is ready
document.addEventListener(
  "DOMContentLoaded",
  () => {
    new TodoApp();
  },
);
