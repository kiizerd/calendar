const tabl = document.getElementById("calendar-table");
const monthYear = document.getElementById("monthAndYear");
const focusParent = document.getElementById("focus-parent");
const newFocus = document.createElement('div');
const focusHead = document.createElement('div');
const closeBtn = document.createElement('button');

const months = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];    
const days = [];

let sheet = document.styleSheets[1];
let rules = sheet.cssRules || sheet.rules;

let focused;
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectMonth = currentMonth;
let selectYear = currentYear;

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


removeFocus = (e) => {
    if (e.target !== focused.element) {

        requestAnimationFrame(() => {
            newFocus.classList.remove('focus');
            newFocus.classList.add('focus-start');
        });
        
        focusParent.innerHTML = '';
        focusParent.removeEventListener('click', removeFocus);
        rules[14].style["z-index"] = -90;
    }
}

let offsetX;
let offsetY;

makeFocus = (e) => {
    const cell = e.target;
    
    offsetX = ((e.clientX * 100) / 1920);
    offsetY = ((e.screenY * 100) / 1080);

    let headText = cell.textContent + " " + cell.month;

    newFocus.classList.add('focus-start');

    requestAnimationFrame(() => {
        newFocus.classList.remove('focus-start');
        newFocus.classList.add('focus');
    });

    
    newFocus.style.id = 'focus';
    newFocus.appendChild(focusHead);
    focusHead.innerHTML = `<u>${headText}</u>`;

    rules[16].style.top = offsetY + 'vh';
    rules[16].style.left = offsetX + 'vw'; //focus start rule
    
    rules[14].style["z-index"] = 1; //focus parent rule

    focusParent.appendChild(newFocus);
    focusParent.id = 'focus-parent';
    
    focused = {
        headText: focusHead.textContent,
        day: cell.textContent,
        month: cell.month,
        element: newFocus
    }

    focusParent.addEventListener('click', removeFocus);
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
                cell.classList.add("empty")
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
                }
                cell.appendChild(cellText);
                days.push(cell);
                row.appendChild(cell);
                cell.classList.add("day");
                monthObj.days[date] = {
                    num: cell.textContent,
                    element: cell,
                };
                days[date - 1].month = months[month];
                cell.addEventListener('click', makeFocus)
                date++
            }

        }
        tabl.appendChild(row);
    }

}


makeCalendar(currentMonth, currentYear);