const fs = require('fs');
const path = require('path');
const vm = require('vm');
const config = path.join(__dirname, '../www/config.js');

try {
    if (!fs.existsSync(config)) {
        console.error(`No config file at ${config}\n`)
        process.exit(1)
    }

    try {
        fs.readFile(config, 'utf8', (err, data) => {
            if (err) {
                throw err
            }

            if (typeof vm.runInNewContext(`${data}; ENV.OPENWEATHER_APPID`) !== 'string') {
                console.error('Can\'t find a valid OPENWEATHER_APPID in your configuration!\n')
                process.exit(1)
            }

            console.info('App is configured properly.\n')

        });

    } catch (err) {
        console.error(`Reading configuration failed with message: ${err}.\n`)
        process.exit(1)
    }
} catch (err) {
    console.error(`Failed to load config file at ${config}\n`)
    process.exit(1)
}
