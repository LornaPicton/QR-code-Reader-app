var score, aberID, token, name,date, leaderboard

function auth () {
  token = window.localStorage.getItem('token')
  console.log('on page')

  if (!token) {
    console.log('redirecting')

    window.location.href = 'login.html'
  }
  var jwt = token.split('.')
  var claims = JSON.parse(atob(jwt[1]))
  var student = claims['student'].split(',')
  name = student[0]
  var code = student[4]
  var role
  if (code === '[ABSM]' || code === '[MUSM]') {
    role = 'Staff Member'
  } else {
    role = 'Student'
  }
}

$(document).ready(function () {
  $('#btn_id').click(function () {
    var aberID = $('#aberID').val()
    var password = $('#password').val()
    console.log(aberID)
    console.log(password)
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
        console.log(data)

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

function logout () {
  window.localStorage.removeItem('token')
  window.location.href = 'login.html'
}

function scanner () {
  console.log('in scanner')
  cordova.plugins.barcodeScanner.scan(
    function (result) {
      alert(
        'We got a barcode\n' +
          'Result: ' +
          result.text +
          '\n' +
          'Format: ' +
          result.format +
          '\n' +
          'Cancelled: ' +
          result.cancelled
      )
      aberID = result.text
      QueryDatabase(aberID) // //redirect to student page
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

function addPoints (points) {
  console.log('in addPoints')

  score += points
var d = new Date()
console.log(d)
  date = d.toDateString();
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
      alert('success')
      window.location.href = 'index.html'
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      
      // alert("Something wrong happended on the server. Try again..");
      alert('error is ' + errorThrown)
    }
  })
}

function QueryDatabase (aberID) {
  console.log('in queryDatabase')
  $.ajax({
    url: 'http://svlep21.dcs.aber.ac.uk:3000/leaderboards/' + aberID,
    dataType: 'json',
    crossDomain: true,
    headers: { authorization: 'Bearer ' + token },

    success: function (data) {
      var student =
        'The student ' + data.name + ' has ' + data.score + ' points.'
      score = data.score
      window.location.href = '#student'
      // replace the string "AberID" on student page with the live AberID that has been retrieved from the scan
      document.querySelector('.results').innerHTML = student
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      $.mobile.loading('hide', { text: 'Fetching blogs..' })
      // alert("Something wrong happended on the server. Try again..");
      alert('error is ' + errorThrown)
    }
  })
}


