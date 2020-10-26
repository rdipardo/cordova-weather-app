const dismiss = require('../wd_helper')

describe('Display Preferences Screen', () => {
    let todayNav = null;

    beforeAll(() => driver.setImplicitTimeout(9000));

    beforeEach(async done => {
        await (async () => {
            const prefsNav = await $('android=new UiSelector().text("Settings").className("android.widget.TextView")');

            await dismiss(prefsNav)

            todayNav = await $('android=new UiSelector().text("Today").className("android.widget.TextView")');
            await dismiss(todayNav)

            await prefsNav.touchAction({
                'action': 'tap'
            });
        })().then(done);
    });

    afterEach(async () => {
        await todayNav.touchAction({
            'action': 'tap'
        });
    });

    it('should show settings in metric by default', async () => {
        const metricTemp = await $('android=new UiSelector().checked(true).className("android.widget.RadioButton").instance(0)');
        const metricWindSpeed = await $('android=new UiSelector().checked(true).className("android.widget.RadioButton").instance(1)');
        const metricPrecipUnits = await $('android=new UiSelector().checked(true).className("android.widget.RadioButton").instance(2)');

        expect(await metricTemp.getText()).toEqual('\u00b0C');
        expect(await metricWindSpeed.getText()).toEqual('meters / sec');
        expect(await metricPrecipUnits.getText()).toEqual('millimeters');
    });

    it('should update wind speed reading after changing units', async () => {
        const imperialWindSpeed = await $('android=new UiSelector().checked(false).className("android.widget.RadioButton").instance(1)');

        await imperialWindSpeed.touchAction({
            'action': 'tap'
        });
        const submitBtn = await $('android=new UiSelector().text("Save").className("android.widget.Button")');

        await submitBtn.touchAction({
            'action': 'tap'
        });
        const okBtn = await $('android=new UiSelector().text("OK").className("android.widget.Button")');

        await okBtn.touchAction({
            'action': 'tap'
        });
        await todayNav.touchAction({
            'action': 'tap'
        });
        const windValues = await $('android=new UiSelector().textContains("miles/hr").className("android.widget.TextView")');

        expect(await windValues.isDisplayed()).toBe(true);
    });

    it('should restore metric units after reset', async () => {
        const resetBtn = await $('android=new UiSelector().text("Reset").className("android.widget.Button")');

        await resetBtn.touchAction({
            'action': 'tap'
        });
        await todayNav.touchAction({
            'action': 'tap'
        });
        const windValues = await $('android=new UiSelector().textContains("meters/sec").className("android.widget.TextView")');

        expect(await windValues.isDisplayed()).toBe(true);
    });
});
