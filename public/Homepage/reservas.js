const calendarBody = document.querySelector("#calendar tbody");
const monthYear = document.getElementById("monthYear");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectedDate = null;

function getMonthName(month) {
  const date = new Date(currentYear, month);
  return date.toLocaleString("es-ES", { month: "long" });
}

function renderCalendar(month, year) {
  calendarBody.innerHTML = "";

  
  monthYear.textContent = `${getMonthName(month).charAt(0).toUpperCase() + getMonthName(month).slice(1)} ${year}`;

  let firstDay = new Date(year, month, 1).getDay();
  let daysInMonth = new Date(year, month + 1, 0).getDate();

  let date = 1;
  for (let i = 0; i < 6; i++) {
    let row = document.createElement("tr");

    for (let j = 0; j < 7; j++) {
      let cell = document.createElement("td");

      if (i === 0 && j < firstDay) {
        cell.textContent = "";
      } else if (date > daysInMonth) {
        cell.textContent = "";
      } else {
        cell.textContent = date;

        let cellDate = new Date(year, month, date);

        
        cell.addEventListener("click", () => {
          document.querySelectorAll("#calendar td").forEach(td =>
            td.classList.remove("selected")
          );
          cell.classList.add("selected");
          selectedDate = cellDate;
        });

        if (
          date === today.getDate() &&
          month === today.getMonth() &&
          year === today.getFullYear()
        ) {
          cell.style.border = "2px solid #812828";
          cell.style.fontWeight = "bold";
        }

        date++;
      }
      row.appendChild(cell);
    }

    calendarBody.appendChild(row);
  }
}


prevMonth.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  if (currentYear < 2025) currentYear = 2025; 
  renderCalendar(currentMonth, currentYear);
});


nextMonth.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  if (currentYear > 2030) currentYear = 2030; 
  renderCalendar(currentMonth, currentYear);
});


renderCalendar(currentMonth, currentYear);


document.getElementById("reservarBtn").addEventListener("click", () => {
  const hora = document.getElementById("hora").value;
  if (!selectedDate || !hora) {
    alert("Selecciona fecha y hora");
  } else {
    
    alert(`Reserva confirmada para ${selectedDate.toLocaleDateString()} a las ${hora}`);
  }
});
