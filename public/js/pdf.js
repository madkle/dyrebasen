async function getSingleAnimal(id) {

    let url = `/dyr/${id}`;

    try {
        if (id !== null) {
            let response = await fetch(url);
            let data = await response.json();
            if (response.status != 200) {
                throw data.error;
            }
            
            return data[0];
        }
        let blankFamily = {
            aid_FK: null,
            bid_FK: null,
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
            vø: null
        }
        return blankFamily;
    }
    catch(error) {
        console.log(error);
    }
}
