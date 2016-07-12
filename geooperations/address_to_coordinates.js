var geocoder = require('geocoder');

module.exports = function(address, callback){
  geocoder.geocode(address, function ( err, data ) {
    if(err){
      callback(err, null);
    }
    result = data['results'][0]['geometry']['location'];
    callback(null, result);
  });
}
