// Called when jQuery Mobile is loaded and ready to use.
$(document).on('mobileinit', $(document), function () {
    console.log("before new");
    new Controller();
    console.log("after new");
});