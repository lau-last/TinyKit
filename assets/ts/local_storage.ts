type StoredData<T = unknown> = {
    value: T;
    updatedAt: number;
};

export default class LocalStorageManager {

    static setState<T = unknown>(prefix: string, elementId: string, state: T): void {
        const data: StoredData<T> = {
            value: state,
            updatedAt: Date.now()
        };
        localStorage.setItem(`${prefix}#${elementId}`, JSON.stringify(data));
    };

    static getState<T = unknown>(prefix: string, elementId: string): T | null {
        const item = localStorage.getItem(`${prefix}#${elementId}`);
        if (!item) return null;

        try {
            const parsed: StoredData<T> = JSON.parse(item);
            return parsed.value ?? null;
        } catch {
            return null;
        }
    };

    static getStates<T = unknown>(prefix: string): Record<string, T | null> {
        const states: Record<string, T | null> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`${prefix}#`)) {
                const trimmedKey = key.substring(`${prefix}#`.length);
                try {
                    const itemStr = localStorage.getItem(key);
                    if (!itemStr) {
                        states[trimmedKey] = null;
                        continue;
                    }
                    const item: StoredData<T> = JSON.parse(itemStr);
                    states[trimmedKey] = item.value ?? null;
                } catch {
                    states[trimmedKey] = null;
                }
            }
        }
        return states;
    };

    static getLastUpdated<T = unknown>(prefix: string): { id: string; value: T; updatedAt: number } | null {
        let lastKey: string | null = null;
        let lastTimestamp = 0;
        let lastValue: T | null = null;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`${prefix}#`)) {
                try {
                    const itemStr = localStorage.getItem(key);
                    if (!itemStr) continue;
                    const item: StoredData<T> = JSON.parse(itemStr);
                    if (item.updatedAt && item.updatedAt > lastTimestamp) {
                        lastTimestamp = item.updatedAt;
                        lastKey = key.substring(`${prefix}#`.length);
                        lastValue = item.value;
                    }
                } catch {
                    continue;
                }
            }
        }

        if (lastKey === null) return null;

        return {id: lastKey, value: lastValue as T, updatedAt: lastTimestamp};
    };


    static clearPrefix(prefix: string): void {
        const keysToRemove: string[] = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`${prefix}#`)) {
                keysToRemove.push(key);
            }
        }

        for (const key of keysToRemove) {
            localStorage.removeItem(key);
        }
    }
}
