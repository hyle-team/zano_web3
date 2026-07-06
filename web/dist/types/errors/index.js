export class ZanoWebError extends Error {
    code;
    constructor({ message, code }) {
        super(message);
        this.name = 'ZanoWebError';
        this.code = code;
    }
}
//# sourceMappingURL=index.js.map