// index.js (final, sanitized version)

let raw = JSON.parse(localStorage.getItem("notes")) || [];

// Sanitize loaded data: ensure val is string and date is a usable string.
// If a date is missing or equals "Invalid Date", replace with current toLocaleString().
let data = raw.map(n => {
  const val = (n && typeof n.val === "string") ? n.val : "";
  let date = (n && n.date) ? String(n.date) : new Date().toLocaleString();
  if (!date.trim() || date === "Invalid Date") date = new Date().toLocaleString();
  return { val, date };
});

// Persist sanitized data back (so user storage is repaired)
localStorage.setItem("notes", JSON.stringify(data));

// Display all notes
function displayNote(filter = "") {
  const container = document.getElementById("allNote");
  container.innerHTML = "";

  data.forEach((note, i) => {
    const noteVal = note.val || "";
    if (noteVal.toLowerCase().includes(filter.toLowerCase())) {
      addNote(note, i);
    }
  });
}

// Initial load
displayNote();

// Add new note (button)
document.getElementById("btn").addEventListener("click", () => {
  addNote();
});

// Add note card
function addNote(note = { val: "", date: new Date().toLocaleString() }, i = data.length) {
  // Ensure note has safe fields
  note.val = note.val || "";
  note.date = note.date && note.date !== "Invalid Date" ? note.date : new Date().toLocaleString();

  const divEle = document.createElement("div");
  divEle.setAttribute("class", "singleNote");

  divEle.innerHTML = `
    <div>
      <span class='index'>${i + 1}</span>
      <button class="editBtn">
        <span class='add ${note.val ? "" : "hidden"}'>Edit</span>
        <span class='save ${note.val ? "hidden" : ""}'>Save</span>
      </button>
      <button class="removeBtn">Remove</button>
    </div>
    <div>
      <div class="note ${note.val ? "" : "hidden"} viewNote"></div>
      <textarea class="note ${note.val ? "hidden" : ""} editNote"></textarea>
    </div>
    <div class="date">${note.date}</div>
  `;

  let editBtn = divEle.querySelector(".editBtn");
  let txtA = divEle.querySelector(".editNote");
  let div = divEle.querySelector(".viewNote");
  let removeBtn = divEle.querySelector(".removeBtn");
  let add = divEle.querySelector(".add");
  let save = divEle.querySelector(".save");

  // populate values
  txtA.value = note.val;
  div.innerHTML = marked(note.val);

  // toggle edit/view
  editBtn.addEventListener("click", () => {
    // when switching, update preview from textarea
    div.innerHTML = marked(txtA.value);
    txtA.classList.toggle("hidden");
    div.classList.toggle("hidden");
    save.classList.toggle("hidden");
    add.classList.toggle("hidden");
    updateStorage();
  });

  // remove note (index i corresponds to data's index)
  removeBtn.addEventListener("click", () => {
    data.splice(i, 1);
    updateStorage();
    displayNote(document.getElementById("search").value);
  });

  // live update storage when typing
  txtA.addEventListener("input", () => updateStorage());

  document.getElementById("allNote").append(divEle);
}

// Update localStorage with DOM order and sanitize dates again
function updateStorage() {
  let allCards = document.querySelectorAll(".singleNote");
  data = [];
  allCards.forEach(card => {
    let val = card.querySelector("textarea").value || "";
    let date = card.querySelector(".date").textContent || new Date().toLocaleString();
    if (!date.trim() || date === "Invalid Date") date = new Date().toLocaleString();
    data.push({ val, date });
  });
  localStorage.setItem("notes", JSON.stringify(data));
}

// Search functionality
document.getElementById("search").addEventListener("input", (e) => {
  displayNote(e.target.value);
});

// Dark mode toggle
document.getElementById("toggleTheme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.getElementById("toggleTheme").textContent =
    document.body.classList.contains("dark") ? "☀️ Light Mode" : "🌙 Dark Mode";
});
