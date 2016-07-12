'use strict';

const Hapi = require('hapi');
const database = require('./database_config');
var ip_to_location = require('./geooperations/ip_to_location');
var address_to_coordinates = require('./geooperations/address_to_coordinates');
var coordinates_to_address = require('./geooperations/coordinates_to_address');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

// Register Database
server.register(database, (err) => {

    if (err) {
        console.error('Failed loading "hapi-node-postgres" plugin');
    }
 });

// Add the route
server.route({
    method: 'GET',
    path:'/info',
    handler: function (request, reply) {
        return reply(
          "<table border='1'><tr><th>route</th><th>output</th><th>example</th></tr><tr><td>/location/ip/{ip}</td><td>{'country_code': ..., 'country': ..., 'region': ..., 'city': ...}</td><td>/location/ip/85.179.115.166</td></tr><tr><td>/coordinates/address/{address}</td><td>{lat: ..., lng: ...}</td><td>/coordinates/address/Berlin, Berlin</td></tr><tr><td>/address/coordinates/{coordinates}</td><td>huge google places json</td><td>/address/coordinates/52.01,35.09</td></tr></table>"
        );
    }
});

server.route({
    method: 'GET',
    path:'/location/ip/{ip}',
    handler: function (request, reply) {
        ip_to_location(encodeURIComponent(request.params.ip), request.pg.client, function(err, result){
          if(err){
            return reply({'message': 'no valid ip address'}).code(400);
          }

          return reply(result);
        });
    }
});

server.route({
    method: 'GET',
    path:'/coordinates/address/{address}',
    handler: function (request, reply) {
        address_to_coordinates(request.params.address, function(err, result){
          if(err){
            return reply({'message': 'no valid address'}).code(400);
          }

          return reply(result);
        });
    }
});

server.route({
    method: 'GET',
    path:'/address/coordinates/{coordinates}',
    handler: function (request, reply) {
      var coordinates = request.params.coordinates.split(',');
        coordinates_to_address(coordinates[0], coordinates[1], function(err, result){
          if(err){
            return reply({'message': 'no valid address'}).code(400);
          }

          return reply(result);
        });
    }
});

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
