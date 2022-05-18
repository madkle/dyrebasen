
export function storForbokstav(ord) {
    let forbokstav = ord.substring(0,1).toUpperCase()
    let restOrd =  ord.substring(1)
    ord = forbokstav + restOrd;
    return ord;
}
