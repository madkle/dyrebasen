function lookupColour(inpColour) {
    inpColour = inpColour.toLowerCase();

    let colourArr = [
        {colour:"hvit", rgb:{red: 255, green: 255, blue: 255}},
        {colour:"viltgul", rgb:{red: 169, green: 116, blue: 84}},
        {colour:"brun", rgb:{red: 165, green: 42, blue: 42}},
        {colour:"madagaskar",rgb:{red: 182, green: 143, blue: 115}},
    ];

    let foundColour = null;

    colourArr.forEach(element => {
        if (element.colour === inpColour) {
            foundColour = element;
        }
    });

    return foundColour;
}
async function getSingleAnimal(id) {

    let url = `/dyr/${id}`;

    let blankFamily = {
        aidfk: null,
        bidfk: null,
        did: null,
        far: null,
        farge: null,
        fdato: null,
        innavlsgrad: null,
        kjønn: null,
        kullnr: null,
        mor: null,
        poeng: null,
        regnr: null,
        vø: null,
        bilde: null
    }

    try {
        if (id !== null) {
            let response = await fetch(url);
            let data = await response.json();
            if (response.status != 200) {
                throw data.error;
            }
            
            return data[0];
        }
        return blankFamily;
    }
    catch(error) {
        console.log(error);
    }
};

async function getParents(child) {
        
    let findParents = [await getSingleAnimal(child.far), await getSingleAnimal(child.mor)];
    let family = {
        parents: findParents,
        fathersParents: [await getSingleAnimal(findParents[0].far), await getSingleAnimal(findParents[0].mor)],
        mothersParents:[await getSingleAnimal(findParents[1].far),await getSingleAnimal(findParents[1].mor)]
    }
    
    return family;
};

