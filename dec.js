const fs = require('fs');
const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
// const password = 'YourEncryptionPassword'; 
const decryptString = (encryptedData, password) => {
  const decipher = crypto.createDecipher(algorithm, password);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

const readEncryptedFile = (filename, password) => {
  fs.readFile(filename, 'utf8', (err, encryptedData) => {
    if (err) {
      console.error('Error reading encrypted file:', err);
    } else {
      const decryptedData = decryptString(encryptedData, password);
      console.log('Decrypted Data:');
      console.log(decryptedData);
    }
  });
};

// Usage example
const filename = 'enc.txt';



const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter your pass: ', (password) => {
  readEncryptedFile(filename, password);
  rl.close();
});