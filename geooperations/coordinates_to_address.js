var geocoder = require('geocoder');

module.exports = function(lat, long, callback){
  geocoder.reverseGeocode(lat, long, function ( err, data ) {
    if(err){
      callback(err, null);
    }
    callback(null, data);
  });
}
