const dismiss = require('../wd_helper')

describe('App Information Screen', () => {
    let todayNav = null;

    beforeAll(() => driver.setImplicitTimeout(5000));

    beforeEach(async () => {
        await (async () => {
            const aboutNav = await $('android=new UiSelector().text("About").className("android.widget.TextView")');

            await dismiss(aboutNav)

            todayNav = await $('android=new UiSelector().text("Today").className("android.widget.TextView")');
            await dismiss(todayNav)

            await aboutNav.touchAction({
                'action': 'tap'
            });
        })();
    });

    afterEach(async () => {
        const backBtn = await $('android=new UiSelector().className("android.widget.Button").instance(0)');

        await backBtn.touchAction({
            'action': 'tap'
        });
        await todayNav.touchAction({
            'action': 'tap'
        });
    });

    it('should acknowledge author of weather icon set', async () => {
        const attribution = await $('android=new UiSelector().textContains("Erik Flowers").className("android.widget.TextView")');

        expect(await attribution.isDisplayed()).toBeTrue();
    });

    it('should acknowledge app icon author', async () => {
        const attribution = await $('android=new UiSelector().textContains("Stephen Hutchings").className("android.widget.TextView")');

        expect(await attribution.isDisplayed()).toBeTrue();
    });

    it('should display content license statement', async () => {
        const CC_BY_SA_4 = 'Creative Commons Attribution-ShareAlike 4.0 International License';
        const attribution = await $(`android=new UiSelector().textContains("${CC_BY_SA_4}").className("android.widget.TextView")`);

        expect(await attribution.isDisplayed()).toBeTrue();
    });
});
