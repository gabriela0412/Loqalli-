const calendarEl = document.getElementById('calendar');
const currentMonthEl = document.getElementById('currentMonth');
const prevBtn = document.getElementById('prevMonth');
const nextBtn = document.getElementById('nextMonth');

let currentDate = new Date();
let selectedDate = null;

function renderCalendar(date) {
  calendarEl.innerHTML = '';
  const year = date.getFullYear();
  const month = date.getMonth();
  currentMonthEl.textContent = date.toLocaleString('default', { month: 'long', year: 'numeric' });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weekdays = ['S','M','T','W','T','F','S'];
  weekdays.forEach(d => {
    const wd = document.createElement('div');
    wd.className = 'weekday';
    wd.textContent = d;
    calendarEl.appendChild(wd);
  });

  for (let i = 0; i < firstDay; i++) {
    calendarEl.appendChild(document.createElement('div'));
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dayEl = document.createElement('div');
    dayEl.className = 'day';
    dayEl.textContent = d;
    dayEl.addEventListener('click', () => {
      if(selectedDate) selectedDate.classList.remove('selected');
      dayEl.classList.add('selected');
      selectedDate = dayEl;
    });
    calendarEl.appendChild(dayEl);
  }
}

prevBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

nextBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

renderCalendar(currentDate);


const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');

uploadBtn.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', () => {
  previewContainer.innerHTML = '';
  const files = fileInput.files;
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement('img');
      img.src = e.target.result;
      previewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});
