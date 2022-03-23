const { jsPDF } = require("jspdf");

const styling = {"margin-x":10,"margin-y":5};
const cellHeight = 50;
const rows = [];
const col = [];
const generations = 3;
const A4 = {"width": 210, "height": 297};// in mm
let doc = new jsPDF();
const contentWidth = A4.width - styling["margin-x"] * 2;

for (let i = 0;  i<generations; i++){ //en og en rad
    let x = styling["margin-x"];
    let y = styling["margin-y"]+(cellHeight*i);
    rows.push(
        {
            "x":styling["margin-x"], 
            "y": styling["margin-y"]+(cellHeight*i)
        },
    )
    doc.cell(x, y, contentWidth, cellHeight, `Test ${i+1}`);


};
console.log(rows);
function test() {
    doc.text("Hello world1", 40, 40);
        
    doc.text("Hello world2", 140, 40);
};

doc.save("pdfs/output.pdf");
