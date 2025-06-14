export default class LocalStorageManager {
    static setState(prefix, dataKey, state) {
        const data = {
            value: state,
            updatedAt: Date.now()
        };
        localStorage.setItem(`${prefix}#${dataKey}`, JSON.stringify(data));
    }
    ;
    static getState(prefix, dataKey) {
        var _a;
        const item = localStorage.getItem(`${prefix}#${dataKey}`);
        if (!item)
            return null;
        try {
            const parsed = JSON.parse(item);
            return (_a = parsed.value) !== null && _a !== void 0 ? _a : null;
        }
        catch (_b) {
            return null;
        }
    }
    ;
    static getStates(prefix) {
        var _a;
        const states = {};
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
                    const item = JSON.parse(itemStr);
                    states[trimmedKey] = (_a = item.value) !== null && _a !== void 0 ? _a : null;
                }
                catch (_b) {
                    states[trimmedKey] = null;
                }
            }
        }
        return states;
    }
    ;
    static getLastUpdated(prefix) {
        let lastKey = null;
        let lastTimestamp = 0;
        let lastValue = null;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`${prefix}#`)) {
                try {
                    const itemStr = localStorage.getItem(key);
                    if (!itemStr)
                        continue;
                    const item = JSON.parse(itemStr);
                    if (item.updatedAt && item.updatedAt > lastTimestamp) {
                        lastTimestamp = item.updatedAt;
                        lastKey = key.substring(`${prefix}#`.length);
                        lastValue = item.value;
                    }
                }
                catch (_a) {
                    continue;
                }
            }
        }
        if (lastKey === null)
            return null;
        return { id: lastKey, value: lastValue, updatedAt: lastTimestamp };
    }
    ;
    static clearPrefix(prefix) {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`${prefix}`)) {
                keysToRemove.push(key);
            }
        }
        for (const key of keysToRemove) {
            localStorage.removeItem(key);
        }
    }
}
