// @author Chris Loftus
// @version 2.0 (20th April 2017)
// This class represents the Map tab user interface.
//
// Note that, until ES6 modules are supported, there is no natural way to make members and methods
// private. For this class we simply place the callback functions inside
// the constructor. That way, they cannot be accessed directly from outside
// of the class. This makes the constructor very long.
class Map {

  constructor(){
    
    this.position = null;
    this.mapDisplayed = false;
    this.currentMapWidth = 0;
    this.currentMapHeight = 0;   
    
    // Using ES6 arrow function notation. This always binds "this" from the
    // enclosing scope into the function, rather than "this" being bound
    // in this case to "window".
    // The jQuery resize event is shorthand for .on('resize', function).
    $(window).resize(() => {this.deal_with_geolocation()});
  }
  
  get_map_height(){
    return $(window).height() - ($('#maptitle').height() + $('#mapfooter').height());
  }

  get_map_width(){
    return $(window).width() ;
  }
  
  refresh(){
    //if (!this.mapDisplayed || (this.currentMapWidth != this.get_map_width() ||
        //self.currentMapHeight != this.get_map_height())){
    if (!this.mapDisplayed){
      this.deal_with_geolocation();
    }
  }
  
  deal_with_geolocation() {
  
    // This is another technique (hack) to bind "this" to the object of the Map class
    // so that we can use "self" instead of "this" in callback functions. The problem
    // is that callback functions will rebind "this" to be associated with the target
    // of the event. We could try and use the ES6 => notation instead but I wanted
    // to show an alternative.
    let self = this;
  
    // Essentially the following functions are all private and so because ES6 does not
    // provide any notion of access modifiers I have made these functions hidden as
    // nested functions within the deal_with_geolocation method.
    function initiate_geolocation() {

      // Do we have built-in support for geolocation (either native browser or phonegap)?
      if (window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(handle_geolocation_query, handle_errors);
      }
      else {
        // We don't so let's try a polyfill
        yqlgeo.get('visitor', normalize_yql_response);
      }
    }
  
    function handle_errors(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.log('user did not share geolocation data');
          break;

        case error.POSITION_UNAVAILABLE:
          console.log('could not detect current position');
          break;

        case error.TIMEOUT:
          console.log('retrieving position timed out');
          break;

        default:
          console.log('unknown error when getting the geolocation position using the navigator');
          break;
      }
    }

    function normalize_yql_response(response) {
      if (response.error) {
        let error = { code: 0 };
        self.handle_errors(error);
        return;
      }

      position = {
        coords: {
          latitude: response.place.centroid.latitude,
          longitude: response.place.centroid.longitude
        },
        address: {
          city: response.place.locality2.content,
          region: response.place.admin1.content,
          country: response.place.country.content
        }
      };

      self.handle_geolocation_query(position);
    }
    
    function handle_geolocation_query(pos) {
     self.position = pos;

     self.currentMapHeight = self.get_map_height();
     self.currentMapWidth = self.get_map_width();

     let image_url = 'https://maps.googleapis.com/maps/api/staticmap?center=' + self.position.coords.latitude + ',' +
                      self.position.coords.longitude + '&zoom=14&size=' +
                      self.currentMapWidth + 'x' + self.currentMapHeight + '&markers=color:blue|label:S|' +
                      self.position.coords.latitude + ',' + self.position.coords.longitude +
                      '&key=AIzaSyBn0zEwfhDD_bZji6ifwLfz3pk-Hdu_1yY';

      $('#map-img').remove();

      jQuery('<img/>', {
            id: 'map-img',
            src: image_url,
            title: 'Google map of my location'
       }).appendTo('#mapPos');

       self.mapDisplayed = true;
    }
  
  
    let phoneGapApp = (document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1 );
    if (window.navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
      // Running on a mobile. Will have to add to this list for other mobiles.
        // We need the above because the deviceready event is a phonegap event and
        // if we have access to PhoneGap we want to wait until it is ready before
        // initialising geolocation services
        if (phoneGapApp){
          console.log("Running as PhoneGapp app");
          document.addEventListener('deviceready', initiate_geolocation);
        }
        else {
          console.log("Running as mobile browser app");
          initiate_geolocation(); // Directly from the mobile browser
        }
    } else {
      console.log("Running as desktop browser app");
      initiate_geolocation(); // Directly from the browser
    }
  }
}

