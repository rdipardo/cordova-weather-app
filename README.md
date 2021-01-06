# Cordova Weather App

[![API Docs]][API Docs Workflow]  [![CircleCI][cci-status-badge]][cci-status]  [![BrowserStack Build Status][bs-status-badge]][bs-status]

Hybrid Android app using [cordova-android] for native geolocation, with a WebView interface built on [jQuery Mobile].

|    |    |    |
|:--:|:--:|:--:|
|![WeatherWizard-daily-screen]|![WeatherWizard-gps-search]|![WeatherWizard-long-range]|

## Build Requirements

- [JDK 8](https://adoptopenjdk.net) &#x2013; *no later versions!*
- [gradle](https://gradle.org/install) &#x2013; any recent version (6.x is recommended)
- [node](https://nodejs.org/en/download) &#x2013; any LTS version (12.x is recommended)
- the Android SDK &#x2013; API levels 22 to 29 [are supported][minSdkVersion]. You can install one via the SDK Manager bundled with [Android Studio](https://developer.android.com/studio/install)
- (*optional*) an Android emulator, obtainable via the same SDK Manager

Skip the last item if you're comfortable with using a personal device in Developer Mode. See [these instructions][Developer Mode] on how to do that.

### Configuring your build environment

**Note.**
This app depends on the [OpenWeather API][] to fetch current weather data. *No other API will work!*

- Make sure to [create an OpenWeather account][] and obtain [your API token][]
- Verify that `node`, `npm` and `gradle` are on your system's `PATH`. The commands
`node -v`, `npm -v` and `gradle -v` should print out an appropriate version string
- Create a `JAVA_HOME` environment variable pointing to your JDK installation

**Note.**
The `JAVA_HOME` path *should not include* the `bin` folder!

##### Windows

- From the Control Panel, select **System and Security** > **System** > **Advanced system settings**
- Click the **Environment Variables** button
- In the **System variables** dialog box, click **New...**
- In the **Variable name** text field, type `JAVA_HOME`
- In the **Variable value** text field, type the full path to your installed JDK, e.g. `C:\full\path\to\your\JDK`
- Click *OK*

##### Mac or Linux

Add this line to your `~/.profile`, `~/.zshrc` or `~/.bashrc`:

```sh
export JAVA_HOME="/full/path/to/your/JDK"
```

- Make a note of where the Android SDK libraries have been installed and locate the directory on your file system
- Copy and paste the full path, e.g.

##### Windows

    C:\full\path\to\your\Android\Sdk

##### Mac or Linux

    /full/path/to/your/Android/Sdk
<br/>

- Following the same steps as above, create an `ANDROID_SDK_ROOT` environment variable pointing to the SDK path (**preferred**)

> Alternatively, create an `ANDROID_HOME` environment variable pointing to the SDK path (**deprecated but still acceptable**)

### Configuring `gradle`

Leaving all the default options in place should work fine.

If you want to target a specific Android API level, or tweak the compilation process, read Cordova's documentation on [passing build options] to the gradle wrapper.

## Building

Find [your API token][] and save it to `www/config.js`:

```javascript
const ENV = {
    'OPENWEATHER_APPID': '<your_OpenWeather_API_token>'
}
```

Validate your setup with `npm run check`, then run:

```text
npm install
npm run build
```

## Testing

- Sign up for [BrowserStack]
- Add your username and access key to a `.env` file and save it to the root of the source tree:

```sh
BROWSERSTACK_USERNAME="your_username"
BROWSERSTACK_ACCESS_KEY="your_access_key"
```

- Run the automation tests:

```text
npm test
```

## Running locally

##### Using an emulator

Make sure the emulator is fired up ahead of time (it will take a while!), then run:

```text
npm run emulator
```

##### Using a device

Be sure to [enable USB debugging] on the device (requires [Developer Mode]). Connect it via USB cable to your PC, then run:

```text
npm run device
```

## Acknowledgements

Weather icons copyright (c) [Erik Flowers](https://github.com/erikflowers/weather-icons).<br/>
Weather icons font licensed under the terms of the [SIL OFL 1.1](http://scripts.sil.org/OFL).<br/>
Weather icons source code licensed under the terms of the [MIT License](http://opensource.org/licenses/mit-license.html).<br/>
Visit the [Weather Icons](https://github.com/erikflowers/weather-icons) repository for complete licensing and attribution details.

App icon source image copyright (c) [Stephen Hutchings](https://www.iconfinder.com/icons/216532/stormy_weather_icon) and distributed under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0).

Splash screen and background [source image](https://www.pexels.com/photo/assorted-hot-air-balloons-photo-during-sunset-670061) distributed under a [Creative Commons Zero license (CC0)](https://creativecommons.org/share-your-work/public-domain/cc0).

## License

Copyright (c) 2019-2021 Robert Di Pardo

Distributed under the [Apache License Version 2.0](https://opensource.org/licenses/Apache-2.0).

![CC BY-SA 4.0](https://i.creativecommons.org/l/by-sa/4.0/88x31.png)

Portions of this work are licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-sa/4.0/).


[cordova-android]: https://www.npmjs.com/package/cordova-android
[jQuery Mobile]: https://jquerymobile.com
[BrowserStack]: https://www.browserstack.com
[enable USB debugging]: https://www.recovery-android.com/enable-usb-debugging-on-android.html
[Developer Mode]: https://android.gadgethacks.com/how-to/unlock-developer-options-your-pixel-android-9-0-pie-0183349/
[minSdkVersion]: https://github.com/apache/cordova-android/pull/915/
[OpenWeather API]: https://openweathermap.org/api
[create an OpenWeather account]: https://openweathermap.org/guide#how
[your API token]: https://openweathermap.org/appid
[passing build options]: https://cordova.apache.org/docs/en/latest/guide/platforms/android/#configuring-gradle
[cci-status]: https://circleci.com/gh/rdipardo/cordova-weather-app
[cci-status-badge]: https://circleci.com/gh/rdipardo/cordova-weather-app.svg?style=svg
[bs-status]: https://app-automate.browserstack.com/dashboard/v2/builds/401dd049668eb908545b1c6ff845abecbfb33538
[bs-status-badge]: https://app-automate.browserstack.com/badge.svg?badge_key=ZjZJTTlKZCtrOEUweXBqTlR2THpDNkhZTXc4R3phdW9IbnRoOVA4WkpYOD0tLU00VjFSZEIxOGRKTXB6alR0TURkK1E9PQ==--4c44450eca889dc5b5905421dcf98e2197a07690
[API Docs]: https://github.com/rdipardo/cordova-weather-app/workflows/API%20Docs/badge.svg?branch=main
[API Docs Workflow]: https://github.com/rdipardo/cordova-weather-app/actions?query=workflow%3AAPI%20Docs
[WeatherWizard-daily-screen]: https://raw.githubusercontent.com/rdipardo/cordova-weather-app/main/.github/img/daily_city_search.jpg
[WeatherWizard-gps-search]: https://raw.githubusercontent.com/rdipardo/cordova-weather-app/main/.github/img/daily_gps_search.jpg
[WeatherWizard-long-range]: https://raw.githubusercontent.com/rdipardo/cordova-weather-app/main/.github/img/five_day_outlook.jpg
