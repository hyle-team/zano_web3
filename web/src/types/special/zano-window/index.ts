export type GlobalWindow = Window & typeof globalThis;

export interface ZanoWindowObject {
    request: (str: string, params?: any, timeoutMs?: number | null) => Promise<any>;
}

export type ZanoWindow = Omit<GlobalWindow, 'Infinity'> & {
    zano: ZanoWindowObject
}