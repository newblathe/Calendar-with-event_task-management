//getting all the dom elements required
//left part elements
const calendar = document.querySelector(".calendar");
const month_year = document.querySelector(".month_year");
const days = document.querySelector(".days");
const prev_button = document.querySelector(".prev_button");
const next_button = document.querySelector(".next_button");
const today_button = document.querySelector(".today_button");
const to_date_input = document.querySelector(".to_date_input");
const go_to_button = document.querySelector(".go_to_button");

//right part elements
const open_menu = document.querySelector(".open_menu");
const add_event_tasks = document.querySelector(".add_event-tasks");
const event_name = document.querySelector(".event_name");
const tasks_name = document.querySelector(".tasks_name");
const name_array = [event_name, tasks_name];
const event_from = document.querySelector(".event_from");
const event_to = document.querySelector(".event_to");
const tasks_from = document.querySelector(".tasks_from");
const tasks_to = document.querySelector(".tasks_to");
const from_to = [event_from, event_to, tasks_from, tasks_to];
const selected_day = document.querySelector(".selected_day");
const selected_date = document.querySelector(".selected_date");
const event_table = document.querySelector(".event_table");
const tasks_table = document.querySelector(".tasks_table");
const add_event_button = document.querySelector(".add_event_button");
const add_tasks_button = document.querySelector(".add_tasks_button");

const dustbins = document.querySelectorAll(".dustbin");

let selected_date_array;

//getting current date, month and year
let today = new Date();
let current_date = today.getDate();
let current_month = today.getMonth();
let current_year = today.getFullYear();

//making a container for months that maps each month to a number
let month_container = {
  0: "January",
  1: "Febuary",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December",
};

//getting key by value
function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

//storing information about events and tasks
let event_array = [];
let tasks_array = [];

//getting events data from local storage
if (localStorage.getItem("event_array_string") !== null) {
  event_array = JSON.parse(localStorage.getItem("event_array_string"));
}

//getting tasks data from local storage
if (localStorage.getItem("tasks_array_string") !== null) {
  tasks_array = JSON.parse(localStorage.getItem("tasks_array_string"));
}

//left part
// function to add dates
function insert_data() {
  // populating month_year
  const month_year_value = document.createTextNode(
    `${month_container[current_month]}, ${current_year}`
  );
  month_year.replaceChildren(month_year_value);
  const first_date = 1;
  // getting last date of the current month
  const last_date = new Date(current_year, current_month + 1, 0).getDate();
  // getting last date of prev_button month
  const prev_last_date = new Date(current_year, current_month, 0).getDate();
  // getting days of the next_button month that are to be shown in the current month
  const next_days =
    7 - new Date(current_year, current_month + 1, 0).getDay() - 1;
  // getting days of the previous month that are to be shown in the current month
  let prev_days = new Date(current_year, current_month, first_date).getDay();
  // populating prev_button month's dates that are shown in the current month
  for (; prev_days > 0; prev_days--) {
    const prev_date = document.createElement("div");
    prev_date.setAttribute("class", "day prev_day");
    prev_date_value = document.createTextNode(
      `${prev_last_date - prev_days + 1}`
    );
    prev_date.appendChild(prev_date_value);
    days.appendChild(prev_date);
  }
  // populating current month's dates
  for (let i = 1; i <= last_date; i++) {
    // checking if event or task is present
    let event = false;
    let tasks = false;

    for (let j = 0; j < event_array.length; j++) {
      if (
        event_array[j].event_date == i &&
        event_array[j].event_month == current_month + 1 &&
        event_array[j].event_year == current_year
      ) {
        event = true;
        break;
      }
    }

    for (let k = 0; k < tasks_array.length; k++) {
      if (
        tasks_array[k].tasks_date == i &&
        tasks_array[k].tasks_month == current_month + 1 &&
        tasks_array[k].tasks_year == current_year
      ) {
        tasks = true;
        break;
      }
    }

    const date = document.createElement("div");
    date.setAttribute("class", "day");
    date_value = document.createTextNode(`${i}`);
    date.appendChild(date_value);

    if (
      i === new Date().getDate() &&
      current_month === new Date().getMonth() &&
      current_year === new Date().getFullYear()
    ) {
      if (event && tasks) {
        date.setAttribute("class", "day today event tasks");
      } else if (event) {
        date.setAttribute("class", "day today event");
      } else if (tasks) {
        date.setAttribute("class", "day today tasks");
      } else {
        date.setAttribute("class", "day today");
      }
    } else if (event || tasks) {
      if (event && tasks) {
        date.setAttribute("class", "day event tasks");
      } else if (event) {
        date.setAttribute("class", "day event");
      } else if (tasks) {
        date.setAttribute("class", "day tasks");
      }
    } else {
      date.setAttribute("class", "day");
    }

    days.appendChild(date);
  }
  // populating next_button month's dates that are shown in the current month
  for (let j = 1; j <= next_days; j++) {
    const next_date = document.createElement("div");
    next_date.setAttribute("class", "day next_day");
    next_date_value = document.createTextNode(`${j}`);
    next_date.appendChild(next_date_value);
    days.appendChild(next_date);
  }
  addactive();
}

