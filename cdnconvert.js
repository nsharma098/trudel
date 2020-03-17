var cdnizerFactory = require("cdnizer");
const fs = require('fs')

var baseDirPath = process.cwd();
var files = [];





function walkSync(currentDirPath, callback) {
    var fs = require('fs'),
        path = require('path');
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
        	files.push(filePath.replace(baseDirPath+"/",''));	
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}
	

walkSync(baseDirPath, function (err, data) {
   if (err) return console.error(err);
  // console.log(data.toString());
});
console.log(files);
files.push('**/*.js');
files.push('**/*.css');
// files.push('**/*.js**');
// files.push('**/*?ver=*.*');
files.push('**/*.{gif,png,jpg,jpeg}');

var files2 = ['**/*.{gif,png,jpg,jpeg}','**/*.css','**/*.js','**/*?ver=*.*'];

var cdnizer = cdnizerFactory({
    defaultCDNBase: "//my.cdn.host/base",
    allowRev: true,
    allowMin: true,
    files: files,
    excludeAbsolute: true
});

for (var i = files.length - 4; i >= 0; i--) {
	var contents = fs.readFileSync(files[i], 'utf8');         
	// Replace the file's contents
	// console.log(contents);
	contents = cdnizer(contents);
	// console.log(contents);
	var p = "/converted/" + files[i] ;
	var name = p.split("/"); 
	var p1 = p.replace("/" + name[name.length - 1],'');
	//console.log(p1);
	fs.mkdirSync(baseDirPath + p1,{recursive:true},function (err) {
	  if (err) throw err;
	  //console.log('Saved!');
	});
	fs.writeFile(baseDirPath + p, contents, function (err) {
	  if (err) throw err;
	  //console.log('Saved!');
	});
}

