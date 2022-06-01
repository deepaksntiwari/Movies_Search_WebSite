firebaseapp.factory('AuthenticationListener', ['$rootScope', '$firebaseAuth', '$firebaseObject', function($rootScope, $firebaseAuth, $firebaseObject){

return {
    getUser: function(firebaseUser) {
        firebase.auth().onAuthStateChanged(function(firebaseUser) {
            if (firebaseUser) {

                //console.log("AuthenticationListener: " + firebaseUser.uid);
    			firebase.database().ref('/users/' + firebaseUser.uid).once('value').then(function(snapshot) {
    			  var userfirst = snapshot.val().name;
                  var useremail = snapshot.val().email;
                  var timestamp = snapshot.val().date;
    			  console.log(userfirst);
    			         $rootScope.$apply(function () {
                            $rootScope.user = {
                            date: new Date(timestamp).getDate() + "/" + (new Date(timestamp).getMonth()+1) + "/" + new Date(timestamp).getFullYear(), 
                            name: userfirst,
                            email: useremail,
                            uid : snapshot.val().userId,
                            };
    		  	         });
                           $rootScope.loggedin=true;
    			  // ...
    			});

            } else {
                // No user is signed in.
                // $rootScope.$apply(function () {
                // 	$scope.message = "";
                // });
                $rootScope.loggedin=false;
            }
        });
    } // evento
}; // return


}]); // factory