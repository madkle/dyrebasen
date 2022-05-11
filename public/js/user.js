export async function getToken() {
    let url = "/auth"
    let storedToken = localStorage.getItem("token")
    let cfg = {
        headers: {
            "token": storedToken
        }
    };
    try {
        let response = await fetch(url, cfg);
        let data = await response.json();
        if (response.status != 200) {
            throw data.error;
        }
        return data;
    }
    catch(error) {
        console.log(error);
    }
}
export async function getUserInfo(id) {
    let url = `/bruker/${id}`
    
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
export async function logOutUser() {
    localStorage.removeItem("token")
}
export function createCredentialString(username, password) {
    let combinedStr = username + ":" + password;
    let b64Str = btoa(combinedStr);

    return "basic " + b64Str;
}
export async function addUser(regfirstname,reglastname,regemail,regusername,regpwd){   
    let url = "/bruker"
    let credString = createCredentialString(regusername.value, regpwd.value)
    
    let updata = {
        fornavn: regfirstname.value, 
        etternavn: reglastname.value,
        epost: regemail.value
    }

    let cfg = {
        method: "POST",
        headers: {
            "content-type":"application/json",
            "authorization": credString
        },
        body: JSON.stringify(updata)
    };
    
    try {
        let response = await fetch(url, cfg);
        let data = await response.json();

        if (response.status != 200) {
            throw data.error;
        }

        location.href = "index.html"
    }
    catch(error) {
        console.log(error);
    }
}

export async function updateUser(regfirstname,reglastname,regemail,regusername,regpwd){
    console.log("need a fix");
    /* let url = "/bruker"
    let credString = createCredentialString(regusername.value, regpwd.value)
    
    let updata = {
        fornavn: regfirstname.value, 
        etternavn: reglastname.value,
        epost: regemail.value
    }

    let cfg = {
        method: "POST",
        headers: {
            "content-type":"application/json",
            "authorization": credString
        },
        body: JSON.stringify(updata)
    };
    
    try {
        let response = await fetch(url, cfg);
        let data = await response.json();

        if (response.status != 200) {
            throw data.error;
        }

        location.href = "index.html"
    }
    catch(error) {
        console.log(error);
    } */
    /* let url = "/dyr";

   
    let cfg = {
        method: "PUT",
        headers: {"content-type":"application/json"},
        body: JSON.stringify(updata)
        
    }
    
    try {
        let response = await fetch(url, cfg);

        if (response.status != 200) {
            throw data.error;
        }
    }
    catch(error) {
        console.log(error);
        txtResult.innerHTML = "Noe gikk galt - sjekk konsollvinduet"
    } */
}