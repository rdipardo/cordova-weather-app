const dismiss = require('../wd_helper')

describe('Location Selection Screen', () => {
    let citySelector = null,
        submitBtn = null,
        txtInput = null;

    beforeAll(() => driver.setImplicitTimeout(5000));

    beforeEach(async () => {
        await (async () => {
            txtInput = await $('android=new UiSelector().className("android.widget.EditText").instance(0)');
            await dismiss(txtInput);

            citySelector = await $('android=new UiSelector().text("City").className("android.widget.RadioButton")');
            await dismiss(citySelector);

            submitBtn = await $('android=new UiSelector().text("Search").className("android.widget.Button")');
            await dismiss(submitBtn);
        })();
    });

    afterEach(async () => {
        await citySelector.touchAction({
            'action': 'tap'
        });
        await txtInput.clearValue();
    });

    it('should show city name input by default', async () => {
        expect(await citySelector.getAttribute('checked')).toEqual('true');
        expect(await txtInput.isDisplayed()).toBeTrue();
    });

    it('should disable search button when text input is empty', async () => {
        expect(await txtInput.getText()).toBeFalsy();
        expect(await submitBtn.isEnabled()).toBe(false);
    });

    it('should enable search button when text is entered', async () => {
        await txtInput.addValue('Tokyo');
        expect(await submitBtn.isEnabled()).toBeTrue();
    });

    it('should enable search button when switching to GPS input', async () => {
        const geolocSelector = await $('android=new UiSelector().text("GPS").className("android.widget.RadioButton")');

        await geolocSelector.touchAction({
            'action': 'tap'
        });
        const rngLat = await $('android=new UiSelector().text("Latitude").className("android.widget.SeekBar")');
        const rngLong = await $('android=new UiSelector().text("Longitude").className("android.widget.SeekBar")');

        expect(await rngLat.isDisplayed()).toBeTrue();
        expect(await rngLong.isDisplayed()).toBeTrue();
        expect(await submitBtn.isEnabled()).toBeTrue();
    });

    it('should update screen after searching a city', async () => {
        const CITY = 'New York';

        await txtInput.addValue(CITY);
        await submitBtn.touchAction({
            'action': 'tap'
        });
        await txtInput.addValue(CITY.slice(0, 2));
        const lastQuery = await $(`android=new UiSelector().textStartsWith("${CITY}").className("android.widget.TextView")`);

        expect(await lastQuery.getText()).toContain(CITY);
    });
});
