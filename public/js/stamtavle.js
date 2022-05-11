/*
const { all, set } = require("express/lib/application");
const { get } = require("express/lib/response");
*/
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
    let valgtFarFar = document.getElementById('valgtFarFar');
    let allAnimals = document.querySelectorAll(".item");
    let stamLinjer = document.querySelectorAll(".itemLine");

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

        div.draggable = true;
        
        let valgtDID = value.did;
        div.addEventListener('click',  function(evt) {
            //valgtFarFar.classList.remove("valgtFarFarStart");
            //console.log(allAnimals);

            //let allAnimals = document.querySelectorAll(".item");
            if (!allAnimals[0].classList.contains("stamtavleStart")) {
                    /* valgtDyr.classList.remove("valgtDyr"); */

                    
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
            chooseAnimal(valgtDID);
            }, 1000);

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

            /* for (const animal of allAnimals) {
                
                
                if (animal.classList.contains("valgtFar")||animal.classList.contains("valgtMor")) {
                    setTimeout(function() {
                        animal.classList.remove("stamtavleStart");
                    },500);
                } else if (animal.classList.contains("valgtFarFar")||animal.classList.contains("valgtFarMor") || animal.classList.contains("valgtMorFar")||animal.classList.contains("valgtMorMor")) {
                    setTimeout(function() {
                        animal.classList.remove("stamtavleStart");
                    },1000);
                } else {
                    animal.classList.remove("stamtavleStart");
                }
                
            } */
        });
    }
}

async function chooseAnimal(incomingID) {
    let data = await getAllAnimals();
    



    


    for (let value of data) {
        //console.log(value);
        if (value.did !== incomingID) {
            continue;
        } 
    
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
        let morID = "";
        let farID = "";
        
        for (const parent of data) {
            if(value.mor !== null && value.mor === parent.did){
                morID = parent.regnr;
            }
            if(value.far !== null && value.far === parent.did){
                farID = parent.regnr;
            }
        }
            
        let html = `
            <img class="stamtavlebilde" src="${value.bilde}" width="100px" alt="bilde av kanin"/>
            <p class="item2 text-center">ID: ${incomingID} </p>
            <p class="item3">Reg.nr: ${value.regnr}</p>
            <p class="item4">V.Ø.: ${value.vø}</p>
            <p class="item5">Født: ${dateFormatert} </p>
            <p class="item6">Kull.nr: ${value.kullnr} </p>
            <p class="item7">Kjønn: ${value.kjønn} </p>
            <p class="item8">Innavlsgrad: ${value.innavlsgrad}</p>
            <p class="item9">Poeng: ${value.poeng} </p>
            <p class="item10">Farge: ${value.farge}</p>
        
        `

        let html2 = `
            <img class="stamtavlebilde" src="${value.bilde}" width="100px" alt="bilde av kanin"/>
            <p class="item20">ID: ${incomingID} </p>
            <p class="item3">Reg.nr: ${value.regnr}</p>
            <p class="item4">V.Ø.: ${value.vø}</p>
        `

        valgtDyr.innerHTML = html2;
        const item =  document.querySelectorAll(".item")[0];
        //console.log(item);
        item.addEventListener("mouseenter", mouseOver);
        item.addEventListener("mouseleave", mouseOut);

        function mouseOver(e) {
            e.preventDefault();
            console.log(e.currentTarget);
            console.log("????");
            item.innerHTML = " ";
            item.innerHTML = html;
        }
       
        function mouseOut(e) {
            console.log("!!!!")
            item.innerHTML = " ";
            item.innerHTML = html2;
        }

    
        valgtDyr.classList.add("valgtDyr"); 

    
    }
}