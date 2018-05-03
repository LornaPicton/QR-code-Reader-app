var score, aberID, token, name, date, leaderboard

/** auth function will get the token from local storage and split the token up to get the claims,
 * then decode to get the information stored in token and assign it to variables
  */
function auth () {
  token = window.localStorage.getItem('token')

  if (!token) {
    window.location.href = 'login.html'
  }
  var jwt = token.split('.')
  var claims = JSON.parse(atob(jwt[1]))
  var student = claims['student'].split(',')
  name = student[0]
}
/** login function, takes the aberID and password from the form and makes a POST request but with the added demonstrator field,
 * this is how the code indicates that the request has come from the mobile app,
 * on success the returned token is stored in local storage and redirects to index.html
  */
$(document).ready(function () {
  $('#btn_id').click(function () {
    var aberID = $('#aberID').val()
    var password = $('#password').val()

    $('#form_id').submit() // Form submission.
    $.ajax({
      type: 'POST',
      url: 'http://svlep21.dcs.aber.ac.uk:3000/login',
      dataType: 'json',
      crossDomain: true,
      data: {
        aberID: aberID,
        password: password,
        demonstrator: true
      },
      success: function (data) {
        window.localStorage.setItem('token', data.token)
        window.location.href = 'index.html'
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        $.mobile.loading('hide', { text: 'Fetching blogs..' })
        // alert("Something wrong happended on the server. Try again..");
        alert('error is ' + errorThrown)
      }
    })
  })
})

// logout function deletes token from local storage and redirects to login page
function logout () {
  window.localStorage.removeItem('token')
  window.location.href = 'login.html'
}

/** scanner function, taken from https://github.com/phonegap/phonegap-plugin-barcodescanner, and had options change to suit
 * needs
 */
function scanner () {
  cordova.plugins.barcodeScanner.scan(
    function (result) {
      aberID = result.text
      QueryDatabase(aberID)
    },
    function (error) {
      alert('Scanning failed: ' + error)
    },
    {
      preferFrontCamera: false, // iOS and Android
      showFlipCameraButton: false, // iOS and Android
      showTorchButton: false, // iOS and Android
      torchOn: false, // Android, launch with the torch switched on (if available)
      saveHistory: true, // Android, save scan history (default false)
      prompt: 'Place a barcode inside the scan area', // Android
      resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
      formats: 'QR_CODE,PDF_417', // default: all but PDF_417 and RSS_EXPANDED
      orientation: 'portrait', // Android only (portrait|landscape), default unset so it rotates with the device
      disableAnimations: true, // iOS
      disableSuccessBeep: true // iOS and Android
    }
  )
}

/** the function addPoints takes in a points parameter that are the number of points wanted to be added,
 * adds them to the current score, makes a request including the date the demonstrator logged in to the app and the points
 * and the new score,
 * if success reset points to 0 and redirects page back to main section
 */
function addPoints (points) {
  console.log('in addPoints')
  console.log(typeof points)
  Number(points)
  score += points
  var d = new Date()
  console.log(d)
  date = d.toDateString()
  console.log(date)
  $.ajax({
    type: 'POST',
    url: 'http://svlep21.dcs.aber.ac.uk:3000/leaderboards/' + aberID,
    dataType: 'json',
    crossDomain: true,
    data: {
      points: points,
      score: score,
      demonstrator: name,
      date: date
    },
    headers: { authorization: 'Bearer ' + token },

    success: function (data) {
      points = 0
      alert('success')
      window.location.href = 'index.html'
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      points = 0
      // alert("Something wrong happended on the server. Try again..");
      alert('error is ' + errorThrown)
    }
  })
}

/** the function QueryDatabase function, makes an ajax query to get the student that has just had the QR code scanned details
 * for example the name and the score
 * on success the details are placed into a  string, this string is then printed to the html page
 */
function QueryDatabase (aberID) {
  $.ajax({
    url: 'http://svlep21.dcs.aber.ac.uk:3000/leaderboards/' + aberID,
    dataType: 'json',
    crossDomain: true,
    headers: { authorization: 'Bearer ' + token },

    success: function (data) {
      if (data.success === false) {
        logout()
      } else {
        score= data.score;
        var student =
          'The student ' + data.name + ' has ' + data.score + ' points.'
        window.location.href = '#student'
        // replace the string "AberID" on student page with the live AberID that has been retrieved from the scan
        document.querySelector('.results').innerHTML = student
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      $.mobile.loading('hide')
      // alert("Something wrong happended on the server. Try again..");
      alert('error is ' + errorThrown)
    }
  })
}
