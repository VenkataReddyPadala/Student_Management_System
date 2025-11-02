const tbody = document.querySelector("#tbody");

const mainTable = document.querySelector("#mainTable");
const searchBox = document.querySelector("#searchBox");
let twoTables = false;

function buildTable(students, titleText) {
  const section = document.createElement("div");

  if (titleText) {
    const h3 = document.createElement("h3");
    h3.textContent = titleText;
    section.appendChild(h3);
  }

  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Gender</th>
        <th>Class</th>
        <th>Marks</th>
        <th>Passing</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>
      ${students
        .map(
          (s) => `
        <tr>
          <td>${s.id}</td>
          <td class="profile">
            <img src="${s.img_src}" />
            <p>${s.first_name} ${s.last_name}</p>
          </td>
          <td>${s.gender}</td>
          <td>${s.class}</td>
          <td>${s.marks}</td>
          <td>${s.passing ? "Passed" : "Failed"}</td>
          <td>${s.email}</td>
        </tr>`
        )
        .join("")}
    </tbody>
  `;
  section.appendChild(table);
  return section;
}

function renderSingleTable(data) {
  twoTables = false;
  mainTable.innerHTML = "";
  mainTable.appendChild(buildTable(data));
}

function renderGenderTables(data) {
  twoTables = true;
  let females = data.filter((s) => s.gender === "Female");
  let males = data.filter((s) => s.gender === "Male");
  if (searchBox.value.trim !== "") {
    let text = searchBox.value.trim().toLowerCase();
    females = [...females].filter((student) => {
      if (
        student.first_name.toLowerCase().includes(text) ||
        student.last_name.toLowerCase().includes(text) ||
        student.email.toLowerCase().includes(text)
      ) {
        return true;
      }
    });
    males = [...males].filter((student) => {
      if (
        student.first_name.toLowerCase().includes(text) ||
        student.last_name.toLowerCase().includes(text) ||
        student.email.toLowerCase().includes(text)
      ) {
        return true;
      }
    });
  }

  mainTable.innerHTML = "";
  mainTable.appendChild(buildTable(males, "Male Students"));
  mainTable.appendChild(buildTable(females, "Female Students"));
}

function sortAtoZ(data) {
  twoTables = false;
  let sorted = [...data].sort((a, b) =>
    a.first_name.localeCompare(b.first_name)
  );
  if (searchBox.value.trim !== "") {
    searchData(null, sorted);
  }
}

function sortZtoA(data) {
  twoTables = false;
  let sorted = [...data].sort((a, b) =>
    b.first_name.localeCompare(a.first_name)
  );
  if (searchBox.value.trim !== "") {
    searchData(null, sorted);
  }
}

function sortASC(data, field) {
  twoTables = false;
  let sorted = [...data].sort((a, b) => a[field] - b[field]);
  if (searchBox.value.trim !== "") {
    searchData(null, sorted);
  }
}

function sortPassing(data) {
  const passed = data.filter((s) => s.passing === true);
  twoTables = false;
  if (searchBox.value.trim !== "") {
    searchData(null, passed);
  }
}

function sortGender(data) {
  renderGenderTables(data);
}

function searchData(e, data) {
  let text;
  if (e) text = e.target.value.trim().toLowerCase();
  else text = searchBox.value.trim().toLowerCase();
  let newData = [...data].filter((student) => {
    if (
      student.first_name.toLowerCase().includes(text) ||
      student.last_name.toLowerCase().includes(text) ||
      student.email.toLowerCase().includes(text)
    ) {
      return true;
    }
  });
  twoTables ? renderGenderTables(newData) : renderSingleTable(newData);
}

document.addEventListener("DOMContentLoaded", async () => {
  let response = await fetch(
    "https://gist.githubusercontent.com/harsh3195/b441881e0020817b84e34d27ba448418/raw/c4fde6f42310987a54ae1bc3d9b8bfbafac15617/demo-json-data.json"
  );
  let data = await response.json();
  renderSingleTable([...data]);
  const nameAsc = document.querySelector("#asc");
  const nameDsc = document.querySelector("#dsc");
  const marks = document.querySelector("#marks");
  const pass = document.querySelector("#pass");
  const byClass = document.querySelector("#class");
  const gender = document.querySelector("#gender");
  const searchBtn = document.querySelector("#searchBtn");

  nameAsc.addEventListener("click", () => sortAtoZ(data));
  nameDsc.addEventListener("click", () => sortZtoA(data));
  marks.addEventListener("click", () => sortASC(data, "marks"));
  pass.addEventListener("click", () => sortPassing(data));
  byClass.addEventListener("click", () => sortASC(data, "class"));
  gender.addEventListener("click", () => sortGender(data));
  searchBox.addEventListener("input", (e) => searchData(e, data));
  searchBtn.addEventListener("click", () => searchData(null, data));
});
