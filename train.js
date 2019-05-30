$(document).ready(function(){


// Initialize Firebase
var config = {
    apiKey: "AIzaSyBOEDDW-jwA8yFiIqoG5GEQwCpvFPaE3WY",
    authDomain: "train-time-b9a1a.firebaseapp.com",
    databaseURL: "https://train-time-b9a1a.firebaseio.com",
    projectId: "train-time-b9a1a",
    storageBucket: "train-time-b9a1a.appspot.com",
    messagingSenderId: "203579262228"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

 

  var update = function() {
    document.getElementById("clock")
    .innerHTML = moment().format('MMMM Do YYYY, h:mm:ss a');
}
setInterval(update, 1000);



  
  $("#Add-train").on("click",function(event){
      
      event.preventDefault();
      var train = $("#Train-name-input").val().trim();
      var destination = $("#Train-destination-input").val().trim();
      var trainTime = $("#Train-time-input").val().trim();
      var trainFrequency = $("#Train-frequency-input").val().trim();
      
      
      var minutesFormat = moment(trainTime, "hh:mm").subtract(1, "years");
      currentTime = moment();
      //storing time of arrival
      var timeToArrival = moment().diff(moment(minutesFormat), "minutes");
      var tRemainder = timeToArrival % trainFrequency;
      var minutesAway = trainFrequency - tRemainder;

      var nextTrain = moment().add(minutesAway , "minutes");
      var nextTrainFormat = moment(nextTrain).format("hh:mm")

      var addRow = $("<tr>")
      var nameHead = $("<td>")
      nameHead.html(train);

      var destinationData = $("<td>");
      destinationData.html(destination);

      var frequencyData = $("<td>")
      frequencyData.html(nextTrainFormat);

      var minutesAwayData = $("<td>")
      minutesAwayData.html(minutesAway);

      $("tbody").append(addRow);



      // setting values in firebase
      database.ref().push({
          train : train,
          destination : destination,
          trainTime :nextTrainFormat,
          trainFrequency : trainFrequency,
          ETA : minutesAway,

          dateAdded : firebase.database.ServerValue.TIMESTAMP   
      });
        
      });

      // add new user when new post is created
      database.ref().on("child_added", function(snapshot){
        var newPost = snapshot.val();
        console.log("Name" + newPost.train);
        console.log("Destination" + newPost.destination);
        console.log("Frequency" + newPost.trainFrequency);
        console.log("Time : " + newPost.trainTime);
        console.log("minutes away " + newPost.minutesAway);

        $(".table > tbody").append("<tr><td>" + newPost.train + "</td><td>" + newPost.destination + "</td><td>" + newPost.trainFrequency + "</td><td>" + newPost.trainTime +"</td><td>" + newPost.ETA + "</td><tr>");

     });
  
     
     // closes document ready function
    });

