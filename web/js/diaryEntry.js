firebase.initializeApp(firebaseConfig);
const usersRef = firebase.firestore().collection("Users")
const diaryRefs = firebase.firestore().collection("Diary")

$(document).ready(function() {
    n = new Date();
    y = n.getFullYear();
    m = n.getMonth() + 1;
    d = n.getDate();
    var monthArr = ["January", "February","March", "April", "May", "June", "July", "August", "September", "October", "November","December"];
    var dayArr = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    var day = n.getDay() - 1
    if(day == -1){
      day = dayArr.length - 1;
    }
    m = monthArr[m];
    document.getElementById("date").innerHTML += d + " " + m + " " + y;
    document.getElementById("day").innerHTML += dayArr[day];
    document.getElementById("dateField").max = new Date(new Date().getTime() + 86400000).toISOString().substring(0, 10);
    $('#sleepField').on('keydown keyup change', function(e){
      if ($(this).val() > 24 
          && e.keyCode !== 46 // keycode for delete
          && e.keyCode !== 8 // keycode for backspace
         ) {
         e.preventDefault();
         $(this).val(24);
      }
      if ($(this).val() < 0 
          && e.keyCode !== 46 // keycode for delete
          && e.keyCode !== 8 // keycode for backspace
         ) {
         e.preventDefault();
         $(this).val(0);
      }
  });
  
  //prevent spacing
  $('#moodField').on('keydown', function(e){
      var firstChar = $("#moodField").val()
       if(e.keyCode == 32 && firstChar == ""){
         return false;
       }
       if(e.keyCode == 32){
         return false;
       }
  });

})

function submitEntry(){
    allFilled = true;
    hoursSlept = $('#sleepField').val();
    if(hoursSlept == ""){
      $('#sleepCheck').css("display", "block");
      allFilled = false;
    }
    else{
      $('#sleepCheck').css("display", "none");
    }
    anxietyChecked = $('input[name="anxiety"]:checked').val();
    if (anxietyChecked == undefined){
      $('#anxietyCheck').css("display", "block");
      allFilled = false;
    }
    else{
      $('#anxietyCheck').css("display", "none");
    }
    stressChecked = $('input[name="stress"]:checked').val();
    if (stressChecked == undefined){
      $('#stressCheck').css("display", "block");
      allFilled = false;
    }
    else{
      $('#stressCheck').css("display", "none");
    }
    selectedMood = $('#feelingSelect').find(":selected").text();
    thoughtsField = $('#thoughtsField').val();
    moodField = $("#moodField").val();
    if (moodField == ""){
      $('#moodCheck').css("display", "block");
      allFilled = false;
    }
    else{
      $('#moodCheck').css("display", "none");
    } 
    var dateField = $('#dateField').val();
    if (dateField == ""){
      $('#dateCheck').css("display", "block");
      allFilled = false;
    }
    else{
      $('#dateCheck').css("display", "none");
    } 
    if(allFilled == true){  //also need to check if user is logged in 
        let data = {
          anxiety: anxietyChecked,
          date: dateField,
          feeling: selectedMood,
          hoursSlept: hoursSlept,
          stress: stressChecked,
          thoughts: thoughtsField,
          mood: moodField,
          userID: "wioE4JOjwid6r2Y3JLv2YL0Z6FJ2"
      }
      diaryRefs.add(data);
    }
  }