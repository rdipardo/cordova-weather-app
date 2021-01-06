require('dotenv').config()

const { exec } = require('child_process');
const path = require('path');
const cmd = path.join(__dirname, 'upload');

exec(cmd, (err, stdout, stderr) => {
    if (err) {
        if (err.code === 26) {
            console.error('Can\'t find a release APK! Try `npm run build`.\n');
        } else {
            console.error(err);
        }

        process.exit(1);
    }
    if ((/<head><title>404/u).test(stdout)) {
        console.error('Authentication failed! ' +
      'Make sure to set a BROWSERSTACK_USERNAME ' +
      'and BROWSERSTACK_ACCESS_KEY in a `.env` file ' +
      'and save it to the root of the source tree!\n');
        process.exit(1)
    }
    console.log(stdout);
});
