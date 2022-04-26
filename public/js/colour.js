let colourArr = [
    {colour:"hvit", rgb:{red: 255, green: 255, blue: 255}},
    {colour:"viltgul", rgb:{red: 169, green: 116, blue: 84}},
    {colour:"brun", rgb:{red: 165, green: 42, blue: 42}},
    {colour:"madagaskar",rgb:{red: 182, green: 143, blue: 115}},
];

function lookupColour(inpColour) {
    inpColour = inpColour.toLowerCase();

    let foundColour = null;

    colourArr.forEach(element => {
        if (element.colour === inpColour) {
            foundColour = element;
        }
    });

    return foundColour;
}