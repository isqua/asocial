module.exports = {
    CHECKING_TIMEOUT: 5000,
    CHECKING_TIMEOUT_BEFORE_LOAD: 300,

    isInited: false,
    isDisabled: false,
    isHidden: false,
    DOMContentLoaded: false,

    /**
     * check - send response for check rules
     */
    check: function check(network) {
        chrome.runtime.sendMessage(network);

        var checkingTimeout = this.isInited ? this.CHECKING_TIMEOUT : this.CHECKING_TIMEOUT_BEFORE_LOAD;

        setTimeout(() => this.check(network), checkingTimeout);
    },

    /**
     * Hide document on init, if we should disable the site
     */
    hideDocument: function() {
        if (this.isHidden) {
            return;
        }

        var style = document.createElement('style');

        style.id = 'asocial_lock';
        style.innerHTML = 'html { opacity: 0 }';

        document.head.appendChild(style);
        this.isHidden = true;
    },

    /**
     * Show document after init
     */
    showDocument: function() {
        if (! this.isHidden) {
            return;
        }

        var style = document.head.querySelector('#asocial_lock');

        if (style) {
            document.head.removeChild(style);
        }
    },

    /**
     * @param  {String} network - name of network(e.g. vk)
     * @param  {Function} newsBlocker - function, which replaces news block to asocial block
     * @param  {Function} isLoaded — function to check if website is completely loaded
     *
     * @returns {Function}
     */
    onMessage: function(network, newsBlocker, isLoaded) {
        /**
         * Block site if needed, or reload when site is blocked but should be shown
         * @param {Boolean} shouldDisable
         */
        return (shouldDisable) => {
            if (this.isDisabled && ! shouldDisable) {
                return window.location.reload();
            }

            if (shouldDisable && ! this.isInited) {
                // If it’s first message, hide all on the page
                this.hideDocument();
                this.isDisabled = true;

                // If content is loaded but not blocked, block it
                if (this.DOMContentLoaded && isLoaded()) {
                    newsBlocker();
                    this.showDocument();
                    this.isInited = true;
                }
            }

            if (shouldDisable && this.isInited) {
                newsBlocker();
                this.showDocument();
            }
        };
    },

    onDocumentLoaded: function() {
        /**
         * Set flag when document is loaded
         */
        return () => {
            this.DOMContentLoaded = true;

        };
    },

    /**
     * init - initialization blocking functions
     *
     * @param  {String} network - name of network(e.g. vk)
     * @param  {Function} newsBlocker - function, which replaces news block to asocial block
     * @param  {Function} [isLoaded] — function to check if website is completely loaded
     */
    init: function init(network, newsBlocker, isLoaded) {
        isLoaded = isLoaded || (() => Boolean(document.body));

        chrome.runtime.onMessage.addListener(this.onMessage(network, newsBlocker, isLoaded));
        this.check(network);

        var asocialContentObserver = new MutationObserver(function() {
            if (this.isDisabled) {
                this.hideDocument();
            }
            chrome.runtime.sendMessage(network);
        });

        window.addEventListener('DOMContentLoaded', this.onDocumentLoaded());

        window.addEventListener('DOMContentLoaded', function() {
            asocialContentObserver.observe(document.body, { attributes: true });
        });
    }
};
