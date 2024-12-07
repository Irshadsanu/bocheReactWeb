import CryptoJS from 'crypto-js';

// Define the key
const key = CryptoJS.enc.Utf8.parse('XedfNNHdfgCCCCvsdFRT34567nbhHHHn');

// Encrypt function without IV
export const encrypt = (plainText) => {
  const encrypted = CryptoJS.AES.encrypt(plainText, key, {
    mode: CryptoJS.mode.ECB,  // Change mode to ECB to omit IV
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();  // base64-encoded string
}

// Decrypt function without IV
export const decrypt = (cipher) => {
  const decrypted = CryptoJS.AES.decrypt(cipher, key, {
    mode: CryptoJS.mode.ECB,  // Change mode to ECB to omit IV
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
