module.exports = function(ipAddress, pgclient, callback){
  ipAddressParts = ipAddress.split('.');
  if(ipAddressParts.length != 4 || ipAddressParts.indexOf("") > -1){
    callback(true, null);
  }
  ipNumber = 16777216*ipAddressParts[0] + 65536*ipAddressParts[1] + 256*ipAddressParts[2] + 1*ipAddressParts[3];
  pgclient.query('select * from mapping where ipnumberfrom <= $1::bigint and ipnumberto >= $1::bigint;', [ipNumber], function(err, result){
    if (err) throw err;

    var end_result = result.rows[0];
    delete end_result['ipnumberfrom'];
    delete end_result['ipnumberto'];
    callback(null, end_result);
  });
}
