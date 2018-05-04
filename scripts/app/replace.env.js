#!/usr/bin/env node

var process = require('process');
var fs = require('fs');
var path = require('path');
var shell = require('shelljs');

var npmConfigJson = JSON.parse(process.env.npm_config_argv).original;
var indexEnv = npmConfigJson.indexOf('--env');
var env = 'dev';

if (indexEnv !== -1) {
  env = npmConfigJson[indexEnv + 1];
} else if (npmConfigJson.indexOf('--dev') !== -1) {
  env = 'dev';
} else if (npmConfigJson.indexOf('--prod') !== -1) {
  env = 'prod';
}

var content = fs.readFileSync('./src/app/app.env.ts.skel');
var comtentReplace = content.toString().replace(/Env: string = '.*'/, `Env: string = '${env}'`);
var wstream = fs.createWriteStream('./src/app/app.env.ts', { ovewrite: true });
wstream.write(comtentReplace);
wstream.end();

var filestocopy = [];
if (env.startsWith('prod')) {
  console.log('\n\n BUILD PROD -- Copiando arquivos de PRODUÇÃO!!!  \n\n');
  // filestocopy.push();
} else {
  // filestocopy.push();
}

// no need to configure below
var rootdir = process.cwd();

function directoryExists(path) {
  try {
    return fs.statSync(path).isDirectory();
  }
  catch (e) {
    return false;
  }
}

filestocopy.forEach(function (obj) {
  Object.keys(obj).forEach(function (key) {
    var val = obj[key];
    var srcfile = path.join(rootdir, key);
    console.log('source: ', srcfile);
    var destfile = path.join(rootdir, val);
    console.log('dest:', destfile);
    var destdir = path.dirname(destfile);

    if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
      console.log('both exists, copying file');
      // fs.createReadStream(srcfile).pipe(fs.createWriteStream(destfile));
      shell.cp('-R', key, val);
    } else {
      console.log('path verification failed, not copying files');
    }
  });
});
