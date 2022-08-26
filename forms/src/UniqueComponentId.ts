var lastId = 0;

export function UniqueComponentId(prefix = 'tuval_id_') {
    lastId++;
    return `${prefix}${lastId}`;
}