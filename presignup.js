'use strict';

module.exports.autoconfirm = async (event, context, cb) => {
  event.response.autoConfirmUser = true;
  cb(null, event);
};