/**
 * Created by tselvan on 5/9/2015.
 */

var app = angular.module('buzz', []);

app.directive('clientView', function() {

    var directive = {};
    directive.restrict = 'E';
    directive.templateUrl = "client.html";

    return directive;
})

app.factory('socket', function ($rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});

app.factory('fileUploader', ['$q', '$timeout', function ($q, $timeout) {
    return {
        upload: function (files) {

            var deferred = $q.defer();
            var uploadedFiles = [];
            console.log(files);
            var done = 0;
            for (var i = 0, numFiles = files.length; i < numFiles; i++) {
                var photoFile = files[i];
                var reader = new FileReader();
                reader.onloadend = function (e) {
                    uploadedFiles.push(e.target.result);
                    done++;
                };
                reader.readAsDataURL(photoFile);
            }

            $timeout(function () {
                if (done == files.length)
                    deferred.resolve(uploadedFiles);
                else deferred.reject([])
            }, 3000);

            return deferred.promise;
        }
    }
}]);

app.controller('AdminCtrl', ['$scope', 'socket', 'fileUploader', function ($scope, socket, fileUploader) {

    $scope.comments = [];

    $scope.postComment = function () {

        var newComment = {txt: "", pics: []};
        newComment.txt = $scope.txt;
        var fileUploadedPromise = fileUploader.upload($('#photos').get(0).files);

        fileUploadedPromise.then(function (data) {
            newComment.pics = data;
            console.log('fileuploader success');
            console.log("emmitting new:comment with data: " + newComment);
            socket.emit('new:comment', newComment);
        }, function (data) {
            console.log('fileuploader failure');
        });

    };

    socket.on('new:comment', function (comment) {
        $scope.comments.push(comment);
    });


}]);


app.controller('ClientCtrl', ['$scope', 'socket', function ($scope, socket) {
    $scope.comments = [];
    socket.on('new:comment', function (comment) {
        $scope.comments.push(comment);
    });

}]);
