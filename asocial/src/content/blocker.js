/**
 * enableAsocial - replace block and enable observer
 *
 * @param  {type} callback - function for replace news block.
 */
function enableAsocial(callback) {
    var asocialContentObserver = new MutationObserver(callback);

    callback();

    asocialContentObserver.observe(document.body, { attributes: true });
}

module.exports = {
    CHECKING_TIMEOUT: 5000,
    /**
     * check - send response for check rules
     */
    check: function check(network) {
        chrome.runtime.sendMessage(network);
        setTimeout(() => {
            this.check(network);
        }, this.CHECKING_TIMEOUT);
    },

    /**
     * init - initialization blocking functions
     *
     * @param  {String} network - name of network(e.g. vk)
     * @param  {Function} newsBlocker - function, which replaces news block to asocial block
     */
    init: function init(network, newsBlocker) {
        window.addEventListener('load', () => {
            var isDisabled = false;

            chrome.runtime.onMessage.addListener(shouldDisable => {
                if (shouldDisable) {
                    enableAsocial(newsBlocker);
                    isDisabled = true;
                } else {
                    if (isDisabled) {
                        location.reload();
                    }
                }
            });

            document.body.classList.add('asocial_showed');

            this.check(network);
        });
    }
};
