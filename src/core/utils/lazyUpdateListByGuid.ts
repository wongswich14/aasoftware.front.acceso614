import { Api } from "@reduxjs/toolkit/query";
import { AppDispatch } from "../store";

enum LazyUpdateModes {
    UPDATE,
    DELETE,
    ADD
}

interface CacheUpdaterParams<T> {
    api: any,   // la api especifica del endpoint
    endpoint: string
    mode: LazyUpdateModes,
    dispatch: AppDispatch,
    newItem?: Partial<T>,
    id?: string
}

const lazyUpdateList
 = <T extends { id: string }>(
    items: T[], 
    mode: LazyUpdateModes,
    newItem?: Partial<T>,
    id?: string, 
): T[] => {
    switch (mode) {
        case LazyUpdateModes.UPDATE:
            return items.map(item =>
                item.id === id ? { ...item, ...newItem } : item
            );

        case LazyUpdateModes.DELETE:
            return items.filter(item => item.id !== id);

        case LazyUpdateModes.ADD:
            return newItem ? [...items, newItem as T] : items;

        default:
            return items;
    }
};


const updateCache = <T extends { id: string }>({
    api,
    endpoint,
    mode,
    dispatch,
    newItem,
    id
}: CacheUpdaterParams<T>) => {
    dispatch(api.util.updateQueryData(endpoint, undefined, (cache: { listDataObject: T[]; })=> {
        cache.listDataObject = lazyUpdateList(cache.listDataObject || [], mode, newItem, id)
    }))
}

export {
    LazyUpdateModes,
    updateCache
}