const tabl = document.getElementById("calendar-table");
const monthYear = document.getElementById("monthAndYear");
const focusParent = document.getElementById("focus-parent");
const newFocus = document.createElement('div');
const focusHead = document.createElement('div');
const addBtn = document.createElement('div');

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


addEvent = (e) => {

}


removeFocus = (e) => {
    let dontClose = Array.from(focused.element.children);
    dontClose.push(focused.element, focused.headElement.childNodes[0],
                      focused.headElement.childNodes[0].childNodes[0]);
    if (!dontClose.includes(e.target)) {
        requestAnimationFrame(() => {
            newFocus.classList.remove('focus');
            newFocus.classList.add('focus-start');
        });
        
        setTimeout(() => {
            focusParent.innerHTML = ''
            rules[15].style["z-index"] = -90;            
        }, 1300);
        focusParent.removeEventListener('click', removeFocus);
        focused = undefined;
    }
}


makeFocus = (e) => {
    const cell = e.target;
    
    let headText = cell.textContent + " " + cell.month;
    addBtn.textContent = ' + '

    addBtn.classList.add('add-btn', 'btn');
    newFocus.classList.add('focus-start');

    rules[17].style.top = e.y + 'px';
    rules[17].style.left = e.x + 'px'; //focus start rule

    requestAnimationFrame(() => {
        newFocus.classList.remove('focus-start');
        newFocus.classList.add('focus', 'card');
    });
    
    newFocus.id = 'focus';
    newFocus.appendChild(addBtn);
    newFocus.appendChild(focusHead);
    focusHead.innerHTML = `<i><u>${headText}</u></i>`;
    
    rules[15].style["z-index"] = 1; //focus parent rule

    focusParent.appendChild(newFocus);
    focusParent.id = 'focus-parent';
    
    focused = {
        day: cell.textContent,
        month: cell.month,
        headText: focusHead.textContent,
        headElement: focusHead,
        element: newFocus,
        cellElement: cell,
        events: {
        }, 
    }

    addBtn.addEventListener('click', addEvent);
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