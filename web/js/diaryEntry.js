firebase.initializeApp(firebaseConfig);
const usersRef = firebase.firestore().collection("Users")
const diaryRefs = firebase.firestore().collection("Diary")

$(document).ready(function() {
    n = new Date();
    y = n.getFullYear();
    m = n.getMonth();
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
      if (charCode != 46 && charCode != 45 && charCode > 31
        && (charCode < 48 || charCode > 57))
         return false;
  });
  

  //prevent spacing and number
  $('#moodField').on('keydown', function(e){
      var firstChar = $("#moodField").val()
       if(e.keyCode == 32 && firstChar == ""){
         return false;
       }
       if(e.keyCode == 32){
         return false;
       }
       var charCode = e.keyCode;
       if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8 || charCode == 189){
          $(this).val($(this).val().substr(0, 1).toUpperCase() + $(this).val().substr(1));    
          return true;
       } 
       else
           return false;
  });
})

function submitEntry(){
    allFilled = true;
    hoursSlept = parseInt($('#sleepField').val());
    if(isNaN(hoursSlept)){
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
      moodField = moodField.toLowerCase()
      moodField = moodField.charAt(0).toUpperCase() + moodField.slice(1)
    } 
    var dateField = $('#dateField').val();
    if (dateField == ""){
      $('#dateCheck').css("display", "block");
      allFilled = false;
    }
    else{
      $('#dateCheck').css("display", "none");
    } 
    let data = {   //also need to check if user is logged in 
          anxiety: anxietyChecked,
          date: dateField,
          feeling: selectedMood,
          hoursSlept: hoursSlept,
          stress: stressChecked,
          thoughts: thoughtsField,
          mood: moodField,
          userID: "wioE4JOjwid6r2Y3JLv2YL0Z6FJ2"
      }
      diaryRefs.add(data).then((result) => {
        dArr = dateField.split("-");
        date = dArr[2]+ "/" +dArr[1]+ "/" +dArr[0];
        localStorage.setItem("dateField", date)
        window.location.href = "../web/diarySuccess.html";  
      }).catch((error) => {
        alert("An Error Has Occured");
    });
  }

// async function getFromDB(dateField){
//     var queryData = {}
//     const PROMISE = new Promise((resolve) =>{
//       let inDB = false;
//       var test = diaryRefs.where("userID", "==", "wioE4JOjwid6r2Y3JLv2YL0Z6FJ2").get()
//       .then((querySnapshot) => {
//           queryData = querySnapshot.docs.map((doc) => ({
//               date: doc.data().date
//           }));
//           console.log(queryData)
//           for(var key in queryData){
//             if(queryData[key]["date"] == dateField){
//               inDB = true;
//             }
//           }
//           resolve(inDB)
//       })
//     })
//   }
