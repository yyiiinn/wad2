firebase.initializeApp(firebaseConfig);
const usersRef = firebase.firestore().collection("Users")
const diaryRefs = firebase.firestore().collection("Diary")
const uid = sessionStorage.getItem('uid');

$(document).ready(function() {
    if(uid == null){
      window.location.href = "index.html"; 
    }
    $("#diary").css("display", "block")
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
      if (e.keyCode === 190 || e.keyCode === 110) {
        e.preventDefault();
      }
      if (e.keyCode != 46 && e.keyCode != 45 && e.keyCode > 31
        && (e.keyCode < 48 || e.keyCode > 57))
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

var existed = false;
async function getDiary(dateField){
  await diaryRefs.where("userID", "==", uid).get()
  .then((querySnapshot) => {
      querySnapshot.forEach(doc =>{
        date = doc.data().date
        if (date === dateField){
           existed = true
        }
      })
  })
  return existed
}

function submitEntry(){
    existed = false
    allFilled = true;
    var dateField = $('#dateField').val();
    if (dateField == ""){
      $('#dateCheck').css("display", "block");
      allFilled = false;
    }
    else{
      $('#dateCheck').css("display", "none");
    } 
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
    getDiary(dateField).then(result => {
      if(result == true){
        alert('You have already added an entry for ' + dateField + '!')
      }
      else{
        let data = {   //also need to check if user is logged in 
          anxiety: anxietyChecked,
          date: dateField,
          feeling: selectedMood,
          hoursSlept: hoursSlept,
          stress: stressChecked,
          thoughts: thoughtsField,
          mood: moodField,
          userID: uid
      }
      diaryRefs.add(data).then((result) => {
        dArr = dateField.split("-");
        date = dArr[2]+ "/" +dArr[1]+ "/" +dArr[0];
        localStorage.setItem("dateField", date)
        window.location.href = "diarySuccess.html";  
      }).catch((error) => {
        alert("An Error Has Occured");
    });
      }
    })      
      }
