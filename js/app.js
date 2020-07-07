class HTTP {
  async get(url) {
    const response = await fetch(url);
    const resData = await response.json();
    return resData;
  }
}

const http = new HTTP();
const gridContainer = document.getElementById('employee-container');
const employees = [];
const overlay = document.querySelector('.overlay');
const modalContainer = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');

let cnt = 0;
const maxNum = 12;

// Get Employees
function getEmployees() {
  if (cnt >= maxNum) return; // stop

  http.get('https://randomuser.me/api/').then((data) => {
    employees.push(data);
    const name = `${data.results[0].name.first} ${data.results[0].name.last}`;
    const email = `${data.results[0].email}`;
    const city = `${data.results[0].location.city}`;
    const picture = `${data.results[0].picture.large}`;
    const index = `${data.info.seed}`;

    const employeeHTML = `
        <div class="employee" data-index="${index}">
          <img class="avatar" src="${picture}">
          <div class="text-container">
            <h2 class="name">${name}</h2>
            <p class="email">${email}</p>
            <p class="address">${city}</p>
          </div>
        </div>
      `;

    gridContainer.innerHTML += employeeHTML;

    cnt++;
    getEmployees();
  });
}
getEmployees();

// Create Modal
function displayModal(index) {
  employees.forEach((employee) => {
    if (employee.info.seed === `${index}`) {
      const name = `${employee.results[0].name.first} ${employee.results[0].name.last}`;
      const email = `${employee.results[0].email}`;
      const city = `${employee.results[0].location.city}`;
      const picture = `${employee.results[0].picture.large}`;
      const phone = `${employee.results[0].phone}`;
      const address = `${employee.results[0].location.street.number}, ${employee.results[0].location.state} ${employee.results[0].location.postcode}}`;
      const dob = `${employee.results[0].dob}`;

      let date = new Date(dob);
      const modalHTML = `
        <img class ="avatar" src="${picture}">
        <div class ="text-container">
          <h2 class="name">${name}</h2>
          <p class="email">${email}</p>
          <p class="city">${city}</p>
          <hr>
          <p class="phone">${phone}</p>
          <p class="address">${address}</p>
          <p class="birthday">Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
        </div>
      `;

      overlay.classList.remove('hidden');
      modalContainer.innerHTML = modalHTML;
    }
  });
}

gridContainer.addEventListener('click', (e) => {
  if (e.target !== gridContainer) {
    const employee = e.target.closest('.employee');
    const index = employee.getAttribute('data-index');

    displayModal(index);
  }
});

modalClose.addEventListener('click', () => {
  overlay.classList.add('hidden');
});
