'use strict';

module.exports = (NODE) => {
  const nodemailer = require('nodemailer');

  const serverOut = NODE.getOutputByName('server');
  serverOut.on('trigger', (conn, state, callback) => {
    const smtpConfig = {
      host: NODE.data.host,
      port: NODE.data.port,
      secure: false, // use SSL/TLS
      // proxy: 'http://someaddress:someport/'
      auth: {
        user: NODE.data.username,
        pass: NODE.data.password
      }
    };

    callback(nodemailer.createTransport(smtpConfig));
  });
};
