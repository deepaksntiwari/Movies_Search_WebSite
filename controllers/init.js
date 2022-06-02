firebaseapp.controller('InitController', ['$rootScope', '$scope', '$http', '$window', '$firebaseAuth',
    '$firebaseObject', 'Authentication', 'AuthenticationListener','$location', function MyController($rootScope, $scope, $http, $window, $firebaseAuth, $firebaseObject, Authentication, AuthenticationListener,$location) {

        $scope.message = "";
        $rootScope.showPlaylist = function () {
            $rootScope.jsonObj4 = [];
            $scope.hidePlaylist=false;
            // var userId = $rootScope.user.uid;
            var title = "";
            var year = "";
            var genre = "";
            var actors = "";
            firebase.auth().onAuthStateChanged(function (firebaseUser) {
                if (firebaseUser) {

                    //////console.log("AuthenticationListener: " + firebaseUser.uid);
                    firebase.database().ref('/Playlists/' + firebaseUser.uid).once('value').then(function (snapshot) {
                        var uid = snapshot.val().userId;
                        ////console.log(uid);
                        if (uid != undefined) {
                            var dataFromdb = snapshot.val().MovieData;
                            ////console.log(dataFromdb);
                            var imdbIdArray = dataFromdb.split(" ");

                            function removeDuplicates(arr) {
                                return arr.filter((item,
                                    index) => arr.indexOf(item) === index);
                            }

                            ////console.log(removeDuplicates(imdbIdArray));
                            imdbIdArray = removeDuplicates(imdbIdArray);
                            for (var i = 0; i < imdbIdArray.length; i++) {
                                ////console.log(i + " " + imdbIdArray.length);
                                ////console.log(imdbIdArray[i])
                                const url3 = 'https://www.omdbapi.com/?i=' + imdbIdArray[i] + '&apikey=6baa30c1';

                                $http.get(`${url3}`)
                                    .then(
                                        (response) => {
                                            ////console.log(response.data);
                                            ////console.log(response.data.Title);
                                            title = response.data.Title;
                                            year = response.data.Year;
                                            genre = response.data.Genre;
                                            actors = response.data.Actors;

                                            // $rootScope.myVar=false;
                                            if (response.data.Response == "True") {
                                                $rootScope.jsonObj4.push(response.data);

                                                ////console.log("Inside if");
                                            }
                                            else {

                                                //////console.log("Inside else")
                                            }
                                        },
                                        (error) => {
                                            ////console.log(error);
                                        });



                            }

                        }

                    }).catch(function (error) {
                        $rootScope.$apply(function () {
                            $rootScope.message = error.message;
                        });
                    });
                } else {
                    // No user is signed in.
                    // $rootScope.$apply(function () {
                    // 	$scope.message = "";
                    // });
                    ////console.log("please sign in");
                }
            });
        };
        $rootScope.deleteFromPlaylist2=function(searchterm){
            ////console.log("item to be deleted =>"+searchterm);
            firebase.auth().onAuthStateChanged(function (firebaseUser) {
                if (firebaseUser) {

                    //////console.log("AuthenticationListener: " + firebaseUser.uid);
                    firebase.database().ref('/Playlists/' + firebaseUser.uid).once('value').then(function (snapshot) {
                        var uid = snapshot.val().userId;
                        ////console.log(uid);
                        if (uid != undefined) {
                            var dataFromdb = snapshot.val().MovieData;
                            ////console.log(dataFromdb);
                            var imdbIdArray = dataFromdb.split(" ");

                            function removeDuplicates(arr) {
                                return arr.filter((item,
                                    index) => arr.indexOf(item) === index);
                            }

                            ////console.log(removeDuplicates(imdbIdArray));
                            imdbIdArray = removeDuplicates(imdbIdArray);
                            for( var i = 0; i < imdbIdArray.length; i++){ 
    
                                if ( imdbIdArray[i] === searchterm) { 
                        
                                    imdbIdArray.splice(i, 1); 
                                    ////console.log("item removed "+imdbIdArray)
                                }
                            
                            }
                            dataFromdb=imdbIdArray.join(" ");
                            firebase.database().ref('Playlists/' + uid).set({
                                date: firebase.database.ServerValue.TIMESTAMP,
                                userId: uid,
                                MovieData: dataFromdb
                            });
                            $rootScope.showPlaylist();


                        }

                    }).catch(function (error) {
                        $rootScope.$apply(function () {
                            $rootScope.message = error.message;
                        });
                    });
                } else {
                    // No user is signed in.
                    // $rootScope.$apply(function () {
                    // 	$scope.message = "";
                    // });
                    ////console.log("please sign in");
                }
            });
        }

    }]);
