const fs = require('fs');
const path = require('path');
const captures = path.join(__dirname, '../captures');

try {
    if (!fs.existsSync(captures)) {
        fs.mkdirSync(captures)
    }
} catch (err) {
    console.error(`Creating: ${captures} failed with message: ${err}`)
}
