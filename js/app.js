// HTTP Fetch
class HTTP {
  async get(url) {
    const response = await fetch(url);
    const resData = await response.json();
    return resData;
  }
}

const http = new HTTP();

// UI Variables
const gridContainer = document.getElementById('employee-container');
const overlay = document.querySelector('.overlay');
const modalContainer = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');
const search = document.getElementById('search');

// Employees Variables
const employees = [];

// Get Employees
http
  .get('https://randomuser.me/api/?nat=us&results=12')
  .then((data) => {
    for (employee of data.results) {
      employees.push(employee);
    }
  })
  .then(displayEmployees)
  .catch((err) => console.log(err));

// Display Employees
function displayEmployees() {
  employees.forEach((employee, index) => {
    const name = `${employee.name.first} ${employee.name.last}`;
    const email = `${employee.email}`;
    const city = `${employee.location.city}`;
    const picture = `${employee.picture.large}`;

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
  });
}

// Create Modal
function displayModal(index) {
  const {
    name,
    dob,
    phone,
    email,
    location: { city, street, state, postcode },
    picture,
  } = employees[index];

  let date = new Date(dob.date);
  const modalHTML = `
    <img class ="avatar" src="${picture.large}">
    <div class ="text-container">
      <h2 class="name">${name.first} ${name.last}</h2>
      <p class="email">${email}</p>
      <p class="city">${city}</p>
      <hr>
      <p class="phone">${phone}</p>
      <p class="address">${street.number} ${
    street.name
  }, ${state} ${postcode}</p>
      <p class="birthday">Birthday: ${
        date.getMonth() + 1
      }/${date.getDate()}/${date.getFullYear()}</p>
    </div>
  `;

  overlay.classList.remove('hidden');
  modalContainer.innerHTML = modalHTML;
}

// Open Modal
gridContainer.addEventListener('click', (e) => {
  if (e.target !== gridContainer) {
    const employee = e.target.closest('.employee');
    const index = employee.getAttribute('data-index');

    displayModal(index);
  }
});

// Close Modal
modalClose.addEventListener('click', () => {
  overlay.classList.add('hidden');
});
overlay.addEventListener('click', () => {
  overlay.classList.add('hidden');
});

// Search Employees
function lookUp(e) {
  const users = document.querySelectorAll('.employee .text-container h2');
  const usersToArray = Array.from(users);
  const input = e.target.value.toUpperCase();

  usersToArray.forEach((user) => {
    if (!user.textContent.toUpperCase().includes(input)) {
      user.parentElement.parentElement.style.display = 'none';
    } else {
      user.parentElement.parentElement.style.display = '';
    }
  });
}
search.addEventListener('keyup', lookUp);
