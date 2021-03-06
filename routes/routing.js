const express = require("express")
let router = express.Router();
const pg = require("pg");
const { createHash } = require("../modules/auth.js");
const auth = require("../modules/auth.js");
const dbURI = "postgres://ljupupvyxeapow:df73019adda4ad7057438ca69f2cbc43913e80da17134bb9d0dc24f96f4fd5ad@ec2-52-208-145-55.eu-west-1.compute.amazonaws.com:5432/d1lljguu066joa";
const connstring = process.env.DATABASE_URL || dbURI;
const pool = new pg.Pool({
    connectionString: connstring,
    ssl:{rejectUnauthorized: false}
}); 
const ADMINID = 30;
const normalize = require("../modules/normalize.js");
// dyr ------------------------------------------
//hent alle dyr
router.get("/dyr", async function(req, res, next){
    let userId = req.headers.userid;
    userId = parseInt(userId);
    let sql = `
        SELECT * 
        FROM dyr
        WHERE dyr.bidfk = ${userId}
        ORDER BY did
    `; 
    if (userId === ADMINID) {
        sql = `
        SELECT * 
        FROM dyr
        ORDER BY did
        `;
    }
    
    try {
        let result = await pool.query(sql);
        res.status(200).json(result.rows).end();
    } catch (err) {
        res.status(500).json({error:err}).end();
    }
});

