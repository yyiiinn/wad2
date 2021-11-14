//calendar ui and code referenced from https://colorlib.com/wp/template/calendar-04/

function createCalendar(){
    var date = new Date();
    var today = date.getDate();
    // Set click handlers for DOM elements
    $(".right-button").click({date: date}, next_year);
    $(".left-button").click({date: date}, prev_year);
    $(".month").click({date: date}, month_click);
    // $("#add-button").click({date: date}, new_event);
    // Set current month as active
    $(".months-row").children().eq(date.getMonth()).addClass("active-month");
    init_calendar(date);
    var events = check_events(today, date.getMonth()+1, date.getFullYear());
    show_events(events, months[date.getMonth()], today);
}

// Initialize the calendar by appending the HTML dates
function init_calendar(date) {
    $(".tbody").empty();
    $(".events-container").empty();
    var calendar_days = $(".tbody");
    var month = date.getMonth();
    var year = date.getFullYear();
    var day_count = days_in_month(month, year);
    var row = $("<tr class='table-row'></tr>");
    var today = date.getDate();
    // Set date to 1 to find the first day of the month
    date.setDate(1);
    var first_day = date.getDay();
    // 35+firstDay is the number of date elements to be added to the dates table
    // 35 is from (7 days in a week) * (up to 5 rows of dates in a month)
    for(var i=0; i<35+first_day; i++) {
        // Since some of the elements will be blank, 
        // need to calculate actual date from index
        var day = i-first_day+1;
        // If it is a sunday, make a new row
        if(i%7===0) {
            calendar_days.append(row);
            row = $("<tr class='table-row'></tr>");
        }
        // if current index isn't a day in this month, make it blank
        if(i < first_day || day > day_count) {
            var curr_date = $("<td class='table-date nil'>"+"</td>");
            row.append(curr_date);
        }   
        else {
            var curr_date = $("<td class='table-date'>"+day+"</td>");
            var events = check_events(day, month+1, year);
            if(today===day && $(".active-date").length===0) {
                curr_date.addClass("active-date");
                show_events(events, months[month], day);
            }
            // If this date has any events, style it with .event-date
            if(events.length!==0) {
                curr_date.addClass("event-date");
            }
            // Set onClick handler for clicking a date
            curr_date.click({events: events, month: months[month], day:day}, date_click);
            row.append(curr_date);
        }
    }
    // Append the last row and set the current year
    calendar_days.append(row);
    $(".year").text(year);
}

// Get the number of days in a given month/year
function days_in_month(month, year) {
    var monthStart = new Date(year, month, 1);
    var monthEnd = new Date(year, month + 1, 1);
    return (monthEnd - monthStart) / (1000 * 60 * 60 * 24);    
}

// Event handler for when a date is clicked
function date_click(event) {
    $(".events-container").show(250);
    $("#dialog").hide(250);
    $(".active-date").removeClass("active-date");
    $(this).addClass("active-date");
    show_events(event.data.events, event.data.month, event.data.day);
};

// Event handler for when a month is clicked
function month_click(event) {
    $(".events-container").show(250);
    $("#dialog").hide(250);
    var date = event.data.date;
    $(".active-month").removeClass("active-month");
    $(this).addClass("active-month");
    var new_month = $(".month").index(this);
    date.setMonth(new_month);
    init_calendar(date);
}

// Event handler for when the year right-button is clicked
function next_year(event) {
    $("#dialog").hide(250);
    var date = event.data.date;
    var new_year = date.getFullYear()+1;
    $("year").html(new_year);
    date.setFullYear(new_year);
    init_calendar(date);
}

// Event handler for when the year left-button is clicked
function prev_year(event) {
    $("#dialog").hide(250);
    var date = event.data.date;
    var new_year = date.getFullYear()-1;
    $("year").html(new_year);
    date.setFullYear(new_year);
    init_calendar(date);
}

