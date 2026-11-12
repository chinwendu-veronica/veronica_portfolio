// Contact form: validates locally and shows a confirmation. It does not send or store messages.
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    document.getElementById("formMessage").textContent =
      "Thank you. Your message has been noted on this page.";
    contactForm.reset();
  });
}

// Planner: tasks are saved only in this browser using localStorage.
const taskForm = document.getElementById("taskForm");
if (taskForm) {
  const input = document.getElementById("taskInput");
  const list = document.getElementById("taskList");
  const filters = [...document.querySelectorAll("[data-filter]")];
  let tasks = [];
  let currentFilter = "all";
  try {
    tasks = JSON.parse(localStorage.getItem("veronicaTasks") || "[]");
  } catch {
    tasks = [];
  }

  const save = () =>
    localStorage.setItem("veronicaTasks", JSON.stringify(tasks));
  const render = () => {
    list.innerHTML = "";
    const visible = tasks.filter(
      (task) =>
        currentFilter === "all" ||
        (currentFilter === "done" ? task.done : !task.done),
    );
    if (!visible.length) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = tasks.length
        ? "Nothing to show here."
        : "Your list is clear. Add a task to get started.";
      list.append(empty);
      return;
    }
    visible.forEach((task) => {
      const row = document.createElement("div");
      row.className = "task" + (task.done ? " done" : "");
      const check = document.createElement("input");
      check.type = "checkbox";
      check.checked = task.done;
      check.setAttribute("aria-label", "Mark task complete");
      check.addEventListener("change", () => {
        task.done = check.checked;
        save();
        render();
      });
      const label = document.createElement("span");
      label.textContent = task.text;
      const edit = document.createElement("button");
      edit.type = "button";
      edit.textContent = "Edit";
      edit.addEventListener("click", () => {
        const updated = prompt("Edit this task:", task.text);
        if (updated !== null && updated.trim()) {
          task.text = updated.trim();
          save();
          render();
        }
      });
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "Delete";
      remove.addEventListener("click", () => {
        tasks = tasks.filter((item) => item.id !== task.id);
        save();
        render();
      });
      row.append(check, label, edit, remove);
      list.append(row);
    });
  };
  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    tasks.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      text,
      done: false,
    });
    save();
    input.value = "";
    render();
    input.focus();
  });
  filters.forEach((button) =>
    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter;
      filters.forEach((item) =>
        item.classList.toggle("active", item === button),
      );
      render();
    }),
  );
  render();
}
