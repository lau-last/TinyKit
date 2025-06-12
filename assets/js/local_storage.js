export default class LocalStorageManager {

    static setState(prefix, elementId, state) {
        const data = {
            value: state,
            updatedAt: Date.now()
        };
        localStorage.setItem(`${prefix}#${elementId}`, JSON.stringify(data));
    }

    static getState(prefix, elementId) {
        const item = localStorage.getItem(`${prefix}#${elementId}`);
        if (!item) return null;

        try {
            const parsed = JSON.parse(item);
            return parsed.value ?? null;
        } catch {
            return null;
        }
    }

    static getStates(prefix) {
        const states = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(`${prefix}#`)) {
                const trimmedKey = key.substring(`${prefix}#`.length);
                try {
                    const item = JSON.parse(localStorage.getItem(key));
                    states[trimmedKey] = item.value ?? null;
                } catch {
                    states[trimmedKey] = null;
                }
            }
        }
        return states;
    }

    static getLastUpdated(prefix) {
        let lastKey = null;
        let lastTimestamp = 0;
        let lastValue = null;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(`${prefix}#`)) {
                try {
                    const item = JSON.parse(localStorage.getItem(key));
                    if (item.updatedAt && item.updatedAt > lastTimestamp) {
                        lastTimestamp = item.updatedAt;
                        lastKey = key.substring(`${prefix}#`.length);
                        lastValue = item.value;
                    }
                } catch (e) {
                    console.log(e);
                    continue;
                }
            }
        }

        return lastKey ? {id: lastKey, value: lastValue, updatedAt: lastTimestamp} : null;
    }
}