'use strict';

module.exports = (NODE) => {
  const triggerIn = NODE.getInputByName('trigger');
  const serverIn = NODE.getInputByName('servers');
  const messageIn = NODE.getInputByName('messages');

  const doneOut = NODE.getOutputByName('done');

  // return reference glow
  triggerIn.on('trigger', (conn, state) => {
    Promise.all([serverIn.getValues(state), messageIn.getValues(state)])
    .then(([servers, messages]) => {
      const total = servers.length * messages.length;
      let sent = 0;

      function onSent() {
        if (++sent === total) {
          doneOut.trigger(state);
        }
      }

      servers.forEach((server) => {
        messages.forEach((message) => {
          if (!message.from || (!message.to && !message.cc && !message.bcc) || !message.subject) {
            onSent();
            return;
          }

          server.sendMail(message, (err) => {
            if (err) {
              NODE.error(err, state);
              return;
            }
            onSent();
          });
        });
      });
    });
  });
};
