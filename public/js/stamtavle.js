/*
const { all, set } = require("express/lib/application");
const { get } = require("express/lib/response");
*/
let fam = {};

async function getAllAnimals() {
    let url = "/dyr";
        try {
            let response = await fetch(url);
            let data = await response.json();

            if (response.status != 200) {
                throw data.error;
            }

            return data                
        }
        catch(error) {
            console.log(error);
        }
}

async function listAnimals() {
    let data = await getAllAnimals();

    container.innerHTML = "<h3 class='text-center'>Velg dyr:</h3><hr class='m-1'>";

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
            <p class="item2" style="padding-top: 5px;">Reg.nr: ${value.regnr} </p>`


            
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

async function animation(ID) {
    await resetStamtavle()

    let allAnimals = document.querySelectorAll(".item");
    let stamLinjer = document.querySelectorAll(".itemLine");
    

    if (!allAnimals[0].classList.contains("stamtavleStart")) {
                    
        allAnimals[0].classList.add("stamtavleStart");
        allAnimals[1].classList.add("stamtavleStart");
        allAnimals[2].classList.add("stamtavleStart");
        allAnimals[3].classList.add("stamtavleStart");
        allAnimals[4].classList.add("stamtavleStart");
        allAnimals[5].classList.add("stamtavleStart");
        allAnimals[6].classList.add("stamtavleStart");
            
    };

    if (!stamLinjer[0].classList.contains("lineStart")) {
        stamLinjer[0].classList.add("lineStart");
        stamLinjer[1].classList.add("lineStart");
        stamLinjer[2].classList.add("lineStart");
        stamLinjer[3].classList.add("lineStart");
        stamLinjer[4].classList.add("lineStart");
        stamLinjer[5].classList.add("lineStart");
        stamLinjer[6].classList.add("lineStart");
        stamLinjer[7].classList.add("lineStart");
        stamLinjer[8].classList.add("lineStart");
        stamLinjer[9].classList.add("lineStart");
        stamLinjer[10].classList.add("lineStart");
        stamLinjer[11].classList.add("lineStart");
        stamLinjer[12].classList.add("lineStart");
        stamLinjer[13].classList.add("lineStart");
    }
    

    setTimeout (function() {
        allAnimals[0].classList.remove("stamtavleStart");
    }, 1000)
    

    setTimeout(function(){
        allAnimals[1].classList.remove("stamtavleStart");
        allAnimals[2].classList.remove("stamtavleStart");
    }, 1300);

    setTimeout(function(){
        allAnimals[3].classList.remove("stamtavleStart");
        allAnimals[4].classList.remove("stamtavleStart");
        allAnimals[5].classList.remove("stamtavleStart");
        allAnimals[6].classList.remove("stamtavleStart");
    }, 1850);
    
    setTimeout (function() {
        fam = {};
        chooseAnimal(ID);
    }, 900);

    setTimeout (function() {
        stamLinjer[0].classList.remove("lineStart");
        stamLinjer[1].classList.remove("lineStart");
        stamLinjer[2].classList.remove("lineStart");
        stamLinjer[3].classList.remove("lineStart");
        stamLinjer[4].classList.remove("lineStart");
        stamLinjer[5].classList.remove("lineStart");
        stamLinjer[6].classList.remove("lineStart");
        stamLinjer[7].classList.remove("lineStart");
        stamLinjer[8].classList.remove("lineStart");
        stamLinjer[9].classList.remove("lineStart");
        stamLinjer[10].classList.remove("lineStart");
        stamLinjer[11].classList.remove("lineStart");
        stamLinjer[12].classList.remove("lineStart");
        stamLinjer[13].classList.remove("lineStart");
    }, 2700)
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
    let familyArr = ["Far","Mor","FarFar","FarMor","MorFar","MorMor"]
    for (let i = 0; i < 7; i++) {
        let div = document.createElement("div");
        div.classList.add("item");
        div.classList.add("shadow");
        div.classList.add("rounded");
        
        let valgDyrXTxt = "valgDyrFamilie"
        if (i === 0) {
            valgDyrXTxt = "valgtDyr"
        }
        div.classList.add(valgDyrXTxt);
        let valgtXTxt = "valgt"
        let genderTxt = "male";
        let genderGenerationTxt = ""
        if (i !== 0) {
            valgtXTxt+=familyArr[i-1];
            div.classList.add(valgtXTxt);

            let lastThreeCharacters = valgtXTxt.substring(valgtXTxt.length-3);
            if(lastThreeCharacters === "Mor"){
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

function resetStamtavle() {
    const items =  document.querySelectorAll(".item");
    const stamtavle =  document.getElementById("stamtavle");
    items.forEach(item =>{
        item.remove()
    })
    let itemArr = generateBoxes();
    itemArr.forEach(item =>{
        stamtavle.appendChild(item)
    });
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
        let dateFormatert = null;
        
        if (fdato !== null) {
            let d = new Date(fdato)
            dateFormatert = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
        }
        /* let morID = "";
        let farID = "";
        
        for (const parent of data) {
            if(value.mor !== null && value.mor === parent.did){
                morID = parent.regnr;
            }
            if(value.far !== null && value.far === parent.did){
                farID = parent.regnr;
            }
        } */
            
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
            <p class="item2hover bold">ID: ${value.did} </p>
            <p class="item3">Reg.nr: ${value.regnr}</p>
            <p class="item4">V.Ø.: ${value.vø}</p>
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
            if (evt.currentTarget === valgtDyr) {
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
            
            far.innerHTML = "Far";
            mor.innerHTML = "Mor";
            farfar.innerHTML = "Farfar";
            farmor.innerHTML = "Farmor";
            morfar.innerHTML = "Morfar";
            mormor.innerHTML = "Mormor";
            animation(value.did);
            //animation(dyreID);
            console.log(item);

        });
        
        /* let valgtFam = document.querySelectorAll(".valgtDyrFamilie");
        for (const currFam of valgtFam) {
            let dyreID = value.did;
            currFam.addEventListener('click', function(evt) {

            //animation(dyreID);
            console.log(currFam);

        });
        } */
        
        return
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
