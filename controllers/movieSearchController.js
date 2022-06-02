firebaseapp.controller('movieSearchController', ['$rootScope', '$scope', '$http', '$window', '$firebaseAuth',
    '$firebaseObject', 'Authentication', 'AuthenticationListener', function MyController($rootScope, $scope, $http, $window, $firebaseAuth, $firebaseObject, Authentication, AuthenticationListener) {
        var url2 = 'https://www.omdbapi.com/?apikey=6baa30c1&t=';
        var movieName = "";
        $scope.myVar = true;
        //calling API

        $scope.get_data = function () {
            $scope.hidePlaylist=true;
            var movieName = $scope.c;
            $scope.myVar = true;
            $scope.jsonObj2 = [];
            console.log(movieName);
            if (movieName == "") {
                $scope.c_data = undefined;
                return;
            }
            if (movieName.length > 0) {
                // searchList.classList.remove('hide-search-list');
                var URL = 'https://omdbapi.com/?s=' + movieName + '&page=1&apikey=6baa30c1';
                $http.get(`${URL}`)
                    .then(
                        (response) => {
                            console.log(response.data.Search);
                            // $scope.jsonObj.push(response.data.Search);
                            if (response.data.Response == "True") {
                                parseData(response.data);
                                console.log("Inside if");
                            }
                        },
                        (error) => {
                            console.log(error);
                        });

            } else {
                //searchList.classList.add('hide-search-list');
            }


        };
        $scope.card_data = function () {
            $scope.hidePlaylist=true;
            $scope.myVar=false;
            movieName = $scope.c;
            $scope.jsonObj = [];
            console.log(movieName);
            if (movieName == "") {
                $scope.c_data = undefined;
                return;
            }

            $http.get(`${url2}/${movieName}`)
                .then(
                    (response) => {
                        console.log(response.data);
                        $scope.jsonObj.push(response.data);
                        if (response.data.Response == "True") {
                            $scope.m_data = undefined;
                            $scope.c_data = response.data;
                            console.log("Inside if");
                        }
                        else {
                            $scope.c_data = undefined;
                            $scope.m_data = response.data.Response;
                            console.log("Inside else")
                        }
                    },
                    (error) => {
                        console.log(error);
                    });
        };
        function parseData(moviesData) {
            var movies = moviesData.Search;
            for (var idx = 0; idx < movies.length; idx++) {
                $scope.jsonObj2.push(movies[idx]);
                console.log(movies[idx]);
            }
        }
        $scope.card_data2 = function (searchterm) {
            $scope.hidePlaylist=true;
            console.log(searchterm);
            $scope.jsonObj = [];
            const url3 = 'https://www.omdbapi.com/?i=' + searchterm + '&apikey=6baa30c1';
            $http.get(`${url3}`)
                .then(
                    (response) => {
                        console.log(response.data);
                        $scope.jsonObj.push(response.data);
                        $scope.myVar = false;
                        if (response.data.Response == "True") {
                            $scope.m_data = undefined;
                            $scope.c_data = response.data;
                            console.log("Inside if");
                        }
                        else {
                            $scope.c_data = undefined;
                            $scope.m_data = response.data.Response;
                            console.log("Inside else")
                        }
                    },
                    (error) => {
                        console.log(error);
                    });

        };


        $rootScope.addToPlaylist = function (searchterm) {
            var title = "";
            var year = "";
            var genre = "";
            var actors = "";
            const url3 = 'https://www.omdbapi.com/?i=' + searchterm + '&apikey=6baa30c1';

            firebase.auth().onAuthStateChanged(function (firebaseUser) {
                if (firebaseUser) {

                    //console.log("AuthenticationListener: " + firebaseUser.uid);
                    firebase.database().ref('/Playlists/' + firebaseUser.uid).once('value').then(function (snapshot) {
                        var uid = snapshot.val().userId;

                        console.log(uid);
                        if (uid != undefined) {
                            var dataFromdb = snapshot.val().MovieData;
                            console.log(dataFromdb);
                            dataFromdb = dataFromdb + " " + searchterm;
                            firebase.database().ref('Playlists/' + uid).set({
                                date: firebase.database.ServerValue.TIMESTAMP,
                                userId: uid,
                                MovieData: dataFromdb
                            });
                            $rootScope.$apply(function () {
                                $rootScope.message = "Movie Added to Playlist";                          
                              });
                              if(searchterm)
                              Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                title: 'Movie Added To Playlist',
                                showConfirmButton: false,
                                timer: 1500
                              })
                              searchterm="";
                        }

                    }).catch(function (error) {
                        var userId = $rootScope.user.uid;
                        firebase.database().ref('Playlists/' + userId).set({
                            date: firebase.database.ServerValue.TIMESTAMP,
                            userId: userId,
                            MovieData: searchterm
                        });
                        $rootScope.$apply(function () {
                            $rootScope.message = error.message;
                            Swal.fire({
                                position: 'top-end',
                                icon: 'error',
                                title: 'Unable to add movie to Playlist\n please try in few seconds',
                                showConfirmButton: false,
                                timer: 1500
                              })
                        });
                    });
                } else {
                    // No user is signed in.
                    // $rootScope.$apply(function () {
                    // 	$scope.message = "";
                    // });
                    console.log("please sign in");
                }
            });





        };

        $rootScope.init = function () {
            $scope.hidePlaylist=false;
            $rootScope.jsonObj3 = [];

            // var userId = $rootScope.user.uid;
            var title = "";
            var year = "";
            var genre = "";
            var actors = "";
            firebase.auth().onAuthStateChanged(function (firebaseUser) {
                if (firebaseUser) {

                    //console.log("AuthenticationListener: " + firebaseUser.uid);
                    firebase.database().ref('/Playlists/' + firebaseUser.uid).once('value').then(function (snapshot) {
                        var uid = snapshot.val().userId;
                        console.log(uid);
                        if (uid != undefined) {
                            var dataFromdb = snapshot.val().MovieData;
                            console.log(dataFromdb);
                            var imdbIdArray = dataFromdb.split(" ");

                            function removeDuplicates(arr) {
                                return arr.filter((item,
                                    index) => arr.indexOf(item) === index);
                            }

                            console.log(removeDuplicates(imdbIdArray));
                            imdbIdArray = removeDuplicates(imdbIdArray);
                            for (var i = 0; i < imdbIdArray.length; i++) {
                                console.log(i + " " + imdbIdArray.length);
                                console.log(imdbIdArray[i])
                                const url3 = 'https://www.omdbapi.com/?i=' + imdbIdArray[i] + '&apikey=6baa30c1';

                                $http.get(`${url3}`)
                                    .then(
                                        (response) => {
                                            console.log(response.data);
                                            console.log(response.data.Title);
                                            title = response.data.Title;
                                            year = response.data.Year;
                                            genre = response.data.Genre;
                                            actors = response.data.Actors;

                                            // $rootScope.myVar=false;
                                            if (response.data.Response == "True") {
                                                $rootScope.jsonObj3.push(response.data);

                                                console.log("Inside if");
                                            }
                                            else {

                                                console.log("Inside else")
                                            }
                                        },
                                        (error) => {
                                            console.log(error);
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
                    console.log("please sign in");
                }
            });
        };
        $rootScope.deleteFromPlaylist=function(searchterm){
            console.log("item to be deleted =>"+searchterm);
            firebase.auth().onAuthStateChanged(function (firebaseUser) {
                if (firebaseUser) {

                    //console.log("AuthenticationListener: " + firebaseUser.uid);
                    firebase.database().ref('/Playlists/' + firebaseUser.uid).once('value').then(function (snapshot) {
                        var uid = snapshot.val().userId;
                        console.log(uid);
                        if (uid != undefined) {
                            var dataFromdb = snapshot.val().MovieData;
                            console.log(dataFromdb);
                            var imdbIdArray = dataFromdb.split(" ");

                            function removeDuplicates(arr) {
                                return arr.filter((item,
                                    index) => arr.indexOf(item) === index);
                            }

                            console.log(removeDuplicates(imdbIdArray));
                            imdbIdArray = removeDuplicates(imdbIdArray);
                            for( var i = 0; i < imdbIdArray.length; i++){ 
    
                                if ( imdbIdArray[i] === searchterm) { 
                        
                                    imdbIdArray.splice(i, 1); 
                                    console.log("item removed "+imdbIdArray)
                                }
                            
                            }
                            dataFromdb=imdbIdArray.join(" ");
                            firebase.database().ref('Playlists/' + uid).set({
                                date: firebase.database.ServerValue.TIMESTAMP,
                                userId: uid,
                                MovieData: dataFromdb
                            });
                            $rootScope.init();

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
                    console.log("please sign in");
                }
            });
        }
    }]);