insert_data();

//selecting today and showing today's event and tasks as default

selected(current_date);
show(current_date);

//functionalizing prev_button and setting up previous month
function prev_month() {
  //updating current month
  current_month--;
  if (current_month < 0) {
    current_month = 11;
    current_year--;
  }
  //clearind dates that were preiviously appeneded
  days.replaceChildren();
  insert_data();
}
prev_button.addEventListener("click", prev_month);

//functionalizing next_button and setting up next month
function next_month() {
  //updating current month
  current_month++;
  if (current_month > 11) {
    current_month = 0;
    current_year++;
  }
  //clearing dates that were preiviously appended
  days.replaceChildren();
  insert_data();
}
next_button.addEventListener("click", next_month);

//functionalizing today button
today_button.addEventListener("click", () => {
  current_date = new Date().getDate();
  current_month = new Date().getMonth();
  current_year = new Date().getFullYear();
  days.replaceChildren();
  insert_data();
  document.querySelectorAll(".day").forEach((day) => {
    if (
      day.classList.contains("today") &&
      !day.classList.contains("next_day") &&
      !day.classList.contains("prev_day")
    ) {
      day.classList.add("active");
      selected(current_date);
      show(current_date);
    }
  });


});
//functionalizing go_to button
go_to_button.addEventListener("click", (e) => {
  const to_date_array = to_date_input.value.split("-");
  if (to_date_array[0] && to_date_array[1] && to_date_array[2]) {
    current_date = Number(to_date_array[2]);
    current_month = Number(to_date_array[1]) - 1;
    current_year = Number(to_date_array[0]);
    days.replaceChildren();
    insert_data();
    //selecting the date inserted
    document.querySelectorAll(".day").forEach((day) => {
      if (
        Number(day.innerHTML) === current_date &&
        !day.classList.contains("prev_day") &&
        !day.classList.contains("next_day")
      ) {
        day.classList.add("active");
        selected(to_date_array[2]);
        show(current_date);
      }
    });
    //selecting the date

    e.preventDefault();
  } else {
    return false;
  }

});
//setting up clicks
function addactive() {
  document.querySelectorAll(".day").forEach((day) => {
    day.addEventListener("click", (e) => {
      //updating current date
      current_date = Number(e.target.innerHTML);
      //updating events and tasks
      //removing active
      document.querySelectorAll(".day").forEach((day) => {
        day.classList.remove("active");
      });
      //if prevdates clicked go to prev month and select that date
      if (e.target.classList.contains("prev_day")) {
        prev_month();
        document.querySelectorAll(".day").forEach((day) => {
          if (
            !day.classList.contains("prev_day") &&
            day.innerHTML === e.target.innerHTML
          ) {
            day.classList.add("active");
            //updating events and tasks on clicks and changing selected day and date
            selected(day.innerHTML);
            show(Number(day.innerHTML));
          }
        });
      } else if (e.target.classList.contains("next_day")) {
        next_month();
        document.querySelectorAll(".day").forEach((day) => {
          if (
            !day.classList.contains("next_day") &&
            day.innerHTML === e.target.innerHTML
          ) {
            day.classList.add("active");
            //updating events and tasks on clicks and changing selected day and date
            selected(day.innerHTML);
            show(Number(day.innerHTML));
          }
        });
      } else {
        e.target.classList.add("active");
        //updating events on click
        selected(e.target.innerHTML);
        show(Number(e.target.innerHTML));
      }

    });
  });
}
//right part
//adding functionality for open menu button
open_menu.addEventListener("click", () => {
  add_event_tasks.classList.toggle("active");
});

