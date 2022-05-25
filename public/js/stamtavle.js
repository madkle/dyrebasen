import {getAllAnimals} from "./dyr.js"
import {generatePDF} from "./pdf.js"
let fam = {};
let animationInOut = false; 

export async function drawSidebar() {
    let data = await getAllAnimals();

    container.innerHTML = "<h3 class='text-center'>Velg reg.nr:</h3><hr class='m-1'>";

    for (let value of data) {
        let testBilde = "bilder/kanin_standardbilde.jpeg";
        if (value.bilde === null) {
            value.bilde = testBilde
        }
        
        let fdato = value.fdato ;
        let dateFormatert = null;
        
        if (fdato !== null) {
            let d = new Date(fdato)
            dateFormatert = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
        }
        let morID = null;
        let farID = null;
        if (value.mor !== null) {
            for (const parent of data) {
                if(value.mor === parent.did);{
                    morID = parent.regnr;
                }
            }
        }

        if (value.far !== null) {
            for (const parent of data) {
                if(value.far === parent.did);{
                    farID = parent.regnr;
                }
            }
        }

        let html1 = 
            `<img class="item1" src="${value.bilde}" alt="bilde av kanin"/>
            <p class="item2" style="padding-top: 5px;">${value.regnr}</p>`


            
        let div = document.createElement("div");
        div.innerHTML = html1;
        container.appendChild(div);
        div.classList.add("mineDyr"); 
        
        let valgtDID = value.did;
        div.addEventListener('click',  function(evt) {
            animation(valgtDID);
        });
    }
}

function animation(ID) {
    let allAnimals = document.querySelectorAll(".item");
    let stamLinjer = document.querySelectorAll(".itemLine");
   
    let timer = 0;
    
    
    if (!allAnimals[0].classList.contains("stamtavleStart")) {
        for (let i = 0; i <= 6; i++) {
            allAnimals[i].classList.add("stamtavleStart");
        }
        
        timer = 1000;
        animationInOut = true;
        setTimeout(function() {
            allAnimals.forEach(item =>{
                item.remove();
            });
            
        },timer);
    }

    if (!stamLinjer[0].classList.contains("lineStart")) {
        for (let i = 0; i <= 13; i++) {
            stamLinjer[i].classList.add("lineStart");
        }
    }

    if (animationInOut) {
        setTimeout(function() {
            let itemArr = generateBoxes();
            const stamtavle =  document.getElementById("stamtavle");

            itemArr.forEach(item =>{
                stamtavle.appendChild(item)
            });
        },timer)
    }
    
    setTimeout (function() {
        fam = {};
        chooseAnimal(ID);
        showBoxAnimation(timer)
    }, timer);
    
}
function showBoxAnimation(timer) {
    let allAnimals = document.querySelectorAll(".item");
    let stamLinjer = document.querySelectorAll(".itemLine");

    setTimeout (function() {
        allAnimals[0].classList.remove("stamtavleStart");
    }, timer)
        
    setTimeout(function(){
        for (let i = 1; i <= 2; i++) {
            allAnimals[i].classList.remove("stamtavleStart");
        }
    }, timer + 300);

    setTimeout(function(){
        for (let i = 3; i <= 6; i++) {
            allAnimals[i].classList.remove("stamtavleStart");
        }
    }, timer + 600);

    setTimeout (function() {
        for (let i = 0; i <= 13; i++) {
            stamLinjer[i].classList.remove("lineStart");
        }
    }, timer + 1300)
}
async function chooseAnimal(incomingID) {
    let data = await getAllAnimals();
    fam = genFam(incomingID,data);
    let boxIndex = 0;
    for (const key in fam) {
        let animal = fam[key];
        
        if (key === "child") {
            drawAnmial(animal,boxIndex);
            boxIndex++
            continue;
        }
        for (const value of animal) {
            drawAnmial(value,boxIndex);
            boxIndex++
        }
        
    }
    
}

