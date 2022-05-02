let inpRegNr = document.getElementById('inpRegNr');
let inpVø = document.getElementById('inpVø');
let inpFdato = document.getElementById('inpFdato');
let inpKullNr = document.getElementById('inpKullNr');
let dropKjønn = document.getElementById('dropKjønn');
let inpInnavlsgrad = document.getElementById('inpInnavlsgrad');
let inpPoeng = document.getElementById('inpPoeng');
let inpFarge = document.getElementById('inpFarge');
let fargeValg = document.getElementById('fargeValg')
let inpFar = document.getElementById('inpFar');
let valgFar = document.getElementById('valgFar');
let inpMor = document.getElementById('inpMor');
let valgMor = document.getElementById('valgMor');
let inpBilde = document.getElementById('inpBilde');
let bildeData = null;
loadFormElements()      

inpBilde.addEventListener("change", function (evt) {
    let fr = new FileReader();
    fr.addEventListener("load", function (evt) {
        bildeData = fr.result;
    });
    fr.readAsDataURL(inpBilde.files[0]);
})