//henter dyr basert på søkeresultater
router.get("/search", async function(req, res, next){
    let userId = req.headers.userid;
    let inSql = req.headers.sql;
    userId = parseInt(userId);
    let sql = `
        SELECT * 
        FROM dyr
        WHERE ${inSql} AND dyr.bidfk = ${userId}
        ORDER BY did
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

router.post("/dyr", normalize, async function(req, res, next)  {
    
    let updata = req.body;
    try{
        let sql = `INSERT INTO dyr (did, regnr, vø, fdato, kullnr, kjønn, innavlsgrad, poeng, farge, far, mor , bidfk, aidfk, bilde) 
        VALUES 
        (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) returning *`;
        let values = [ 
          updata.regnr, updata.vø, updata.fdato, updata.kullnr, updata.kjønn, updata.innavlsgrad, updata.poeng, updata.farge, updata.far, updata.mor , updata.bid, updata.aid, updata.bilde
        ];
        let result= await pool.query(sql, values);
        
        if(result.rows.length > 0){
            res.status(200).json({msg : "added to database"}).end();
        }
        else{
            throw "could not add to database";
        }
    }catch(err){
        console.log(err);
        res.status(500).json({error: err}).end();
    }
    
    
});

router.put("/dyr", normalize, async function(req, res, next)  {
    let updata = req.body; 
    try{
        let count = 2;
        let sql = `UPDATE dyr SET`;
        let values = [updata.did];
        for (const key in updata) { 
            if (key=== "did") {continue}
            if(count === 2){
                sql += ` ${key} = $${count}`;
            }else{
                sql += `, ${key} = $${count}`;
            }
            values.push(updata[key]);
            count++;
        }
        sql += ` WHERE did = $1 returning *`;
        let result= await pool.query(sql, values);
        if(result.rows.length > 0){
            res.status(200).json({msg : "Updated the database"}).end();
        }
        else{
            throw "could not add to the database.";
        }
        
    }catch(err){
        res.status(500).json({error: err}).end();
    }

    
});


// bruker ------------------------------------------
//hent alle brukere

router.put("/bruker", normalize, async function(req, res, next)  {
    let updata = req.body;
    let credstring = req.headers.authorization;
    let cred = "";
    if (credstring !== "") {
        cred = auth.decodeCred(credstring);
        updata.brukernavn = cred.username;
        let hash = createHash(cred.password);
        updata.passord = hash.value;
        updata.salt = hash.salt;
    }
    try{
        let count = 2;
        let sql = `UPDATE bruker SET`;
        let values = [updata.bid];
        for (const key in updata) { 
            if (key=== "bid") {continue}
            if(count === 2){
                sql += ` ${key} = $${count}`;
            }else{
                sql += `, ${key} = $${count}`;
            }
            values.push(updata[key]);
            count++;
        }
        sql += ` WHERE bid = $1 returning *`;
        let result= await pool.query(sql, values);
        if(result.rows.length > 0){
            res.status(200).json({msg : "Updated the database"}).end();
        }
        else{
            throw "could not add to the database.";
        }
        
    }catch(err){
        res.status(500).json({error: err}).end();
    }
});

router.get("/bruker", async function(req, res, next){
    let sql = `
    SELECT * 
    FROM bruker
    ORDER BY bid
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
router.post("/bruker", normalize, async function(req, res, next)  {

    let updata = req.body;
    let credstring = req.headers.authorization;
    let cred = auth.decodeCred(credstring);
    
    if (cred.username === "" || cred.password === "") {
        res.status(401).json({error: "No username or password"}).end();
        return
    }

    let hash = auth.createHash(cred.password)
    try{
        let sql = "INSERT INTO bruker (bid, fornavn, etternavn, epost, brukernavn, passord, salt) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6) returning *";
        let values = [updata.fornavn, updata.etternavn, updata.epost, cred.username, hash.value, hash.salt];
        let result= await pool.query(sql, values);
        if(result.rows.length > 0){
            res.status(200).json({msg : "added to database"}).end();
        }
        else{
            throw "Could not add to the database.";
        }
    }catch(err){
        res.status(500).json({error: err}).end();
    }
    
});

// login bruker
router.post("/bruker/login", async function(req, res, next)  {
    let credstring = req.headers.authorization;
    let cred = auth.decodeCred(credstring);
    
    if (cred.username === "" || cred.password === "") {
        res.status(401).json({error: "No username or password"}).end();
        return
    }

    try{
        let sql = `
        SELECT * 
        FROM bruker
        WHERE brukernavn = $1
        `;
        let values = [cred.username];
        let result= await pool.query(sql, values);
        if(result.rows.length > 0){
            let userID = result.rows[0].bid;
            let username = result.rows[0].brukernavn;
            let hashPassword = result.rows[0].passord; 
            let salt = result.rows[0].salt;

            if (auth.verifyPassword(cred.password, hashPassword, salt)) {
                let newToken = auth.createToken(username,userID);
                
                res.status(200).json({
                    msg : "Successful Login",
                    token: newToken,
                    userid: userID
                }).end();
            }else{
                res.status(401).json({error: "Wrong username or password"}).end();
                return;
            }
            
        }
        else{
            res.status(401).json({error: "Wrong username and/or password"}).end();
            return;
        }
        
    }catch(err){
        res.status(500).json({error: err}).end();
    }
    
});

router.get("/auth", async function(req, res, next){
    let token = req.headers.token;
    try {
        let payload = auth.verifyToken(token)
        res.status(200).json(payload).end();
    } catch (err) {
        res.status(500).json({error:err}).end();
    }
    
});
// dyreart
// hent alt dyreart
router.get("/dyreart", async function(req, res, next){
    let sql = `
    SELECT * 
    FROM dyreart
    ORDER BY aid
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
        throw "Could not add to the database.";
        }
    }catch(err){
        res.status(500).json({error: err}).end();
    }
});
router.put("/dyreart", normalize, async function(req, res, next)  {
    let updata = req.body;
    try{
        let sql = "UPDATE dyreart SET navn = $1 WHERE aid = $2 returning *";
        let values = [updata.navn, updata.aid];
        let result= await pool.query(sql, values);
        if(result.rows.length > 0){
            res.status(200).json({msg : "Updated to database"}).end();
        }
        else{
        throw "Could not add to the database.";
        }
    }catch(err){
        res.status(500).json({error: err}).end();
    }
});



module.exports = router;