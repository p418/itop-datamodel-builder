module.exports = Builder;
function Builder(){}
Builder.prototype.build = function(input){ return JSON.stringify(input);};
Builder.prototype.objectMode = true;
