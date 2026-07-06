export declare class ZanoWebError<T extends string = string> extends Error {
    code: T;
    constructor({ message, code }: {
        message: string;
        code: T;
    });
}
