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
async function addAnimal(updata) {
    let url = "/dyr";

   
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
    }
    catch(error) {
        console.log(error);
        txtResult.innerHTML = "Noe gikk galt - sjekk konsollvinduet"
    }
}
async function updateAnimal(updata) {
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

async function listAnimals() {
    let data = await getAllAnimals();

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
            <h2 class="item2">ID: ${value.did} </h2>
            <p class="item3">Reg.nr: ${value.regnr}</p>
            <p class="item4">V.Ø.: ${value.vø}</p>
            <p class="item5">Fødselsdato: ${dateFormatert} </p>
            <p class="item6">Kullnummer: ${value.kullnr} </p>
            <p class="item7">Kjønn: ${value.kjønn} </p>
            <p class="item8">Innavlsgrad: ${value.innavlsgrad}</p>
            <p class="item9">Poeng: ${value.poeng} </p>
            <p class="item10">Farge: ${value.farge}</p>
            <p class="item11">Far: ${farID} </p>
            <p class="item12">Mor: ${morID} </p><br><hr>
        `
            

        let div = document.createElement("div");
        div.innerHTML = html;
        container.appendChild(div);
        div.classList.add("mineDyr"); 

        let delbtn = document.createElement("button");
        delbtn.classList.add("slett");
        delbtn.innerHTML = "✕";

        delbtn.addEventListener('click', function(){
            deleteAnimal(value.did);
        });

        div.appendChild(delbtn);
        /* div.insertBefore(delbtn, div.lastElementChild); */
            
        let editbtn = `<button class="rediger" onclick="loadHTMLElements(${value.did});" data-bs-toggle="modal" data-bs-target="#exampleModal">✏️</button>`
        
        /*document.createElement("button");
        editbtn.classList.add("rediger");
        editbtn.innerText ="✏️";*/
        //div.appendChild(editbtn);
        let genStam = document.createElement("button");
        genStam.classList.add("genstam");
        genStam.innerText ="Generer stamtavle";
        genStam.addEventListener('click', function(){
            generatePDF(value.did);
        })

        
        div.innerHTML += editbtn
        div.appendChild(genStam);
    }
}

async function loadFormElements() {
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