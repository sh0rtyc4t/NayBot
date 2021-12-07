const proto = ctx.Eris.User.prototype;

Object.defineProperty(proto, "tag", {
    get () {
        return `${this.username}#${this.discriminator}`;
    }
});