firebase.initializeApp(firebaseConfig);
const videoRefs = firebase.firestore().collection("VideoPost");    

var tbody = document.getElementById("video-post-body");

// retrieving video posts from database
async function getAllVideos(){
  await videoRefs.get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var row = document.createElement("tr");

        var name = document.createElement("td");
        var nameData = document.createTextNode(doc.data().name);
        name.appendChild(nameData);

        var callID = document.createElement("td");
        var callIDdata = document.createTextNode(doc.data().call_id);
        callID.appendChild(callIDdata);

        var description = document.createElement("td");
        var descriptionData = document.createTextNode(doc.data().description);
        description.appendChild(descriptionData);

        var status = document.createElement("td");
        var statusData = document.createTextNode(doc.data().status);
        status.appendChild(statusData);

        row.appendChild(name);
        row.appendChild(callID);
        row.appendChild(description);
        row.appendChild(status);

        tbody.appendChild(row);

        // console.log(doc.id, " => ", doc.data());
      });
  })
};

getAllVideos();

function myFunction() {
  var input, filter, table, tr, td, i;
  input = document.getElementById("mylist");
  filter = input.value.toUpperCase();
  table = document.getElementById("video-post");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[3];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
}