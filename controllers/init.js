firebaseapp.controller('InitController', ['$rootScope','$scope', '$http', '$window','$firebaseAuth', 
'$firebaseObject', 'Authentication', 'AuthenticationListener', function MyController($rootScope,$scope, $http, $window,$firebaseAuth, $firebaseObject, Authentication, AuthenticationListener) {
     

   $scope.message = "";
   $rootScope.showPlaylist=function(){
      $rootScope.jsonObj4 = [];

      var userId = $rootScope.user.uid;
      var title =  "";
      var year =   "";
      var genre=   "";
      var actors=  "";        
      firebase.auth().onAuthStateChanged(function(firebaseUser) {
          if (firebaseUser) {

              //console.log("AuthenticationListener: " + firebaseUser.uid);
              firebase.database().ref('/Playlists/' + firebaseUser.uid).once('value').then(function(snapshot) {
                var uid = snapshot.val().userId;
                console.log(uid);
                if(uid!=undefined){
                    var dataFromdb =snapshot.val().MovieData;
                    console.log(dataFromdb);
                    var imdbIdArray = dataFromdb.split(" ");
                    for(var i = 0; i < imdbIdArray.length; i++){
                        console.log(i+" "+imdbIdArray.length);
                        console.log(imdbIdArray[i])
                      const url3='https://www.omdbapi.com/?i='+imdbIdArray[i]+'&apikey=6baa30c1';

$http.get(`${url3}`)
          .then(
              (response) => {
                  console.log(response.data);
                  console.log(response.data.Title);
                  title=response.data.Title;
                  year=response.data.Year;
                  genre=response.data.Genre;
                  actors=response.data.Actors;

                  // $rootScope.myVar=false;
                  if(response.data.Response=="True"){
                      $rootScope.jsonObj4.push(response.data);

                      console.log("Inside if");
                  }
                  else{
                     
                      console.log("Inside else")
                  }
              },
              (error) => {
                  console.log(error);
              });



                  }

                  }
                      
              }).catch(function(error) {
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
        
}]);
