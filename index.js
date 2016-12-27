var args = process.argv;
var fs = require('fs');
var pkg;
if(args.length > 2){
	pkg = JSON.parse(fs.readFileSync(args[2],"utf-8"));
}else{
	console.log('please enter the package.json filepath!');
	return;
}

var http = require('http');
var dependencies = pkg.dependencies;
var devDependencies = pkg.devDependencies;
var jsdom = require("jsdom");

var licenseInfo = {
	dependencies:{},
	devDependencies:{}
}
var queryUrl = 'https://www.npmjs.com/package/';
var getLicense = function(key, next, pkgIn){
	jsdom.env(queryUrl + key, function(err, window){
		if(err){
			console.error(err);
			return;
		}
		var d0 = window.document.querySelector('.last-publisher');
		//		console.log(d0.innerHTML);
		var license;
		var licenseDom = d0.nextElementSibling.nextElementSibling.nextElementSibling;

		if(!licenseDom){
			license = 'unkown';
		}else{
			license = licenseDom.querySelector('a').textContent;
		}
		licenseInfo[pkgIn][key] = license;
		if(key == undefined){debugger;}
		console.log(key + '\'s license:',license);
		next();
	});
}
//console.log(pkg.dependencies);
//console.log(pkg.devDependencies);

function start(pkgKey, next){
	var packages = pkg[pkgKey];
	var keys = Object.keys(packages);
	var nexter = function(i, keys){
		var key = keys[i];
		if(i==keys.length-1){
			console.log(licenseInfo);
			if(next) {
				next();
			}
			return;
		}
		console.log('key:', key, ',i:', i , ", pkgKey:", pkgKey)
		getLicense(keys[i], nexter.bind(null, i+1, keys), pkgKey);
	}
	nexter(0, keys);
}

start('dependencies', start.bind(null, 'devDependencies', function(){
	fs.writeFileSync('license.info', JSON.stringify(licenseInfo));
}));
