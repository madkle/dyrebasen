export let colourArr = [
    {colour:"Hvit", rgb:{red: 255, green: 255, blue: 255}},
    {colour:"Viltgul", rgb:{red: 169, green: 116, blue: 84}},
    {colour:"Brun", rgb:{red: 165, green: 42, blue: 42}},
    {colour:"Madagaskar",rgb:{red: 182, green: 143, blue: 115}},
];

export function lookupColour(inpColour) {
    //inpColour = storForbokstav(inpColour);

    let foundColour = null;
    colourArr.forEach(element => {
        if (element.colour === inpColour) {
            foundColour = element;
        }
    });

    return foundColour;
}