var score,
    aberID;

function scanner() {
    console.log("in scanner");
    cordova.plugins.barcodeScanner.scan(
        
        function (result) {
            alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
            aberID = result.text;
            QueryDatabase(aberID);            // //redirect to student page
            // window.location.href = "#student";
            // //replace the string "AberID" on student page with the live AberID that has been retrieved from the scan
            // document.querySelector('.results').innerHTML = result.text;
        },
        function (error) {
            alert("Scanning failed: " + error);
        },
        {
            preferFrontCamera: false, // iOS and Android
            showFlipCameraButton: false, // iOS and Android
            showTorchButton: false, // iOS and Android
            torchOn: false, // Android, launch with the torch switched on (if available)
            saveHistory: true, // Android, save scan history (default false)
            prompt: "Place a barcode inside the scan area", // Android
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
            orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
            disableAnimations: true, // iOS
            disableSuccessBeep: true // iOS and Android
        }
    );


};

function addPoints(points) {
   console.log("in addPoints");
    
    score += points;
   

    $.ajax({
        type: "POST",
        url: "http://svlep21.dcs.aber.ac.uk:3000/leaderboards/" + aberID,
        dataType: 'json',
        crossDomain: true,
        data: { "score": score },


        success: function (data) {
            alert("success");

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $.mobile.loading('hide', { text: "Fetching blogs.." });
            //alert("Something wrong happended on the server. Try again.."); 
            alert("error is " + errorThrown);

        }
    })
}


function QueryDatabase(aberID) {
    console.log("in queryDatabase");
    $.ajax({

        url: "http://svlep21.dcs.aber.ac.uk:3000/leaderboards/" + aberID,
        dataType: 'json',
        crossDomain: true,


        success: function (data) {
            var student = "The student " + data.name + " has " + data.score + " points."
            score = data.score
            window.location.href = "#student";
            //replace the string "AberID" on student page with the live AberID that has been retrieved from the scan
            document.querySelector('.results').innerHTML = student;

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $.mobile.loading('hide', { text: "Fetching blogs.." });
            //alert("Something wrong happended on the server. Try again.."); 
            alert("error is " + errorThrown);

        }
    })
}