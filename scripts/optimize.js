const fs = require("fs");
const glob = require("glob");
const sharp = require("sharp");
const Promise = require("bluebird");
const { extname, join, basename } = require("path");
const crypto = require("crypto");

const SOURCE_DIR = './originals';
const OUT_DIR = './public/images';

const successList = [];
const errorList = {};

glob(`${SOURCE_DIR}/*`, function (er, files) {
  Promise.resolve(files)
    .mapSeries((file) => resize(file, join(OUT_DIR, makefilename(file))))
    .then(() =>
      Promise.fromCallback(function (cb) {
        fs.writeFile("resize.log", JSON.stringify(errorList, null, 2), cb);
      }).catch(function (err) {
        errorList["write_log_to_file_error"] = err;
      })
    )
    .then(function () {
      console.log("------------------------------");
      console.log("TOTAL:", files.length);
      console.log("OKAY:", successList.length);
      console.log("FAIL:", Object.keys(errorList).length);
    });
});

function resize(sourceFile, destFile) {
  return sharp(sourceFile)
    .resize(1200, 1200)
    .rotate()
    .toFormat("jpeg", { progressive: true, quality: 50 })
    .toBuffer()
    .then((buffer) =>
      Promise.fromCallback((cb) => fs.writeFile(destFile, buffer, cb))
    )
    .then(function () {
      successList.push(sourceFile);
      console.log("Okay:", sourceFile);
    })
    .catch(function (err) {
      console.log("Fail:", sourceFile, "\n", err);
      errorList[sourceFile] = {
        message: err.message,
        fileName: err.fileName,
        lineNumber: err.lineNumber,
      };
    });
}

function makefilename(filepath) {
  const hash = crypto
    .createHash("md5")
    .update(basename(filepath))
    .digest("hex");
  return hash.substring(0, 10) + extname(filepath);
}
