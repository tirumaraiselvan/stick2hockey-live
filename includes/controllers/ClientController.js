/**
 * Created by tselvan on 5/8/2015.
 */


angular.module('buzz').controller('ClientController',['$scope', Poller, function($scope, Poller){
    $scope.comments =[];
    $scope.id = 0;
    var poll = function(){
    $http.get('getComment.php',{params: {id : $scope.id}})
        .success(function(data, status, headers, config){
            $scope.comments = data;
            console.log(data);
        })
        .error(function(data, status, headers, config){
            console.log(data);
        });
    }



}]);

app.factory('Poller', function($http, $timeout) {
    var data = { };
    var poller = function(){

        $http.get('getComment.php',{params: {id : $scope.id}})
            .success(function(data, status, headers, config){
                $scope.comments = data;
                console.log(data);
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });
    }


    function() {
        $http.get('data.json').then(function(r) {
            data.response = r.data;
            data.calls++;
            $timeout(poller, 1000);
        });

    };
    poller();

    return {
        data: data
    };
});


function dataCtrl($scope, $timeout, ClientContoller) {
    $scope.data = [];

    (function tick() {
        $scope.data = ClientContoller.poll(function(){
            $timeout(tick, 1000);
        });
    })();
};