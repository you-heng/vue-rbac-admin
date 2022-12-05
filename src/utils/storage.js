import { setting } from "@/utils";

export const get_storage = () => {
    const storage = localStorage.getItem(setting.storage);
    return storage ? JSON.parse(storage) : {};
};

export const get_item = (key) => {
    const storage = get_storage();
    return storage[key];
};

export const set_item = (key, value) => {
    const storage = get_storage();
    storage[key] = value;
    localStorage.setItem(setting.storage, JSON.stringify(storage));
};

export const remove_item = (key) => {
    const storage = get_storage();
    delete storage[key];
    localStorage.setItem(setting.storage, JSON.stringify(storage));
};

export const clear_storage = () => {
    localStorage.removeItem(setting.storage);
};
