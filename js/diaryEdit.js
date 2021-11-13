firebase.initializeApp(firebaseConfig);
const usersRef = firebase.firestore().collection("Users")
const diaryRefs = firebase.firestore().collection("Diary")
const uid = sessionStorage.getItem('uid');

var docID;
var dateGlobal;
async function getDocById(id, userID){
    var data = []
    await diaryRefs.doc(id).get()
    .then(snapshot => {
        if(userID == undefined || snapshot.data() == undefined || userID != snapshot.data().userID){
           window.location.href = "index.html";
        }
        else{
          data = snapshot.data()
        }
    })
    return data
}

$(document).ready(function() {
    var query = window.location.search;
    const urlParams = new URLSearchParams(query);
    const id = urlParams.get('id')
    if(uid == null || id == undefined || uid == undefined){
        window.location.href = "index.html"; 
    }
    var monthArr = ["January", "February","March", "April", "May", "June", "July", "August", "September", "October", "November","December"];
    var dayArr = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    docID = id
    getDocById(id, uid).then(result => {
        console.log(result)
        date = result.date
        var year  = date.substring(0,4);
        var month  = date.substring(5,7);
        var day   = date.substring(8,10);
        newDate = day + " " + monthArr[month-1] + " " + year
        dateGlobal = newDate
        var n = new Date(date)
        var day = n.getDay() - 1
        if(day == -1){
          day = dayArr.length - 1;
        }
        document.getElementById("date").innerHTML += newDate;
        document.getElementById("day").innerHTML += dayArr[day];
        document.getElementById("moodField").value = result.mood;
        document.getElementById("thoughtsField").value = result.thoughts;
        document.getElementById("sleepField").value = result.hoursSlept;
        document.getElementById('feelingSelect').value= result.feeling;
        var $anxiety = result.anxiety
        var $stress = result.stress
        $("input[name='stress'][value='"+$stress+"']").attr('checked', true);
        $("input[name='anxiety'][value='"+$anxiety+"']").attr('checked', true);
        $("#diary").css("display", "block")
    })   
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
    if(allFilled == true){
          diaryRefs.onSnapshot((snapshot) =>{
            diaryRefs.doc(docID).update({
                anxiety: anxietyChecked,
                feeling: selectedMood,
                hoursSlept: hoursSlept,
                stress: stressChecked,
                thoughts: thoughtsField,
                mood: moodField,
            }).catch((error) =>{
              alert("An Error Has Occured")
            })
            customAlertBox()
          })
        } 
      }

function customAlertBox(){
  document.getElementById("modal").innerHTML = "Changes for entry on " + dateGlobal + " is successfully saved" 
  $("#exampleModal").modal()
}