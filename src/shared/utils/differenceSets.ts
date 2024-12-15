export function differenceSets<T>(setA: Array<T>, setB: Array<T>): Array<T> {
    let difference = new Set(setA)
    for (let elem of new Set(setB)) {
        difference.delete(elem)
    }
    return Array.from(difference)
}