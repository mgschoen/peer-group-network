'use strict';

var sharp = require('sharp');
var fs = require('fs');

module.exports = function(Storage) {

  Storage.afterRemote('upload', function(context, result, next) {

    var uploadedFiles = context.result.result.files;
    var storedFilePaths = [];

    // Get paths to the files that were just uploaded
    for (var field in uploadedFiles) {
      uploadedFiles[field].forEach(function(file){
        storedFilePaths.push('./storage/' + file.container + '/' + file.name);
      });
    }

    var promises = [];

    storedFilePaths.forEach(function(filePath){

      return new Promise(function(resolve, reject){

        // Use sharp library for image resizing
        var image = sharp(filePath);
        image.metadata()
          .then(function(metadata){
            // resize smaller side of image to 200 px and keep ratio
            var cropWidth = (metadata.width <= metadata.height) ? 200 : null;
            var cropHeight = (metadata.height <= metadata.width) ? 200 : null;
            image
              .resize(cropWidth, cropHeight)
              // store the resized file next to the original file with postfix .cropped.jpg
              .toFile(filePath + '.cropped.jpg', function(err){
                if (err) reject(err);
                // delete the original image
                fs.unlink(filePath, function(err){
                  if (err) reject(err);
                  // rename resized image to the original image's filename
                  fs.rename(filePath + '.cropped.jpg', filePath, function (err) {
                    if (err) reject(err);
                    resolve();
                  });
                });
              });
          });
      });
    });

    Promise.all(promises).then(function(){
      next();
    }, function (err) {
      throw err;
    });
  });

};
