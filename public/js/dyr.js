import {getToken} from "./user.js";
import {colourArr} from "./colour.js";
import {generatePDF} from "/js/pdf.js";
//import {loadHTMLElements} from "../minedyr.html"

export async function getAllAnimals() {
    let loggedInToken = await getToken();
    let url = "/dyr";
    
    let cfg = {
        headers:{
            "userid":loggedInToken.userid
        }
    }
        try {
            let response = await fetch(url, cfg);
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
export async function getSingleAnimal(id) {

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
export async function addAnimal(updata) {
    let loggedInToken = await getToken();
    let url = "/dyr";
    updata.bid = loggedInToken.userid;
    let cfg = {
        method: "POST",
        headers: {"content-type":"application/json"},
        body: JSON.stringify(updata)
    }
    try {
        let response = await fetch(url, cfg);
        let data = await response.json();

        if (response.status != 200) {
            throw data.error;
        }

        return {status: 200, msg: "added to database"}
    }
    catch(error) {
        console.log(error);
        return {status: 500, msg: "something went wrong! Could not add to database"}
    }
  
}
export async function updateAnimal(updata) {
    let url = "/dyr";

   
    let cfg = {
        method: "PUT",
        headers: {"content-type":"application/json"},
        body: JSON.stringify(updata)
        
    }
    
    try {
        let response = await fetch(url, cfg);
        listAnimals();

        if (response.status != 200) {
            throw data.error;
        }
    }
    catch(error) {
        console.log(error);
        txtResult.innerHTML = "Noe gikk galt - sjekk konsollvinduet"
    }
}

async function deleteAnimal(dyrID) {
    
    let url = `/dyr/${dyrID}`;

    
    let cfg = {
        method: "DELETE",
        headers: {"content-type":"application/json"}
    }

    try {
        let response = await fetch(url, cfg);
        let data = await response.json();

        if (response.status != 200) {
            throw data.error;
        }
        
        listAnimals();
    }
    catch(error) {
        console.log(error);
    }
} 

        export let activeID = null;
        export let originalInputValues = {};
        async function loadHTMLElements(selectedID) {
            

            let clickedAnimal = "";
            clickedAnimal = await getSingleAnimal(selectedID)
            
            inpRegNr.value = clickedAnimal.regnr;
            inpVø.value = clickedAnimal.vø;
            inpFdato.value = clickedAnimal.fdato;
            inpKullNr.value = clickedAnimal.kullnr;
            dropKjønn.value = clickedAnimal.kjønn;
            inpInnavlsgrad.value = clickedAnimal.innavlsgrad;
            inpPoeng.value = clickedAnimal.poeng;
            inpFarge.value = clickedAnimal.farge;
            inpFar.value = clickedAnimal.far;
            inpMor.value = clickedAnimal.mor;
            //inpBilde.value = clickedAnimal.bilde;

            originalInputValues = {
                regnr: inpRegNr.value,
                vø: inpVø.value,
                fdato: inpFdato.value,
                kullnr: inpKullNr.value,
                kjønn: dropKjønn.value,
                innavlsgrad: inpInnavlsgrad.value,
                poeng: inpPoeng.value,
                farge: inpFarge.value,
                far: inpFar.value,
                mor: inpMor.value,
                bilde: inpBilde.value
            }
            activeID = selectedID;
            //console.log(originalInputValues);
        }


export async function listAnimals(userid) {
    let data = await getAllAnimals(userid);

    container.innerHTML = " ";

    for (let value of data) {
        let testBilde = "bilder/kanin_standardbilde.jpeg";
        //console.log(value);
        if (value.bilde === null) {
            value.bilde = testBilde
        }
        
        let fdato = value.fdato ;
        let dateFormatert = "";
        
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

        for (const item in value) {
            if (value[item] === null) {
                value[item] = "";
            }
        }
        let html = `
            <img class="item1" src="${value.bilde}" width="100px" alt="bilde av kanin"/>
            <p class="item2">ID: ${value.did} </p>
            <p class="item3" style="font-weight: bold;">Reg.nr: ${value.regnr}</p>
            <p class="item4">V.Ø.: ${value.vø}</p>
            <p class="item5">Fødselsdato: ${dateFormatert} </p>
            <p class="item6">Kullnummer: ${value.kullnr} </p>
            <p class="item7">Kjønn: ${value.kjønn} </p>
            <p class="item8">Innavlsgrad: ${value.innavlsgrad}</p>
            <p class="item9">Poeng: ${value.poeng} </p>
            <p class="item10">Farge: ${value.farge}</p>
            <p class="item11">Far: ${farID} </p>
            <p class="item12">Mor: ${morID} </p><br>
        `

        let div = document.createElement("div");
        div.innerHTML = html;
        
        div.classList.add("mineDyr"); 
        div.classList.add("rounded");
        div.classList.add("shadow");
        
        let editbtn = document.createElement("button");
        editbtn.classList.add("rediger");
        editbtn.classList.add("btn");
        editbtn.classList.add("btn-outline-secondary");
        editbtn.classList.add("fa-solid");
        editbtn.classList.add("fa-pen");
        editbtn.setAttribute("data-bs-toggle", "modal");
        editbtn.setAttribute("data-bs-target", "#editDyrModal");
        editbtn.addEventListener('click', function(){
            loadHTMLElements(value.did);
        })
        div.appendChild(editbtn);


        //div.innerHTML += editbtn;

        container.appendChild(div);

        let delbtn = document.createElement("button");
        delbtn.classList.add("slett");
        delbtn.classList.add("btn");
        delbtn.classList.add("btn-outline-secondary");
        delbtn.classList.add("fa-solid");
        delbtn.classList.add("fa-trash-can");
        delbtn.addEventListener('click', function(){
            deleteAnimal(value.did);
        })
        div.appendChild(delbtn);

        let genStam = document.createElement("button");
        genStam.classList.add("genstam");
        genStam.classList.add("btn");
        genStam.classList.add("btn-secondary")
        genStam.innerText ="Generer stamtavle";
        genStam.addEventListener('click', function(){
            generatePDF(value.did);
        })
        div.appendChild(genStam);
    }
}

export async function loadFormElements() {
    colourArr.forEach(currColour => {
      let option = document.createElement("option");
      option.innerHTML = currColour.colour;
      option.value = currColour.colour;
      fargeValg.appendChild(option);
    });

    let alleDyr = await getAllAnimals();
    alleDyr.forEach(currDyr => {
      let option = document.createElement("option");
      option.innerHTML = `regnr: ${currDyr.regnr}`;
      option.value = currDyr.did;
      if (currDyr.kjønn === "Male") {
        valgFar.appendChild(option);
      }else{
        valgMor.appendChild(option);
      }
    });
  }