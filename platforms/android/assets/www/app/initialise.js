// Called when jQuery Mobile is loaded and ready to use.
$(document).on('mobileinit', $(document), function () {
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
    console.log("before new");
    new Controller();
    console.log("after new");
});