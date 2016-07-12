# geo-service

## First steps

* create postgresql database and table according to *database_config.js*
* download or ask your colleagues for the ip mapping table (too big to load into this repository) with the following columns:
  * ip number from
  * ip number to
  * country_code
  * country
  * region
  * city
* run the sql script in *geooperations/ip_data/import_csv.sql* to import the ip mapping table
* run `npm install`

* `npm start` ;)

## API definition

<table border='1'><tr><th>route</th><th>output</th><th>example</th></tr><tr><td>/location/ip/{ip}</td><td>{'country_code': ..., 'country': ..., 'region': ..., 'city': ...}</td><td>/location/ip/85.179.115.166</td></tr><tr><td>/coordinates/address/{address}</td><td>{lat: ..., lng: ...}</td><td>/coordinates/address/Berlin, Berlin</td></tr><tr><td>/address/coordinates/{coordinates}</td><td>huge google places json</td><td>/address/coordinates/52.01,35.09</td></tr></table>
