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
// publiser nytt dyr
router.post("/dyr", async function(req, res, next)  {

    let updata = req.body;
    try{
        
        let sql = `INSERT INTO dyr (did, regnr, vø, fdato, kullnr, kjønn, innavlsgrad, poeng, farge, far, mor , bidfk, aidfk, bilde) 
        VALUES 
        (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) returning *`;
        let values = [ 
          updata.regnr, updata.vø, updata.fdato, updata.kullnr, updata.kjønn, updata.innavlsgrad, updata.poeng, updata.farge, updata.far, updata.mor , updata.bidFK, updata.aidFK, updata.bilde
        ];
        //console.log(values);
        let result= await pool.query(sql, values);
        if(result.rows.length > 0){
            res.status(200).json({msg : "added to database"}).end();
        
        }
        else{
        throw "Kould not ad to the database.";
        }
    }catch(err){
        res.status(500).json({error: err}).end();
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
// slett slet spesefik bruker
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
// publiserer ny bruker
router.post("/bruker", async function(req, res, next)  {

    let updata = req.body;
    try{
        let sql = "INSERT INTO bruker (bid, fornavn, etternavn) VALUES (DEFAULT, $1, $2) returning *";
        let values = [ updata.fornavn, updata.etternavn];
        let result= await pool.query(sql, values);
        if(result.rows.length > 0){
            res.status(200).json({msg : "added to database"}).end();
        
        }
        else{
        throw "Kould not ad to the database.";
        }
    }catch(err){
        res.status(500).json({error: err}).end();
    }
});
// dyreart
// hent alt dyreart
router.get("/dyreart", async function(req, res, next){
    let sql = `
    SELECT * 
    FROM dyreart
    `;
    try {
        let result = await pool.query(sql);
        res.status(200).json(result.rows).end();
    } catch (err) {
        res.status(500).json({error:err}).end();
    }
});

//hent spesifikk dyreart
router.get("/dyreart/:id", async function(req, res, next){
    let inpId = req.params.id;
    let sql = `
    SELECT * 
    FROM dyreart
    WHERE aid = ${inpId}
    `;
    try {
        let result = await pool.query(sql);
        res.status(200).json(result.rows).end();
    } catch (err) {
        res.status(500).json({error:err}).end();
    }
});
// slett slet spesefik bruker
router.delete("/dyreart/:id", async function(req, res, next){
    inpId = req.params.id;
    let sql = `
    DELETE FROM dyreart 
    WHERE aid = ${inpId} 
    RETURNING *
    `;
    try {
        let result = await pool.query(sql);
        res.status(200).json(result.rows).end();
    } catch (err) {
        res.status(500).json({error:err}).end();
    }
});
// publiserer ny bruker
router.post("/dyreart", async function(req, res, next)  {

    let updata = req.body;
    try{
        let sql = "INSERT INTO dyreart (aid, navn) VALUES (DEFAULT, $1) returning *";
        let values = [updata.navn];
        let result= await pool.query(sql, values);
        if(result.rows.length > 0){
            res.status(200).json({msg : "added to database"}).end();
        }
        else{
        throw "Kould not ad to the database.";
        }
    }catch(err){
        res.status(500).json({error: err}).end();
    }
});


module.exports = router;