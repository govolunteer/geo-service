module.exports = {
  register: require('hapi-node-postgres'),
  options: {
    connectionString: process.env.DATABASE_URL || 'postgres://geomapper:geomapping12345@localhost/ip2location',
    native: true
  }
};
