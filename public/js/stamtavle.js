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

    container.innerHTML = " ";

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
            <p class="item2">ID: ${value.did} </p>`


            
        let div = document.createElement("div");
        div.innerHTML = html1;
        container.appendChild(div);
        div.classList.add("mineDyr"); 

        /* div.draggable = true; */
        

        /* div.addEventListener('click', function(evt) {
            let valgtDID = value.did;
            localStorage.setItem("did", valgtDID);
            chooseAnimal();
            console.log(value.did);
            console.log(getAllAnimals());
        }); */
    }
}

/* async function chooseAnimal() {
    let data = await getAllAnimals();
    let valgtDID = localStorage.getItem('did');

    valgtDyr.innerHTML = " ";

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
            
        let html = `
            <img class="item1" src="${value.bilde}" width="100px" alt="bilde av kanin"/>
            <p class="item2">ID: ${valgtDID} </p>
            <p class="item3">Reg.nr: <br>${value.regnr}</p>
            <p class="item4">V.Ø.: ${value.vø}</p>
            <p class="item5">Fødselsdato: ${dateFormatert} </p>
            <p class="item6">Kullnummer: ${value.kullnr} </p>
            <p class="item7">Kjønn: ${value.kjønn} </p>
            <p class="item8">Innavlsgrad: ${value.innavlsgrad}</p>
            <p class="item9">Poeng: ${value.poeng} </p>
            <p class="item10">Farge: ${value.farge}</p>
            <p class="item11">Far: ${value.far} </p>
            <p class="item12">Mor: ${value.mor} </p>
        `

    
        valgtDyr.innerHTML = html;
        valgtDyr.classList.add("valgtDyr"); 
    }
} */