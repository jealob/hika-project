// JavaScript  document
// Document Ready
$(document).ready(function () {
    // Declare global variables

    // Weather api
    var weatherAPIKey = "&appid=3ddb20c4208b8c89b66edde10d53e4e3";
    var city = ["Saint Paul, Minnesota", "Minneapolis, Minnesota", "Rochester, Minnesota", "Richmond, Wisconsin"];
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city[0] + weatherAPIKey;

    // We then created an AJAX call
    city.forEach(function (element) {
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

        });
    });


        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyAy99HmVCBqY41HnOx-54HltgcOvykan40",
            authDomain: "hika-d4f28.firebaseapp.com",
            databaseURL: "https://hika-d4f28.firebaseio.com",
            projectId: "hika-d4f28",
            storageBucket: "",
            messagingSenderId: "193526260174"
        };
        firebase.initializeApp(config);

        // Reference firebase database
        var database = firebase.database();


        // On click Submit Button 
        $("#submit").on("click", function (event) {
            event.preventDefault();

            // Grab client information
            var $name = $("#name").val().trim();
            var $email = $("#email").val().trim();
            var $phone = $("#phone").val().trim();
            var $eventType = $("#eventType").val().trim();
            var $preferredContact = $("#preferredContact").val().trim();
            var $eventDate = $("#eventDate").val().trim();
            var $eventLoc = $("#eventLoc").val().trim();

            // Create Object for the values
            var bookingInfo = {
                name: name,
                email: email,
                phone: phone,
                eventType: eventType,
                preferredContact: preferredContact,
                eventDate: eventDate,
                eventLoc: eventLoc,
            }

            // Push data to database
            database.ref().push(bookingInfo);
        });

        // Firebase watcher + initial loader + order/limit HINT: .on("child_added")
        database.ref().on("child_added", function (childSnapshot, prevChildKey) {
            // 
            var data = childSnapshot.val();

        }, function (errorObject) {
            console.log("Errors handled: " + errorObject.code);
        });
    })