// Adds a json event to event_data
function new_event_json(hours, stress, anxiety, feeling, word, thoughts, date, day, id) {
    var event = {
        "hours": hours,
        "stress": stress,
        "anxiety": anxiety,
        "feeling": feeling,
        "word": word,
        "thoughts": thoughts,
        "year": date.getFullYear(),
        "month": date.getMonth()+1,
        "day": day,
        "id": id
    };
    event_data["events"].push(event);
}

// Display all events of the selected date in card views
function show_events(events, month, day) {
    // Clear the dates container
    $(".events-container").empty();
    $(".events-container").show(250);
    console.log(event_data["events"]);
    // If there are no events for this date, notify the user
    if(events.length===0) {
        var event_card = $("<br><div class='event-card'></div>");
        var event_name = $("<div class='event-name' style='text-align:center;'>There is no diary entry submitted for "+month+" "+day+".</div>");
        $(event_card).css({ "border-left": "10px solid #FF1744" });
        $(event_card).append(event_name);
        $(".events-container").append(event_card);
    }
    else {
        // Go through and add each event as a card to the events container
        for(var i=0; i<events.length; i++) {
            var editId = "edit" + String(i)
            var deleteId = "delete" + String(i)
            var event_card = $("<br><div class='event-card'></div>");
            dataID = String(events[i]["id"])
            var onClick = "id='" + editId + "' onclick='editFunction(" + '"' + dataID + '"' +")'"
            var onClickDelete = "id='" + deleteId + "' onclick='deleteFunction(" + '"' + dataID + '"' +")'"
            var edit = $("<div class='flex-nowrap row'><a class='col' " + onClickDelete + "style='float:left;cursor:pointer;'>Delete Entry</a><a " + onClick + "style='float:right;cursor:pointer;'>Edit Entry</a></div><br>");
            var hours = $("<div class='event-name'> Hours Slept: <strong> "+events[i]["hours"]+" hours</strong></div><br>");
            var stress = $("<div class='event-name'> Stress Level: <strong> "+events[i]["stress"]+"</strong></div><br>");
            var anxiety = $("<div class='event-name'> Anxiety Level: <strong> "+events[i]["anxiety"]+"</strong></div><br>");
            var feeling = $("<div class='event-name'> Feeling: <strong> "+events[i]["feeling"]+"</strong></div><br>");
            var word = $("<div class='event-name'> Word that represents the day: <strong> "+events[i]["word"]+"</strong></div><br>");
            var thoughts = $("<div class='event-name' style='max-height:200px;overflow-y:scroll;'> Thoughts for the day: <br><strong> "+events[i]["thoughts"]+"</strong><br></div>");
            $(event_card).append(edit).append(hours).append(stress).append(anxiety).append(feeling).append(word).append(thoughts);
            $(".events-container").append(event_card);
        }
    }
}

// Checks if a specific date has any events
function check_events(day, month, year) {
    var events = [];
    for(var i=0; i<event_data["events"].length; i++) {
        var event = event_data["events"][i];
        if(event["day"]===day &&
            event["month"]===month &&
            event["year"]===year) {
                events.push(event);
            }
    }
    return events;
}

// Given data for events in JSON format
var event_data = {
    "events": [
  
    ]
};

const months = [ 
    "January", 
    "February", 
    "March", 
    "April", 
    "May", 
    "June", 
    "July", 
    "August", 
    "September", 
    "October", 
    "November", 
    "December" 
];

// })(jQuery)
function editFunction(id){
    window.location.href = "diaryEdit.html?id=" + String(id);
}

function deleteFunction(id){
    $("#exampleModal").modal();
    var deleteEntry = document.getElementsByClassName("deleteEntry"); 
    deleteEntry[0].setAttribute("id", String(id))
}

function deleteDiary(button){
    deleteDiaryAsync(button).then(result => {
        location.reload()
    })
}

async function deleteDiaryAsync(button){
    id = button.id
    await diaryRefs.doc(button.id).delete().then(snapshot => {
        console.log(snapshot)
    }).catch(error =>{
        console.log(erorr.message)
    });
}