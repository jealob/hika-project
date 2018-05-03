// JavaScript  document
// Document Ready
$(document).ready(function () {

    // Declare global variables
    var latlng;

    // Jump to Top Button 
    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function () {
        scrollFunction()
    };

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.getElementById("myBtn").style.display = "block";
        } else {
            document.getElementById("myBtn").style.display = "none";
        }
    }

    // When the user clicks on the button, scroll to the top of the document
    function topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    } //Jump to the Top ends

    // What is this ????
    $("#planning-section").hide();
    $("#planning-button").on("click", function (event) {
        event.preventDefault();
        console.log("click");
        $("#myCarousel").hide();
        $("#planning-section").show();
    }) //Ends

    // Instagram Feed API
    var feed = new Instafeed({
        get: 'tagged',
        tagName: 'qaalbievents',
        userId: '5583030622',
        accessToken: '5583030622.ba4c844.186ef35d5451485b80e09eff337e69b6',
        limit: '4',

    });
    feed.run(); //Instagram Feed ends


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
        var name = $("#name").val().trim();
        var email = $("#email").val().trim();
        var phone = $("#phone").val().trim();
        var preferredContact = $("#preferredContact").val().trim();
        var eventType = $("#eventType").val().trim();
        var eventDate = $("#eventDate").val().trim();
        var eventLoc = $("#eventLoc").val().trim();
        var message = $("#message").val().trim();

        if ((name && email && eventDate && eventType) || (name && phone && eventDate && eventType)) {
            // Create Object for the values
            console.log("passed");
            var bookingInfo = {
                name: name,
                email: email,
                phone: phone,
                eventType: eventType,
                preferredContact: preferredContact,
                eventDate: eventDate,
                eventLoc: eventLoc,
                message: message,
            }

            // Push data to database
            database.ref().push(bookingInfo);
            // Change button attribute to call to call success modal
            $(this).attr("data-target", "#successModal");
            $('#successModal').on();
            $("#name").val("");
            $("#email").val("");
            $("#phone").val("");
            $("#preferredContact").val("");
            $("#eventType").val("");
            $("#eventLoc").val("");
            $("#eventDate").val("");
            $("#message").val("");
        }
        else {
            console.log("failed");
            $(this).attr("data-target", "#warningModal");
            $('#warningModal').on();
        }
    }); // On submit click Ends

    // Firebase watcher + initial loader + order/limit HINT: .on("child_added")
    database.ref().on("child_added", function (childSnapshot, prevChildKey) {
        // 
        var data = childSnapshot.val();
        console.log(data);

    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    }); //Firebase ends


    // Google Map API
    // Get current position of the device
    function getPos() {
        var map;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(initMap, positionDenied, geoSettings);
        } else {
            alert("Geolocation is not supported by this browser.");
            initMap();
        }
    }
    // Device Location no found. No GPS on device
    var positionDenied = function () {
        // alert("Unable to retrieve your location");
        initMap();
    };

    var geoSettings = {
        enableHighAccuracy: false,
        maximumAge: 30000,
        timeout: 20000
    };

    //  Initialize map and plot coordinates on the map
    var initMap = function (position) {
        // if client blocks know your location
        (!position) ? latlng = new google.maps.LatLng(44.0121221, -92.4801989) : latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        // latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var markerTitle = "You are here";
        var myOptions = {
            zoom: 12,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
            // icon:
        };

        map = new google.maps.Map(document.getElementById('map'), myOptions);

        $("#map").append("<input 'type': 'text' 'id': 'places-input'>");
        var input = /** @type {HTMLInputElement} */(
            document.getElementById('places-input')); //Need to create a div with the id pac-input

        // Create the autocomplete helper, and associate it with
        // an HTML text input box.
        // if (!input){ 
        //     // debugger;
        //     input = /** @type {HTMLInputElement} */(
        //         document.getElementById('eventLoc'));
        // }
        // console.log(input);
        var autocomplete = new google.maps.places.Autocomplete(input);
        // console.log(autocomplete);
        autocomplete.bindTo('bounds', map);

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
        });
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });
        // Get the full place details when the user selects a place from the
        // list of suggestions.
        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            infowindow.close();
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                return;
            }
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);
            }

            // Set the position of the marker using the place ID and location.
            marker.setPlace(/** @type {!google.maps.Place} */({
                placeId: place.place_id,
                location: place.geometry.location
            }));
            marker.setVisible(true);

            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                'Place ID: ' + place.place_id + '<br>' +
                place.formatted_address + '</div>');
            infowindow.open(map, marker);
        });

        // Set marker point on the map
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: markerTitle
        });
    }//Google map API ends

    // On click search button
    $("#search").on("click", function () {
        var address = $("#eventLoc").val().trim();
        var googleAPIKey = "AIzaSyBf3B6oIwOLvm3DQgH-gsJu8bsON0AT8ao";
        var geoURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address +
            "&radius=150&key=" + googleAPIKey;
        // console.log(geoURL);
        $.ajax({
            url: geoURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            // latlng = response.results[0].geometry.location;
            // eventLoc.val(response.results[0].formatted_address);
            (response.results.length === 1) ? address = response.results[0].formatted_address : address;
            // Transfer content to HTML
            $("#eventLoc").val(address);
            $("#places-input").val(address);
            address = "";
            // getPos();
            // debugger;
        });
    })//on click event ends

    // Initialize map
    getPos();
})

// Weather api
    // var weatherAPIKey = "&appid=3ddb20c4208b8c89b66edde10d53e4e3";
    // var location = ["Saint Paul, Minnesota", "Minneapolis, Minnesota", "Rochester, Minnesota", "Richmond, Wisconsin"];
    // var unit = "&units=imperial";

    // // We then created an AJAX call
    // location.forEach(function (city) {
    //     // console.log(ci)
    //     var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + unit + weatherAPIKey;
    //     $.ajax({
    //         url: queryURL,
    //         method: "GET"
    //     }).then(function (response) {
    //         console.log(response);
    //         var location = $("<div class = 'location'>").append(
    //             '<br>' + '<strong>' + response.name + '</strong>' +
    //             '<br>' + 'Temperature (F): ' + response.main.temp +
    //             '<br>' + 'Wind Speed: ' + response.wind.speed +
    //             '<br>' + 'Humidity: ' + response.main.humidity);
    //         $("#weather").append(location);
    //     });
    // });