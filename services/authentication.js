firebaseapp.factory('Authentication', 
	['$rootScope', 
	'$firebaseAuth', 
	'$firebaseObject', 
	'$location', 
	'AuthenticationListener', 
	function($rootScope, $firebaseAuth, $firebaseObject, $location, AuthenticationListener){


	return {
		login: function(user) {
			firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(function() {
    			return firebase.auth().signInWithEmailAndPassword(user.email, user.password).then(function(firebaseUser) {
					// if (firebaseUser.emailVerified) {
						$location.path('/movie-search');
						$rootScope.$apply(function () {
						  $rootScope.message = "Welcome back, " + user.email + "!";
						  $rootScope.user = firebaseUser;
						  $rootScope.loggedin=true;
						  console.log(firebaseUser);
						});
						AuthenticationListener.getUser(firebaseUser);
					// } 
					// else {
					// 	$location.path('/login');
					// 	$rootScope.$apply(function () {
					// 		$rootScope.message = "Your Email address have not been verified yet.";
					// 	});
					// }
				}).catch(function(error) {
				$rootScope.$apply(function () {
					$rootScope.message = error.message;
				});
			  });
					
  			}).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;
 			});

		}, // login method

		reset: function(email) {
			// firebase.auth().verifyPasswordResetCode(code)
			// firebase.auth().confirmPasswordReset(code, newPassword).then(function(){
			// })
			firebase.auth().sendPasswordResetEmail(email).then(function(){
				$rootScope.$apply(function () {
			  		$rootScope.message = "Check your e-mail to reset your password.";
			  	});	
			}).catch(function(error) {
				$rootScope.$apply(function () {
			  		$rootScope.message = error.message;
			  	});	
			});
		},

		regist: function(user) {
			firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
		  	.then(function(firebaseUser){
			  	$rootScope.$apply(function () {
			  		$rootScope.message = "Hi " + user.logname + ", thanks for registering with this e-mail, " + user.email;
			  	});	
			  	var userId = firebaseUser.uid;
			  	var first = user.logname;
			  	var email = user.email;
			  	console.log(userId);
			  	
				firebase.database().ref('users/' + userId).set({
				    date: firebase.database.ServerValue.TIMESTAMP,
				    userId: userId,
				    name: first,
				    email: email,
				    verified: true
				  });

				// firebase.auth().currentUser.sendEmailVerification().then(function() {
		        // 	$rootScope.$apply(function () {
			  	// 		$rootScope.message = "Please, follow the link sent to your e-mail to complete your registration.";
			  	// 	});	

		     	//  });
				
			  	
			  	console.log(firebaseUser.email);
			  	console.log(user);	
			  	
			  	//return firebaseUser;
			  	
			  	
			  	$rootScope.$apply(function () {
			  		$location.path('/login'); 
			  	});
			  	

		  	}).catch(function(error) {

			  $rootScope.$apply(function () {
			  $rootScope.message = error.code + ": " + error.message;
			  });
			  // ...
			}); // createUser method
		}, // register method

		signout: function (user) {
			firebase.auth().signOut().then(function() {
			  $rootScope.$apply(function () {
			  	$rootScope.message =  "User " + user.email + " signed out successfully!";
				  $location.path('/login'); 
			  	$rootScope.user = {};
				  $rootScope.loggedin=false;
			  });
			  console.log(firebaseUser.email);
			  return firebaseUser;
			}, function(error) {
			  $rootScope.$apply(function () {
			  	$rootScope.message =  "Something went wrong";
			  });
			});			
		} // signout method

	}; // return
}]); // factory