// closing menu if clicked anywhere else
document.addEventListener("click", (e) => {
  if (e.target !== open_menu && !add_event_tasks.contains(e.target)) {
    add_event_tasks.classList.remove("active");
  }
});

// adding length cap to event and tasks name
for (let i = 0; i < name_array.length; i++) {
  name_array[i].addEventListener("input", () => {
    name_array[i].value = name_array[i].value.slice(0, 50);
  });
}

//setting up selected date
function selected(date) {
  selected_date.innerHTML =
    date + " " + month_container[current_month] + " " + current_year;
  selected_day.innerHTML = `${
    new Date(current_year, current_month, date).toString().split(" ")[0]
  }`;
}

function show(date) {
  selected_date_array = selected_date.innerHTML.split(" ");
  //showing events
  let event_html = "";
  event_array.forEach((event_obj) => {
    if (
      date === event_obj.event_date &&
      Number(getKeyByValue(month_container, selected_date_array[1])) + 1 ===
        event_obj.event_month &&
      Number(selected_date_array[2]) === event_obj.event_year
    ) {
      event_obj.events.forEach((event) => {
        event_html += `<div class= "event_row">
            <div class= "event-time_display">
                <div class= "event_title">
                    <i class= "fas fa-circle"></i>
                    <div class= "event_name">${event.title}</div>
                </div>
                <div class= "time">${event.time}</div>
            </div>
            <i class="fa-solid fa-trash-can dustbin"></i>
        </div>
        `;
      });
    }
  });
  event_table.innerHTML = event_html;

  //showing tasks
  let tasks_html = "";
  tasks_array.forEach((tasks_obj) => {
    if (
      date === tasks_obj.tasks_date &&
      Number(getKeyByValue(month_container, selected_date_array[1])) + 1 ===
        tasks_obj.tasks_month &&
      Number(selected_date_array[2]) === tasks_obj.tasks_year
    ) {
      tasks_obj.tasks.forEach((task) => {
        tasks_html += `<div class= "tasks_row">
            <div class= "tasks-time_display">
                <div class= "tasks_title">
                    <i class= "fas fa-circle"></i>
                    <div class= "tasks_name">${task.title}</div>
                </div>
                <div class= "time">${task.time}</div>
            </div>
            <i class="fa-solid fa-trash-can dustbin"></i>
        </div>
        `;
      });
    }
  });
  tasks_table.innerHTML = tasks_html;

  // Delete event
  document.querySelectorAll(".event_table .dustbin").forEach((dustbin) => {
    dustbin.addEventListener("click", (e) => {
      const clicked_event = e.currentTarget.parentElement.querySelector(".event_name").innerText;
      const clicked_time = e.currentTarget.parentElement.querySelector(".time").innerText;

      // Find the event to delete
      const event_to_delete = event_array.find((event_obj) => {
        return (
          Number(selected_date_array[0]) === event_obj.event_date &&
          Number(getKeyByValue(month_container, selected_date_array[1])) + 1 === event_obj.event_month &&
          Number(selected_date_array[2]) === event_obj.event_year
        );
      });

      if (event_to_delete) {
        // Find the index of the event in the events array
        const event_to_delete_index = event_to_delete.events.findIndex((event) => {
          return event.title === clicked_event && event.time === clicked_time;
        });

        if (event_to_delete_index !== -1) {
          // Remove the event from the events array
          event_to_delete.events.splice(event_to_delete_index, 1);

          // If events array becomes empty, remove the entire event object
          if (event_to_delete.events.length === 0) {
            const eventIndex = event_array.indexOf(event_to_delete);
            event_array.splice(eventIndex, 1);
            document.querySelectorAll(".day").forEach((day)=>{
              const event_remaining = event_array.some((event_obj)=>{
                return (event_obj.event_date === current_date && event_obj.event_month === current_month + 1 && event_obj.event_year === current_year)

              })
              if(!event_remaining){
                day.classList.remove("event");
              }
            })
          }

          // Update the localStorage
          localStorage.setItem("event_array_string", JSON.stringify(event_array));

          

          // Refresh the displayed events
          show(current_date);
        }
      }
    });
  });

  // Delete task
  document.querySelectorAll(".tasks_table .dustbin").forEach((dustbin) => {
    dustbin.addEventListener("click", (e) => {
      const clicked_task = e.currentTarget.parentElement.querySelector(".tasks_name").innerText;
      const clicked_time = e.currentTarget.parentElement.querySelector(".time").innerText;
  
      // Find the tasks to delete
      const tasks_to_delete = tasks_array.find((tasks_obj) => {
        return (
          Number(selected_date_array[0]) === tasks_obj.tasks_date &&
          Number(getKeyByValue(month_container, selected_date_array[1])) + 1 === tasks_obj.tasks_month &&
          Number(selected_date_array[2]) === tasks_obj.tasks_year
        );
      });
  
      if (tasks_to_delete) {
        // Find the index of the task in the tasks array
        const task_to_delet_index = tasks_to_delete.tasks.findIndex((task) => {
          return task.title === clicked_task && task.time === clicked_time;
        });
  
        if (task_to_delet_index !== -1) {
          // Remove the task from the tasks array
          tasks_to_delete.tasks.splice(task_to_delet_index, 1);
  
          // If tasks array becomes empty, remove the entire tasks object
          if (tasks_to_delete.tasks.length === 0) {
            const tasksIndex = tasks_array.indexOf(tasks_to_delete);
            tasks_array.splice(tasksIndex, 1);
            document.querySelectorAll(".day").forEach((day)=>{
              const task_remaining = tasks_array.some((tasks_obj)=>{
                return (tasks_obj.tasks_date === Number(day.innerHTML) && tasks_obj.tasks_month === current_month + 1 && tasks_obj.tasks_year === current_year)

              })
              if(!task_remaining){
                day.classList.remove("tasks");
              }
            })
          }
  
          // Update the localStorage
          localStorage.setItem("tasks_array_string", JSON.stringify(tasks_array));
  
          // Refresh the displayed tasks
          show(current_date);
        }
      }
    });
  });

}


