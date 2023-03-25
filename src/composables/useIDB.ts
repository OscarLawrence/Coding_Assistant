import { openDB } from "idb";

export default (dbName: string = "keyval-store") => {
  const dbPromise = openDB(dbName, 1, {
    upgrade(db) {
      db.createObjectStore("keyval");
    },
  });

  const get = async (key: string) => {
    return (await dbPromise).get("keyval", key);
  };

  const set = async (key: string, val: any) => {
    return (await dbPromise).put("keyval", JSON.stringify(val), key);
  };

  const del = async (key: string) => {
    return (await dbPromise).delete("keyval", key);
  };

  const clear = async () => {
    return (await dbPromise).clear("keyval");
  };

  const keys = async () => {
    return (await dbPromise).getAllKeys("keyval");
  };

  return {
    get,
    set,
    del,
    clear,
    keys,
  };
};
