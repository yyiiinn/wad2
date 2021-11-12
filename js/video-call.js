firebase.initializeApp(firebaseConfig);

const videoRefs = firebase.firestore().collection("VideoPost");
const userRefs = firebase.firestore().collection("Users");
var email = sessionStorage.getItem('email');
var postID = "";

async function getNameByEmail(email){
  await userRefs.doc(email).get()
  .then(snapshot => {
    var name = "";
    if(email == undefined || snapshot.data() == undefined || email != snapshot.data().email){
      console.log(snapshot);
    }
    else{
      this.name = snapshot.data().name;
    }
  })
}

// create global variables for peer connection and video streams
const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

var pc = new RTCPeerConnection(servers);
let localStream = null;
let remoteStream = null;

// HTML elements
const webcamButton = document.getElementById('webcamButton');
const webcamVideo = document.getElementById('webcamVideo');
const callButton = document.getElementById('callButton');
const callInput = document.getElementById('callInput');
const answerButton = document.getElementById('answerButton');
const remoteVideo = document.getElementById('remoteVideo');
const hangupButton = document.getElementById('hangupButton');

// create video feed from webcam using MediaStream interface
webcamButton.onclick = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  // initialise remote video feed with an empty stream
  remoteStream = new MediaStream();

  // Push tracks from local stream to peer connection
  localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
  });

  // Pull tracks from remote stream, add to video stream
  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  // Show stream in HTML video
  webcamVideo.srcObject = localStream;
  remoteVideo.srcObject = remoteStream;

  callButton.disabled = false;
  answerButton.disabled = false;
  webcamButton.disabled = true;

  getNameByEmail(this.email)
  console.log(this.name)
}

// Creating a call
callButton.onclick = async () => {
  // add a confirm message to see if the user really wants to create a call

  // Reference Firestore collections for signaling
  const callDoc = firebase.firestore().collection('calls').doc();
  const offerCandidates = callDoc.collection('offerCandidates');
  const answerCandidates = callDoc.collection('answerCandidates');
  
  callInput.value = callDoc.id;
  
  // Get candidates for caller, save to db
  pc.onicecandidate = event => {
    event.candidate && offerCandidates.add(event.candidate.toJSON());
  };
  
  // Create offer
  const offerDescription = await pc.createOffer();
  await pc.setLocalDescription(offerDescription);
  
  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
  };
  
  await callDoc.set({ offer });
  
  // Listen for remote answer
  callDoc.onSnapshot((snapshot) => {
    const data = snapshot.data();
    if (!pc.currentRemoteDescription && data?.answer) {
      const answerDescription = new RTCSessionDescription(data.answer);
      pc.setRemoteDescription(answerDescription);
    }
  });
  
  // Listen for remote ICE candidates
  answerCandidates.onSnapshot(snapshot => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const candidate = new RTCIceCandidate(change.doc.data());
        pc.addIceCandidate(candidate);
      }
    });
  });
  hangupButton.disabled = false;
};

// answer a call
answerButton.onclick = async () => {
  const callId = document.getElementById("answerInput").value;
  console.log(callId)
  const callDoc = firebase.firestore().collection('calls').doc(callId);
  const offerCandidates = callDoc.collection('offerCandidates');
  const answerCandidates = callDoc.collection('answerCandidates');

  pc.onicecandidate = event => {
    event.candidate && answerCandidates.add(event.candidate.toJSON());
  };

  // Fetch data, then set the offer & answer

  const callData = (await callDoc.get()).data();

  const offerDescription = callData.offer;
  await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

  const answerDescription = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
  };

  await callDoc.update({ answer });

  // Listen to offer candidates

  offerCandidates.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      console.log(change)
      if (change.type === 'added') {
        let data = change.doc.data();
        pc.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });

  if (this.postID != "") {
    // update video post status to on-going
    videoRefs.onSnapshot((snapshot) =>{
      videoRefs.doc(this.postID).update({
          status: "in-call"
      });
    })
  } 

  hangupButton.disabled = false;
};

hangupButton.onclick = async() => {
  pc.close();
  pc = null;

  if (this.postID != "") {
     // update video post status to ended
    videoRefs.onSnapshot((snapshot) =>{
      videoRefs.doc(this.postID).update({
        status: "ended"
      }).then(function() {
        window.location.href = "video-call.html";
      });
    })
  } else {
    window.location.href = "video-call.html";
  }
 
}

createPost.onclick = async() => {
  var callId = document.getElementById("call-id").value
  var description = document.getElementById("description").value
  console.log(this.name)

  let data = {
    name: this.name,
    call_id: callId,
    description: description,
    email: this.email,
    status: "on-going"
  }
  videoRefs.add(data).then(docRef => {
    console.log("data added with Id: ", docRef.id)  
    this.postID = docRef.id;
  })
  .catch((error) => {
    console.log("Error adding data: ", error)
  }); 

  $('#message').html('<p style="color:green;">You have successfully posted.').show();   
  
}

closeModal.onclick = async() => {
  $("#post-form").trigger("reset");
  $('#message').hide(); 
}

