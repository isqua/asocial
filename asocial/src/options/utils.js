'use strict';

/**
 * Call method from parent with child context and arguments.
 * @param {String} method - called method.
 * @param {...*} arguments for method.
 * @return {*} - returned result.
*/
function callSuper(method) {
    var args = Array.prototype.slice.call(arguments, 1);
    var superProto = this.constructor.__super.prototype[method];

    return superProto ? superProto.apply(this, args) : null;
}

module.exports = {
    /**
     * Inherit prototypes from parent function.
     * @param  {Function} Parent
     * @param  {Function} Child
    */
    inherit: function inherit(Child, Parent) {
        Object.assign(Child.prototype, Parent.prototype);
        Child.__super = Parent;

        Child.prototype.callSuper = callSuper;
    },

    /**
     * Make DocumentFragment and insert content in it.
     * @param {HTMLElement[]} array
     * @returns {DocumentFragment}
     */
    getFragment: function getFragment(array) {
        var df = document.createDocumentFragment();

        array.forEach(df.appendChild, df);

        return df;
    }
};
