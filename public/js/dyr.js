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

        txtResult.innerHTML = data.msg;
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
        let testBilde = document.createElement("img");
        testBilde.setAttribute("src", "bilder/kanin_eksempelbilde.jpeg");
        
        let fdato = value.fdato ;

        let d = new Date(fdato)
        let y = d.getFullYear();
        let m = d.getMonth();
        let date = d.getDate()
        console.log(`${y}/${m}/${date}`);
        if (fdato !== null) {
            //console.log(fdato);

        }
       
        let html = `
            <img class="item1" src="${testBilde.src}" width="100px"/>
            <h2 class="item2">ID: ${value.did} </h2>
            <p class="item3">Reg.nr: ${value.regnr}</p>
            <p class="item4">V.Ø.: ${value.vø}</p>
            <p class="item5">Fødselsdato: ${fdato} </p>
            <p class="item6">Kullnummer: ${value.kullnr} </p>
            <p class="item7">Kjønn: ${value.kjønn} </p>
            <p class="item8">Innavlsgrad: ${value.innavlsgrad}</p>
            <p class="item9">Poeng: ${value.poeng} </p>
            <p class="item10">Farge: ${value.farge}</p>
            <p class="item11">Far: ${value.far} </p>
            <p class="item12">Mor: ${value.mor} </p><br><hr>
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
            
        let editbtn = document.createElement("button");
        editbtn.classList.add("rediger");
        editbtn.innerText ="✏️";

        let genStam = document.createElement("button");
        genStam.classList.add("genstam");
        genStam.innerText ="Generer stamtavle";
        genStam.addEventListener('click', function(){
            generatePDF(value.did);
        })

        div.appendChild(editbtn);
        div.appendChild(genStam);
    }
}