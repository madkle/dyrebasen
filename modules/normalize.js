// the middleware function --------------
function normalize(req, res, next){
    variables = req.body
    for (const data in variables) {
        if (variables[data] === '' || variables[data] === ' ') {
            variables[data] = null
        }
    }
    req.body = variables;
    next();
}
//export the function -----------
module.exports = normalize;