const CryptoJS = require("crypto-js");


exports.encryptMessage = (message, key) => {
    return CryptoJS.AES.encrypt(message, key).toString();
};

exports.decryptMessage = (encryptedMessage, key) => {
    return CryptoJS.AES.decrypt(encryptedMessage, key).toString(CryptoJS.enc.Utf8);
};
