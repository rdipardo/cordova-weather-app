module.exports = async function dismissHangUp(el) {
    if (el.error) {
        const maybe = await $('android=new UiSelector().text("Close app").className("android.widget.Button")');
        if (!maybe.error)
            await maybe.touchAction({
                action: 'tap'
            });
    }
}