//converting time
function convert_time(time) {
  const time_array = time.split(":");
  const time_hour = time_array[0] % 12 || 12;
  const time_mins = time_array[1];
  const time_format = Number(time_array[0]) >= 12 ? "PM" : "AM";
  const formatted_time = time_hour + ":" + time_mins + " " + time_format;
  return formatted_time;
}

//funtionalizing add event button
add_event_button.addEventListener("click", (e) => {
  if (event_from.value && event_to.value) {
    //stopping the page from refreshing
    e.preventDefault();
    //converting event from and event to
    const event_from_formatted = convert_time(event_from.value);
    const event_to_formatted = convert_time(event_to.value);
    //info about the event
    const new_event = {
      title: event_name.value,
      time: event_from_formatted + " - " + event_to_formatted,
    };
    if (!event_name.value) {
      new_event.title = "Event";
    }
    //adding events to event_array
    const event_added = event_array.every((event_obj) => {
      if (
        event_obj.event_date === Number(selected_date_array[0]) &&
        event_obj.event_month ===
          Number(getKeyByValue(month_container, selected_date_array[1])) + 1 &&
        event_obj.event_year === Number(selected_date_array[2])
      ) {
        event_obj.events.push(new_event);
        return false;
      }
      return true;
    });
    if (event_added) {
      event_array.push({
        event_date: Number(selected_date_array[0]),
        event_month:
          Number(getKeyByValue(month_container, selected_date_array[1])) + 1,
        event_year: Number(selected_date_array[2]),
        events: [new_event],
      });
      document.querySelectorAll(".day").forEach((day)=>{
        const event_remaining = event_array.some((event_obj)=>{
          return (event_obj.event_date === Number(day.innerHTML) && event_obj.event_month === current_month+1 && event_obj.event_year === current_year)
        })
        if (event_remaining){
          day.classList.add("event");
        }

      })
    }
    //refreshing the placeholders
    event_name.value = "";
    event_name.placeholder = "Event Name";
    event_from.type = "text";
    event_from.value = "";
    event_from.placeholder = "Event From (hh:mm)";
    event_to.type = "text";
    event_to.value = "";
    event_to.placeholder = "Event To (hh:mm)";
    //showing updated events

    show(current_date);
    //saving data to local storage
    localStorage.setItem("event_array_string", JSON.stringify(event_array));
  } else {
    return false;
  }
});

