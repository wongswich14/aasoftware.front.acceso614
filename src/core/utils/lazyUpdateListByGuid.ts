enum LazyUpdateModes {
    UPDATE,
    DELETE,
    ADD
}

const lazyUpdateList
 = <T extends { id: string }>(
    items: T[], 
    mode: LazyUpdateModes,
    id?: string, 
    newItem?: Partial<T>,
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

export {
    LazyUpdateModes,
    lazyUpdateList

};
