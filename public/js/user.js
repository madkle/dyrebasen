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
                return data.userid;
            }
            catch(error) {
                console.log(error);
                txtResult.innerHTML = "Noe gikk galt - sjekk konsollvinduet"
            }
}