//functionalizing add tasks button
add_tasks_button.addEventListener("click", (e) => {
  if (tasks_from.value && tasks_to.value) {
    //stopping the page from refreshing
    e.preventDefault();
    //converting event from and event to
    const tasks_from_formatted = convert_time(tasks_from.value);
    const tasks_to_formatted = convert_time(tasks_to.value);
    //info about the event
    const new_tasks = {
      title: tasks_name.value,
      time: tasks_from_formatted + " - " + tasks_to_formatted,
    };
    if (!tasks_name.value) {
      new_tasks.title = "Task";
    }
    //adding events to event_array
    const tasks_added = tasks_array.every((tasks_obj) => {
      if (
        tasks_obj.tasks_date === Number(selected_date_array[0]) &&
        tasks_obj.tasks_month ===
          Number(getKeyByValue(month_container, selected_date_array[1])) + 1 &&
        tasks_obj.tasks_year === Number(selected_date_array[2])
      ) {
        tasks_obj.tasks.push(new_tasks);
        return false;
      }
      return true;
    });
    if (tasks_added) {
      tasks_array.push({
        tasks_date: current_date,
        tasks_month:
          Number(getKeyByValue(month_container, selected_date_array[1])) + 1,
        tasks_year: Number(selected_date_array[2]),
        tasks: [new_tasks],
      });
      document.querySelectorAll(".day").forEach((day)=>{
        const tasks_remaining = tasks_array.some((tasks_obj)=>{
          return (tasks_obj.tasks_date === Number(day.innerHTML) && tasks_obj.tasks_month === current_month+1 && tasks_obj.tasks_year === current_year)
        })
        if (tasks_remaining){
          day.classList.add("tasks");
        }

      })
    }
    //refreshing the placeholders
    tasks_name.value = "";
    tasks_name.placeholder = "Task Name";
    tasks_from.type = "text";
    tasks_from.value = "";
    tasks_from.placeholder = "Task From (hh:mm)";
    tasks_to.type = "text";
    tasks_to.value = "";
    tasks_to.placeholder = "Task To (hh:mm)";
    //showing updated tasks

    show(current_date);
    //saving data to local storage
    localStorage.setItem("tasks_array_string", JSON.stringify(tasks_array));
  } else {
    return false;
  }
});
