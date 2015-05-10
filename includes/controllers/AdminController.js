/**
 * Created by tselvan on 5/7/2015.
 */

angular.module('buzz').controller('AdminController',['$scope', '$http', function($scope, $http){
    $scope.comments =[];
    $scope.post = function(comment) {

        $scope.comments.push(comment);

        $http.post('uploadComment.php', {msg: comment})
            .success(function(data, status, headers, config){
                console.log(data);
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });

    };

}]);