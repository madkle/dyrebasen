export function createCredentialString(username, password) {
    let combinedStr = username + ":" + password;
    let b64Str = btoa(combinedStr);

    return "basic " + b64Str;
}
export async function checkToken(){
    let token = await getToken();
    console.log(token);
    if(!token){
      window.location.href = "../index.html";
    }
}
export async function getToken() {
    let url = "/auth"
    let storedToken = localStorage.getItem("token");
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

export async function addUser(regfirstname,reglastname,regemail,regusername,regpwd){   
    let url = "/bruker"
    let credString = createCredentialString(regusername.value, regpwd.value)
    
    let updata = {
        fornavn: regfirstname, 
        etternavn: reglastname,
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

export async function updateUser(updata){
    let url = "/bruker";
    let credString  = "";
    
    if (updata.passord) {
        credString = createCredentialString(updata.brukernavn, updata.passord)
        
        delete updata.passord;
        delete updata.brukernavn;
    }

    let cfg = {
        method: "PUT",
        headers: {
            "content-type":"application/json",
            "authorization": credString
        },
        body: JSON.stringify(updata)
    }
    
    console.log(updata);
    try {
        let response = await fetch(url, cfg);
        let data = response.json();
        if (response.status != 200) {
            throw data.error;
        }
    }
    catch(error) {
        console.log(error);
        
    }
}