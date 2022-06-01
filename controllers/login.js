firebaseapp.controller('LoginController', ['$rootScope', '$scope', 'Authentication', 'AuthenticationListener', function($rootScope, $scope, Authentication, AuthenticationListener) {

	  AuthenticationListener.getUser($rootScope.user);
	
	  $scope.login = function() {
	  	Authentication.login($scope.user);
	  }; // login function

	  $scope.regist = function() {
	  	Authentication.regist($scope.user); 
	  }; // register function   

	  $scope.signout = function() {
	  	Authentication.signout($scope.user);
	  }; // signout function

	  $scope.reset = function() {
	  	Authentication.reset($scope.user.email);
	  }; // reset function

}]); // LoginController