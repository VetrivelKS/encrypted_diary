const fs = require('fs');
const readline = require('readline');
const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const password = 'YourEncryptionPassword'; // Replace with your encryption password
const filename = 'enc.txt';

const encryptString = (data, password) => {
    const cipher = crypto.createCipher(algorithm, password);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

const saveEncryptedDataToFile = (data, password) => {
    console.log('data', data)
    const existingData = readFileSync(password).then((existingData) => {
        console.log('existingData', existingData)
        const encryptedData = encryptString((existingData || '') + data, password);
        fs.writeFile(filename, encryptedData, (err) => {
            if (err) {
                console.error('Error saving encrypted data:', err);
            } else {
                console.log(`Encrypted data saved to ${filename}`);
            }
        });
    })
        .catch((err) => {
            console.error('Error reading file:', err);
            const encryptedData = encryptString(data, password);
            fs.writeFile(filename, encryptedData, (err) => {
                if (err) {
                    console.error('Error saving encrypted data:', err);
                } else {
                    console.log(`Encrypted data saved to ${filename}`);
                }
            });
        })
}



const decryptString = (encryptedData, password) => {
    const decipher = crypto.createDecipher(algorithm, password);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

const readFileSync = (password) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, fileData) => {
            if (err) {
                reject(err);
            } else {
                const decryptedData = decryptString(fileData, password);
                resolve(decryptedData);
            }
        });
    });
};


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false, // Allow newline/Enter key to be processed
});

const inputChunks = [];

rl.on('line', (chunk) => {
    console.log('line', chunk)
    if (chunk.startsWith("end123")) {
        const passwordSplit = chunk.split('_')
        const password = passwordSplit[1] || 'password'
        const inputString = inputChunks.join('\n') + '\n';
        saveEncryptedDataToFile(inputString, password);
        rl.emit('close');
    } else {
        inputChunks.push(chunk);
    }
});

