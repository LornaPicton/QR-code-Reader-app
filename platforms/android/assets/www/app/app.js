var AberID;
function scanner() {
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
                QueryDatabase(result.text)   ;            // //redirect to student page
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


function QueryDatabase( aberID){
    console.log("in function");

//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//            // Typical action to be performed when the document is ready:
//             window.location.href = "#student";
//             //replace the string "AberID" on student page with the live AberID that has been retrieved from the scan
//             document.querySelector('.results').innerHTML = xhttp.responseText;
//         }
//     };
//     xhttp.open("GET", "http://svlep21.dcs.aber.ac.uk:3000/get_student", true);
//     xhttp.send();

// }


    $.ajax({
        
        url : "http://svlep21.dcs.aber.ac.uk:3000/leaderboards",
        dataType : 'json',
        crossDomain: true,
        data: {"aberID": aberID},
        
        success : function(data){
            var leaderboard= JSON.stringify(data);
            window.location.href = "#student";
            //replace the string "AberID" on student page with the live AberID that has been retrieved from the scan
            document.querySelector('.results').innerHTML = leaderboard;
        
        },
        error : function(XMLHttpRequest,textStatus, errorThrown) {   
            $.mobile.loading( 'hide',{text:"Fetching blogs.."});  
            //alert("Something wrong happended on the server. Try again.."); 
            alert("error is " + errorThrown); 
 
        }
    })
}