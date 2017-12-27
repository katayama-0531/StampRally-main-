app.factory("DirectoryMethod", ["$q", "FileSystem", function($q, FS) {
  return {
      getTargetDirectory: function(dirPath) {
          let deferred = $q.defer();
          FS.getFileSystem()
          .then(function(filesystem){
              filesystem.root.getDirectory(dirPath, {create: false}, function(dirEntry){
                  deferred.resolve(dirEntry);
              },
              function(erroe){
                  deferred.reject(error);
              });
          });
          return deferred.promise;
      }
  };
}]);