$(document).ready(function() {
    firebase.initializeApp(firebaseConfig);

    const usersRef = firebase.firestore().collection("Users");
    var datas = {}

    //READ all docs in Users
    usersRef
    .onSnapshot((snapshot) => {
        datas = snapshot.docs.map((doc) => ({
            id: doc.id,             // will the id better if is using user's uid or auto generated id?
            email: doc.data().email,
        }));
        console.log("READ results: " + datas);
        for(var key in datas){
            console.log("READ results: " + datas[key]["email"]);
        }
    });

    //UPADTE
    usersRef.onSnapshot((snapshot) =>{
        usersRef.doc("vw4aO2dy70PI7Q38ZpZ6").update({
            update: "testing"
        });
    })
    
    //CREATE
    let data = {
        email: "123@gmail.com",
        test: "ajdsbvas",
        hello: [1,2,3],
        u: {1:"2", r:"3"}
    }
    // usersRef.add(data);      generated ID
    //usersRef.doc("uniqueID").set(data);     self defined ID


    //DELETE A FIELD
    usersRef.onSnapshot((snapshot) =>{
        usersRef.doc("uniqueID").update({
            test: null
        });
    })
    // usersRef.update({       code doesn't work though
    //     test: admin.firestore.FieldValue.delete()
    // })


    //DELETE A DOCUMENT
    // usersRef.doc("uniqueID").delete();

    
    //QUERY
    var test = usersRef.where("email", "==", "123@gmail.com").get()
    .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,   // will the id better if is using user's uid or auto generated id?
            email: doc.data().email,
        }));
    })
    console.log("query result: ", data);

})