async function getSingleAnimal(id) {

    let url = `/dyr/${id}`;

    try {
        let response = await fetch(url);
        let data = await response.json();

        if (response.status != 200) {
            throw data.error;
        }
    
        return data[0];
    }
    catch(error) {
        console.log(error);
    }
}
