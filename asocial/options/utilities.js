'use strict';

/**
* callSuper - call method from parent with child context and arguments.
*
* @param  {String} method - called method.
* @return {*} - returned result.
*/
function callSuper(method) {
    var args = Array.prototype.slice.call(arguments, 1);
    var superProto = this.constructor.__super.prototype[method];

    if (superProto) {
        return superProto.apply(this, args);
    }

    return null;
}

/**
* inherit - inherit prototypes from parent function.
*
* @param  {Function} Parent
* @param  {Function} Child
*/
function inherit(Parent, Child) {
    Object.assign(Child.prototype, Parent.prototype);
    Child.__super = Parent;

    Child.prototype.callSuper = callSuper;
}