async function generatePDF(clickedAnimal){
    let doc = new jsPDF();

    const mainAnimal = await getSingleAnimal(clickedAnimal); 
    let family = await getParents(mainAnimal);
    
    const styling = {margin_x:10, margin_y:5};
    
    const generations = 3;
    const A4 = {"width": 210, "height": 297};// in mm
    const cellHeight = (A4.height - styling.margin_y*2 - 50)/generations;
    const PADDING = 5;
    const contentWidth = A4.width - styling.margin_x * 2;
    
    const lineSpacing = 10;
    

    function rowOne(x,y,r,h,it,row) {
        let startTextLine = 2;
        let headAlignRight = r - 40;
        let bodyAlignRight = r - 15;
        let cellPadding = 7;
        const imgWidth = 50;
        const imgHeight = 50;

        let fdate = mainAnimal.fdato ;
        let fdateFormated = null;
        
        if (fdate !== null) {
            //console.log(fdato);
            let d = new Date(fdate)
            fdateFormated = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
        }

        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("Dyrebasen", x + 20, y + cellPadding);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);

        doc.text("Reg. Dato* Reg av*", headAlignRight, y + cellPadding);

        doc.line(x + PADDING, y + cellPadding + 2, r, y + cellPadding + 2);

        if (mainAnimal.bilde !== null) {
            let imgFormat = mainAnimal.bilde.slice(11).split(";")[0];
            doc.addImage(mainAnimal.bilde,imgFormat, (A4.width/2)-(imgWidth/2) , y + cellPadding,imgWidth,imgHeight)
        }

        let contentLeftText = [`Reg Nr: ${mainAnimal.regnr}`,`V.Ø: ${mainAnimal.vø}`,`Oppdretter: ${mainAnimal.aidfk}`,`Fødselsdato: ${fdateFormated}`]
        for (let i = 0; i < contentLeftText.length; i++){
            doc.text(`${contentLeftText[i]} `, x + PADDING, y + lineSpacing*(i+startTextLine));
        }

        contentRightText = [`Kjønn: ${mainAnimal.kjønn}`, `Poeng: ${mainAnimal.poeng}/100`,`Innavlsgrad: ${mainAnimal.innavlsgrad}%`, `Farge:`]
        for (let i = 0; i < contentRightText.length; i++){
            doc.text(`${contentRightText[i]}`,  headAlignRight, y + lineSpacing*(i+startTextLine));

        }
        startTextLine = contentRightText.length + 1;
        if (mainAnimal.farge !== null) {
            let colourInformation = lookupColour(mainAnimal.farge)
            let rectW = 15;
            let rectH = 10;
            let rectX = bodyAlignRight;
            let rectY =  y + PADDING/2 + lineSpacing * startTextLine;
            
            doc.setFillColor(colourInformation.rgb.red, colourInformation.rgb.green, colourInformation.rgb.blue)
            doc.rect(rectX, rectY, rectW, rectH, "FD");
            doc.setFont("helvetica", "bold");
            doc.text(colourInformation.colour, bodyAlignRight, y + lineSpacing * startTextLine);
            doc.setFont("helvetica", "normal");
        }        
    }

    async function rowTwo(x,y,r,h,it,row) {
        
        let currentAnimal = family.parents[it%2]


        let startTextLine = 1;
        let headAlignRight = r - 40;
        let bodyAlignRight = r - 15;

        
        let parentArr = ["Far","Mor"];
        let parentText = "";
        parentText = parentArr[it%2]
        
        doc.text(parentText, x + PADDING, y + lineSpacing*startTextLine)
        startTextLine++

        let contentLeftText = [`Reg Nr: ${currentAnimal.regnr}`,`V.Ø: ${currentAnimal.vø}`,`Oppdretter: ${currentAnimal.aidfk}`];
        
        for (let i = 0; i < contentLeftText.length; i++){
            doc.text(`${contentLeftText[i]} `, x + PADDING, y + lineSpacing*(i+startTextLine));
        }
        contentRightText = [`Poeng: ${currentAnimal.poeng}/100`,`Innavlsgrad: ${currentAnimal.innavlsgrad}%`, `Farge:`]
        for (let i = 0; i < contentRightText.length; i++){
            doc.text(`${contentRightText[i]}`,  headAlignRight, y + lineSpacing*(i+startTextLine));

        }
        startTextLine = contentRightText.length + 1;

        
        if (currentAnimal.farge !== null) {
            let colourInformation = lookupColour(currentAnimal.farge)
            let rectW = 15;
            let rectH = 10;
            let rectX = bodyAlignRight;
            let rectY =  y + PADDING/2 + lineSpacing * startTextLine;
            
            doc.setFillColor(colourInformation.rgb.red, colourInformation.rgb.green, colourInformation.rgb.blue)
            doc.rect(rectX, rectY, rectW, rectH, "FD");
            doc.setFont("helvetica", "bold");
            doc.text(colourInformation.colour, bodyAlignRight, y + lineSpacing * startTextLine);
            doc.setFont("helvetica", "normal");
        }
    }

    async function rowThree(x,y,r,h,it,row) {
        let currentAnimal = null;
        let antCol = 4
        let parentArr = ["Far","Mor"];
        let parentText = "";
        

        if (it < antCol/2) {
            currentAnimal = family.fathersParents[it%2];
            parentText = `F ${parentArr[it%2]}`
        }else{
            currentAnimal = family.mothersParents[it%2]
            parentText = `M ${parentArr[it%2]}`
        }

        

        let startTextLine = 2;
        let headAlignRight = r - 40;

        doc.text(parentText, x + PADDING, y + lineSpacing*startTextLine)
        startTextLine++

        let contentLeftText = [`Reg Nr: ${currentAnimal.regnr}`,`V.Ø: ${currentAnimal.vø}`,`Oppdretter: ${currentAnimal.aidfk}`];
        
        for (let i = 0; i < contentLeftText.length; i++){
            doc.text(`${contentLeftText[i]} `, x + PADDING, y + lineSpacing*(i+startTextLine));
        }
    }

    async function createCell(numberOfCols, iteration, rowNumber){
        const cellWidth = contentWidth/numberOfCols;
        let CellLeft = styling.margin_x + cellWidth*iteration; //x
        let CellTop = styling.margin_y + cellHeight*rowNumber; //y
        let CellRight = cellWidth + cellWidth*iteration;
        doc.rect(CellLeft, CellTop, cellWidth, cellHeight);
        
        switch (rowNumber) {
            case 0:
                await rowOne(CellLeft, CellTop, CellRight, cellHeight, iteration, rowNumber)
                break;
        
            case 1:
                await rowTwo(CellLeft, CellTop, CellRight, cellHeight, iteration, rowNumber)
                break;

            case 2:
                await rowThree(CellLeft, CellTop, CellRight, cellHeight, iteration, rowNumber)
                break;
        }
    
    }

    let nmbCol = 1;
    let row = 0;
    let multiplyer = 2;
    for (let i = 0; i < generations; i++){
        let count = 0;
        while (count < nmbCol) {                    
            await createCell(nmbCol,count,row);
            count++;
        }
        nmbCol = nmbCol * multiplyer;
        row++;
    }


    doc.save("output.pdf");
}