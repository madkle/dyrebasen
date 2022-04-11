const express = require("express")
let router = express.Router();
const pg = require("pg")
const dbURI = "postgres://ljupupvyxeapow:df73019adda4ad7057438ca69f2cbc43913e80da17134bb9d0dc24f96f4fd5ad@ec2-52-208-145-55.eu-west-1.compute.amazonaws.com:5432/d1lljguu066joa";
const connstring = process.env.DATABASE_URL || dbURI;
const pool = new pg.Pool({
    connectionString: connstring,
    ssl:{rejectUnauthorized: false}
});

// dyr ------------------------------------------
//hent alle dyr
router.get("/dyr", async function(req, res, next){
    let sql = `
    SELECT * 
    FROM dyr
    `;
    try {
        let result = await pool.query(sql);
        res.status(200).json(result.rows).end();
    } catch (err) {
        res.status(500).json({error:err}).end();
    }
});


//hent spesifikt dyr
router.get("/dyr/:id", async function(req, res, next){
    let inpId = req.params.id;
    let sql = `
    SELECT * 
    FROM dyr
    WHERE did = ${inpId}
    `;
    try {
        let result = await pool.query(sql);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows).end();
        }else{
            res.status(404).json({}).end();
            //throw "404 no animal found. Check ID";
        }
        
    } catch (err) {
        res.status(500).json({error:err}).end();
    }
});
//Slett dyr
router.delete("/dyr/:id", async function(req, res, next){
    inpId = req.params.id;
    let sql = `
    DELETE FROM dyr 
    WHERE did = ${inpId} 
    RETURNING *
    `;
    try {
        let result = await pool.query(sql);
        res.status(200).json(result.rows).end();
    } catch (err) {
        res.status(500).json({error:err}).end();
    }
});

// bruker ------------------------------------------
//hent alle brukere
router.get("/bruker", async function(req, res, next){
    let sql = `
    SELECT * 
    FROM bruker
    `;
    try {
        let result = await pool.query(sql);
        res.status(200).json(result.rows).end();
    } catch (err) {
        res.status(500).json({error:err}).end();
    }
});

//hent spesifikk bruker
router.get("/bruker/:id", async function(req, res, next){
    let inpId = req.params.id;
    let sql = `
    SELECT * 
    FROM bruker
    WHERE bid = ${inpId}
    `;
    try {
        let result = await pool.query(sql);
        res.status(200).json(result.rows).end();
    } catch (err) {
        res.status(500).json({error:err}).end();
    }
});

router.delete("/bruker/:id", async function(req, res, next){
    inpId = req.params.id;
    let sql = `
    DELETE FROM bruker 
    WHERE bid = ${inpId} 
    RETURNING *
    `;
    try {
        let result = await pool.query(sql);
        res.status(200).json(result.rows).end();
    } catch (err) {
        res.status(500).json({error:err}).end();
    }
});



module.exports = router;