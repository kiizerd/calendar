const tabl = document.getElementById("calendar-table");
const monthYear = document.getElementById("monthAndYear");

const months = ["January", "February", "March", "April", "May", "June",
     "July", "August", "September", "October", "November", "December"];

const days = [];

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectMonth = document.getElementById("year");
let selectYear = document.getElementById("month");

const monthObj = {
    name: months[currentMonth],
    num: currentMonth,
    days: {
    },
}


next = () => {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    makeCalendar(currentMonth, currentYear);
}


previous = () => {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    makeCalendar(currentMonth, currentYear);
}


jump = () => {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    makeCalendar(currentMonth, currentYear);
}


makeCalendar = (month, year) => {
    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();

    days.length = 0;

    tabl.innerHTML = ""; 

    monthYear.textContent = months[month] + " " + year;
    selectYear.value = year;
    selectMonth.value = year;

    let date = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement("tr");

        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                const cell = document.createElement("td");
                const cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);    
            } else if (date > daysInMonth) {
                break;
            } else {
                const cell = document.createElement("td");
                const cellText = document.createTextNode(date);
                if (date === today.getDate()
                    && year === today.getFullYear() 
                    && month === today.getMonth()) {
                    cell.classList.add("today")
                } // color todays date
                cell.appendChild(cellText);
                days.push(cell);
                row.appendChild(cell);
                monthObj.days[date] = {
                    num: cell.textContent,
                    element: cell,
                };
                date++
            }
            
        }

        tabl.appendChild(row);
    }
}


makeCalendar(currentMonth, currentYear);