function generateBoxes() {

    let divListArr = []
    let familyArr = ["Far","Mor","Farfar","Farmor","Morfar","Mormor"]
    for (let i = 0; i < 7; i++) {
        let div = document.createElement("div");
        div.classList.add("item");
        div.classList.add("shadow");
        div.classList.add("rounded");
        
        let valgtDyrXTxt = "valgtDyrFamilie"
        if (i === 0) {
            valgtDyrXTxt = "valgtDyr"
        }
        div.classList.add(valgtDyrXTxt);
        let valgtXTxt = "valgt"
        let genderTxt = "male";
        let genderGenerationTxt = ""
        if (i !== 0) {
            valgtXTxt+=familyArr[i-1];
            div.classList.add(valgtXTxt);

            let lastThreeCharacters = valgtXTxt.substring(valgtXTxt.length-3).toLocaleLowerCase();
            if(lastThreeCharacters === "mor"){
                genderTxt = "female"
            }
            div.classList.add(genderTxt);

            if (valgtXTxt.length === 8) {
                genderGenerationTxt = genderTxt + "1"
            }else{
                genderGenerationTxt = genderTxt + "2"
            }
            div.classList.add(genderGenerationTxt);
            div.id = familyArr[i-1].toLowerCase();
            div.innerHTML = familyArr[i-1]
        }else{
            div.id = "valgtDyr"
        }
        div.classList.add("stamtavleStart");
        divListArr.push(div);
    }
    return divListArr
}

function drawAnmial(value,box) {
    
    let html = "";
    let html2 = "";
    const item = document.querySelectorAll(".item")[box];

    if (value !== undefined) {
        let testBilde = "bilder/kanin_standardbilde.jpeg";
        if (value.bilde === null) {
            value.bilde = testBilde
        }
        
        let fdato = value.fdato ;
        let dateFormatert = "";
        
        if (fdato !== null) {
            let d = new Date(fdato)
            dateFormatert = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
        }
        for (const item in value) {
            if (value[item] === null) {
                value[item] = "";
            }
        }
        html = `
            <img class="stamtavlebilde" src="${value.bilde}" width="100px" alt="bilde av kanin"/>
            <p class="item2 text-center">ID: ${value.did} </p>
            <p class="item3" style="font-weight: bold;">Reg.nr: ${value.regnr}</p>
            <p class="item4">V.Ø.: ${value.vø}</p>
            <p class="item5">Født: ${dateFormatert} </p>
            <p class="item6">Kull.nr: ${value.kullnr} </p>
            <p class="item7">Kjønn: ${value.kjønn} </p>
            <p class="item8">Innavlsgrad: ${value.innavlsgrad}</p>
            <p class="item9">Poeng: ${value.poeng} </p>
            <p class="item10">Farge: ${value.farge}</p>
        `

        html2 = `
            <img class="stamtavlebilde" src="${value.bilde}" width="100px" alt="bilde av kanin"/>
            <p class="item3 bold">Reg.nr: ${value.regnr}</p>
            <p class="item4">V.Ø.: ${value.vø}</p>
            <p class="item2hover">ID: ${value.did} </p>
        `

        let genStam = document.createElement("button");
        genStam.classList.add("genstam");
        genStam.classList.add("btn");
        genStam.classList.add("btn-sm");
        genStam.classList.add("btn-secondary")
        genStam.innerText ="Generer stamtavle";
        genStam.addEventListener('click', function(){
            generatePDF(value.did);
        })

        
        item.innerHTML = html2;
        
        item.addEventListener("mouseenter", mouseOver);
        item.addEventListener("mouseleave", mouseOut);

        function mouseOver(evt) {
            evt.preventDefault();
            item.innerHTML = " ";
            if (evt.currentTarget.id === "valgtDyr") {
                item.innerHTML = html
                item.appendChild(genStam);
            } else {
                item.innerHTML = html;
            }
        }
    
        function mouseOut(evt) {
            item.innerHTML = " ";
            item.innerHTML = html2;
        }

        item.addEventListener('click', function(evt) {
            if (evt.currentTarget.id !== "valgtDyr") {
                far.innerHTML = "Far";
                mor.innerHTML = "Mor";
                farfar.innerHTML = "Farfar";
                farmor.innerHTML = "Farmor";
                morfar.innerHTML = "Morfar";
                mormor.innerHTML = "Mormor";
                animation(value.did);
            }
        });
    }
    //item.innerHTML = html;
}

function genFam(chosenId,animalList) {
    let currentAnimal = {};
    let parentsArr = [];
    let grandParentsArr = [];
    animalList.forEach(element => {
        if (element.did === chosenId) {
            currentAnimal = element
        }
    });
    animalList.forEach(allAnimal => {
        if (currentAnimal.far === allAnimal.did || currentAnimal.mor === allAnimal.did) {
            parentsArr.push(allAnimal)
        }
    });
    parentsArr.forEach(parent => {
        animalList.forEach(allAnimals => {
            if (parent.far === allAnimals.did || parent.mor === allAnimals.did) {
                grandParentsArr.push(allAnimals)
            }
        });
    });
    let family = {
        child: currentAnimal,
        parents: parentsArr,
        fathersParents: [grandParentsArr[0],grandParentsArr[1]],
        mothersParents: [grandParentsArr[2],grandParentsArr[3]]
    }
    return family
}
