$(document).ready(function(){
    
// initialize firebase
var config = {
        apiKey: "AIzaSyC5pvBKuFwpvuneAldGwTP8iSnLgUetfvk",
        authDomain: "train-scheduler-zwork.firebaseapp.com",
        databaseURL: "https://train-scheduler-zwork.firebaseio.com",
        projectId: "train-scheduler-zwork",
        storageBucket: "train-scheduler-zwork.appspot.com",
        messagingSenderId: "1086947781666"
        };
  firebase.initializeApp(config);
    
var database = firebase.database();

// current time
var currentTime = moment();
    
// input functions
document.getElementById('submit').addEventListener('click', function () {
    var name = $('#nameInput').val().trim();
    var dest = $('#destInput').val().trim();
    var time = $('#timeInput').val().trim();
    var freq = $('#freqInput').val().trim();
});    

// push to firebase
	database.ref().push({
		name: name,
		dest: dest,
    	time: time,
    	freq: freq,
    	timeAdded: firebase.database.ServerValue.TIMESTAMP
	});
    
	document.getElementById('input').val('');
    return false;
});

// adding child
    
database.ref().on("child_added", function(childSnapshot){
	var name = childSnapshot.val().name;
	var dest = childSnapshot.val().dest;
	var time = childSnapshot.val().time;
	var freq = childSnapshot.val().freq;

	console.log("Name: " + name);
	console.log("Destination: " + dest);
	console.log("Time: " + time);
	console.log("Frequency: " + freq);

// train time conversions
	var freq = parseInt(freq);
	console.log("Current Time: " + moment().format('HH:mm'));
	var dConverted = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');
	console.log("Date Converted: " + dConverted);
	var trainTime = moment(dConverted).format('HH:mm');
	console.log("Train Time : " + trainTime);
	var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
	var tDifference = moment().diff(moment(tConverted), 'minutes');
	console.log("Differnece in Time: " + tDifference);
	var tRemainder = tDifference % freq;
	console.log("Time Remaining: " + tRemainder);
	var minsAway = freq - tRemainder;
	console.log("Minutes Away: " + minsAway);
	var nextTrain = moment().add(minsAway, 'minutes');
	console.log("Next Train: " + moment(nextTrain).format('HH:mm A'));


 // display current time and append table data 
document.getElementById('currentTime').text(currentTime);
document.getElementById('trainTable').append(
		"<tr><td id='nameDisplay'>" + childSnapshot.val().name +
		"</td><td id='destDisplay'>" + childSnapshot.val().dest +
		"</td><td id='freqDisplay'>" + childSnapshot.val().freq +
		"</td><td id='nextDisplay'>" + moment(nextTrain).format("HH:mm") +
		"</td><td id='awayDisplay'>" + minsAway  + ' minutes until arrival' + "</td></tr>");
 });

}); // end document.ready