@echo off
curl --silent  --ssl-no-revoke -u "%BROWSERSTACK_USERNAME%:%BROWSERSTACK_ACCESS_KEY%" ^
-X POST "https://api-cloud.browserstack.com/app-automate/upload" ^
-F "file=@platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk" ^
-F "data={\"custom_id\": \"io.github.rdipardo.weatherwizard\"}"
