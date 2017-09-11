'use strict';

module.exports = (NODE) => {
  const fromIn = NODE.getInputByName('from');
  const toIn = NODE.getInputByName('to');
  const ccIn = NODE.getInputByName('cc');
  const bccIn = NODE.getInputByName('bcc');
  const subjectIn = NODE.getInputByName('subject');
  const textIn = NODE.getInputByName('text');
  const htmlIn = NODE.getInputByName('html');

  const messageOut = NODE.getOutputByName('message');

  function addrConnHandler(addrs, type, mail) {
    if (addrs.length) {
      mail[type] = addrs.join(',');
    } else if (NODE.data[type]) {
      mail[type] = NODE.data[type];
    }
  }

  // return reference glow
  messageOut.on('trigger', (conn, state, callback) => {
    const mail = {};

    Promise.all([
      fromIn.getValues(state)
      .then(addrs => addrConnHandler(addrs, 'from', mail)),
      toIn.getValues(state)
      .then(addrs => addrConnHandler(addrs, 'to', mail)),
      ccIn.getValues(state)
      .then(addrs => addrConnHandler(addrs, 'cc', mail)),
      bccIn.getValues(state)
      .then(addrs => addrConnHandler(addrs, 'bcc', mail)),

      subjectIn.getValues(state)
      .then((subjects) => {
        if (subjects.length) {
          mail.subject = subjects.join('');
        } else if (NODE.data.subject) {
          mail.subject = NODE.data.subject;
        }
      }),

      textIn.getValues(state)
      .then((texts) => {
        if (texts.length) {
          mail.text = texts.join('');
        } else if (NODE.data.text) {
          mail.text = NODE.data.text;
        }
      }),

      htmlIn.getValues(state)
      .then((htmls) => {
        if (htmls.length) {
          mail.html = htmls.join('');
        } else if (NODE.data.html) {
          mail.html = NODE.data.html;
        }
      })
    ])
    .then(() => {
      if (!mail.from || (!mail.to && !mail.cc && !mail.bcc) || !mail.subject) {
        return;
      }

      callback(mail);
    });
  });
};
