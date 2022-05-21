import {lookupColour} from "./colour.js";
import {getUserInfo} from "./user.js";
    
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
            if (response.status === 404) {
                return blankFamily;
            }else if (response.status != 200) {
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
function removeNull(object) {
    for (const key in object) {
        if (object[key] === null) {
            object[key] = "N/A"
        }
    }
    return object
}
async function getParents(child) {
   
    let findParents = [await getSingleAnimal(child.far), await getSingleAnimal(child.mor)];
    
    let family = {
        parents: findParents,
        
        fathersParents: [await getSingleAnimal(findParents[0].far), await getSingleAnimal(findParents[0].mor)],
        mothersParents:[await getSingleAnimal(findParents[1].far),await getSingleAnimal(findParents[1].mor)]
    }
    for (const key in family) {
        family[key].forEach(element => {
            removeNull(element);
        });
    }
    return family;
};
export async function generatePDF(clickedAnimal){
    let doc = new jsPDF();
    
    let mainAnimal = await getSingleAnimal(clickedAnimal); 
    
    let user = await getUserInfo(mainAnimal.bidfk);
    let family = await getParents(mainAnimal);
    mainAnimal = removeNull(mainAnimal);
    const styling = {margin_x:10, margin_y:5};
    
    const generations = 3;
    const A4 = {"width": 210, "height": 297};// in mm
    const cellHeight = (A4.height - styling.margin_y*2 - 50)/generations;
    const PADDING = 5;
    const contentWidth = A4.width - styling.margin_x * 2;
    
    const lineSpacing = 10;
    

    function rowOne(x,y,r) {
        let startTextLine = 2;
        let headAlignRight = r - 40;
        let bodyAlignRight = r - 15;
        let cellPadding = 7;
        const imgWidth = 50;
        const imgHeight = 50;

        let fdate = mainAnimal.fdato ;
        let fdateFormated = "N/A";
        function makeDate(date) {
            let d = ""
            if (date === undefined) {
                d = new Date()
            }else{
                d = new Date(date)
            }
            
            return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
        }
        if (fdate !== "N/A") {
            fdateFormated = makeDate(fdate)
        }

        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("Dyrebasen", x + 20, y + cellPadding);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);

        doc.text(`Reg. Dato: ${makeDate()}`, headAlignRight, y + cellPadding);

        doc.line(x + PADDING, y + cellPadding + 2, r, y + cellPadding + 2);
        
        if (mainAnimal.bilde !== "N/A") {
            let imgFormat = mainAnimal.bilde.slice(11).split(";")[0];
            doc.addImage(mainAnimal.bilde,imgFormat, (A4.width/2)-(imgWidth/2) , y + cellPadding*startTextLine,imgWidth,imgHeight)
        }

        let contentLeftText = [`Reg Nr: ${mainAnimal.regnr}`,`V.Ø: ${mainAnimal.vø}`,`Oppdretter: ${user.fornavn } ${user.etternavn}`,`Fødselsdato: ${fdateFormated}`]
        for (let i = 0; i < contentLeftText.length; i++){
            doc.text(`${contentLeftText[i]} `, x + PADDING, y + lineSpacing*(i+startTextLine));
        }

        let contentRightText = [`Kjønn: ${mainAnimal.kjønn}`, `Poeng: ${mainAnimal.poeng}/100`,`Innavlsgrad: ${mainAnimal.innavlsgrad}%`, `Farge:`]
        for (let i = 0; i < contentRightText.length; i++){
            doc.text(`${contentRightText[i]}`,  headAlignRight, y + lineSpacing*(i+startTextLine));

        }
        startTextLine = contentRightText.length + 1;
        if (mainAnimal.farge !== "N/A") {
            let colourInformation = lookupColour(mainAnimal.farge)
            if (colourInformation !== null) {
                let rectW = 15;
                let rectH = 10;
                let rectX = bodyAlignRight;
                let rectY =  y + PADDING/2 + lineSpacing * startTextLine;
                
                doc.setFillColor(colourInformation.rgb.red, colourInformation.rgb.green, colourInformation.rgb.blue)
                doc.roundedRect(rectX, rectY, rectW, rectH, 1,1, "FD");
            }
            
            doc.setFont("helvetica", "bold");
            doc.text(mainAnimal.farge, bodyAlignRight, y + lineSpacing * startTextLine);
            doc.setFont("helvetica", "normal");
        }        
    }

    async function rowTwo(x,y,r,it) {
        
        let currentAnimal = family.parents[it%2]
        let user = null;
        if (currentAnimal.bidfk !== "N/A") {
            user = await getUserInfo(currentAnimal.bidfk);
        }
        let navn = currentAnimal.bidfk;
        if (user) {
            navn = `${user.fornavn} ${user.etternavn}`;
        }

        let startTextLine = 1;
        let headAlignRight = r - 40;
        let bodyAlignRight = r - 15;

        
        let parentArr = ["Far","Mor"];
        let parentText = "";
        parentText = parentArr[it%2]
        doc.setFont("helvetica", "bold");
        doc.text(parentText, x + PADDING, y + lineSpacing*startTextLine)
        doc.setFont("helvetica", "normal");
        
        startTextLine++

        let contentLeftText = [`Reg Nr: ${currentAnimal.regnr}`,`V.Ø: ${currentAnimal.vø}`,`Oppdretter:`,`${navn}`];
        
        for (let i = 0; i < contentLeftText.length; i++){
            doc.text(`${contentLeftText[i]} `, x + PADDING, y + lineSpacing*(i+startTextLine));
        }
        let contentRightText = [`Poeng: ${currentAnimal.poeng}/100`,`Innavlsgrad: ${currentAnimal.innavlsgrad}%`, `Farge:`]
        for (let i = 0; i < contentRightText.length; i++){
            doc.text(`${contentRightText[i]}`,  headAlignRight, y + lineSpacing*(i+startTextLine));

        }

        startTextLine = contentRightText.length + 1;

        if (currentAnimal.farge !== "N/A") {
            let colourInformation = lookupColour(currentAnimal.farge)
            if (colourInformation !== null) {
                let rectW = 15;
                let rectH = 10;
                let rectX = bodyAlignRight;
                let rectY =  y + PADDING/2 + lineSpacing * startTextLine;
                
                doc.setFillColor(colourInformation.rgb.red, colourInformation.rgb.green, colourInformation.rgb.blue)
                doc.roundedRect(rectX, rectY, rectW, rectH,1,1, "FD");
            }
            doc.setFont("helvetica", "bold");
            doc.text(currentAnimal.farge, bodyAlignRight, y + lineSpacing * startTextLine);
            doc.setFont("helvetica", "normal");
        }
    }

    async function rowThree(x,y,it) {
        let currentAnimal = null;
        let antCol = 4
        let parentArr = ["Far","Mor"];
        let parentText = "";
        let user = null;
        

        if (it < antCol/2) {
            currentAnimal = family.fathersParents[it%2];
            parentText = `F ${parentArr[it%2]}`
        }else{
            currentAnimal = family.mothersParents[it%2]
            parentText = `M ${parentArr[it%2]}`
        }

        if (currentAnimal.bidfk !== "N/A") {
            user = await getUserInfo(currentAnimal.bidfk);
        }
        let navn = currentAnimal.bidfk;
        if (user) {
            navn = `${user.fornavn} ${user.etternavn}`;
        }
        

        let startTextLine = 2;

        doc.setFont("helvetica", "bold");
        doc.text(parentText, x + PADDING, y + lineSpacing*startTextLine);
        doc.setFont("helvetica", "normal");
        startTextLine++

        let contentLeftText = [`Reg Nr: ${currentAnimal.regnr}`,`V.Ø: ${currentAnimal.vø}`,`Oppdretter:`,`${navn}`];
        
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
                await rowOne(CellLeft, CellTop, CellRight)
                break;
        
            case 1:
                await rowTwo(CellLeft, CellTop, CellRight, iteration)
                break;

            case 2:
                await rowThree(CellLeft, CellTop, iteration)
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


    doc.save(`stamtavle-${mainAnimal.regnr}.pdf`);
}