angular.module('starter.controllers', [])

    .controller('DashCtrl', ["$scope", "$firebaseArray", function ($scope, $firebaseArray, $state, $rootScope) {
        var baseref = new Firebase('https://blistering-heat-8225.firebaseio.com/');
        var ref = new Firebase('https://blistering-heat-8225.firebaseio.com/Todo');
        var todos = $firebaseArray(ref);
        $scope.todo = [];
        
        // $scope.submitTodo = function(todo) {
        //     // var dateOut = new Date(todo.datee).toString();
        //     var dateOut = $filter('date')(new Date(todo.TodoDate), 'dd/MM/yyyy');
        //     var timeOut = $filter('date')(new Date(todo.TodoTime), 'HH:mm:ss');

        //    var ref = new Firebase('https://blistering-heat-8225.firebaseio.com/Todo');
        //     var todos = $firebaseArray(ref);
        //     console.log("....." + $rootScope.user);
        //     ref.child("user").on("child_added", function(snapshot) {
        //         $rootScope.currentToDo = snapshot.key()
        //     });

        //     todos.$add({
        //         'TodoName': todo.TodoName,
        //         'TodoDate': dateOut,
        //         'TodoTime': timeOut,
        //         'TodoPriority':todo.TodoPriority,
        //         'user_id': $rootScope.currentToDo
        //     });
        //     $state.go("tab.chats");
        // };

        
        $scope.submitTodo = function (todo) {
           
            if (todo.TodoName === undefined || todo.TodoName === null || todo.TodoName === "" ||
                todo.TodoTime === undefined || todo.TodoTime === null || todo.TodoTime === "" ||
                todo.TodoPriority === undefined || todo.TodoPriority === null || todo.TodoPriority === "" ||
                todo.TodoDate === undefined || todo.TodoDate === null || todo.TodoDate === "") {
                alert('Please fill all the details');
            }

            else {
                console.log("in else");
             
                //   ref.child('user').child(fbAuth.uid).child
                // var ref= new Firebase(ref+'posts');
                //    var newRef = ref.push();
                //    $scope.createdKey = newRef.name();
                  
             
                baseref.child('user').on("child_added", function (snapshot) {
                    $rootScope.currentId = snapshot.key();
                    
                })

                todos.$add({
                    TodoName: todo.TodoName,
                    TodoTime: todo.TodoTime.toString(),
                    TodoPriority: todo.TodoPriority,
                    TodoDate: todo.TodoDate.toString(),
                    user_created: $rootScope.currentId


                })
                console.log('create successfully.');
            };
        };

    }])


////////////////////////////chat controller/////////////////////////

    .controller('ChatsCtrl', function ($scope, $firebaseArray, $state) {
        var ref = new Firebase("https://blistering-heat-8225.firebaseio.com/");
        $scope.todo = [];
        $scope.show = function (todo) {
            ref.child('Todo').on("child_added", function (snapshot) {
                console.log(snapshot.val());
                $scope.todo.push(snapshot.val());
                
                // $state.go('tab.detail');
                
            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            });

        }
    })
       
       

/////////////////////chat details///////////////////

    // .controller('ChatDetailCtrl', function ($scope, $firebaseArray, $state) {

    //     var ref = new Firebase("https://blistering-heat-8225.firebaseio.com/");
    //     $scope.todo = [];
    //     $scope.show = function (todo) {
    //         ref.child('Todo').on("child_added", function (snapshot) {
    //             console.log(snapshot.val());
    //             $scope.todo.push(snapshot.val());
    //         }, function (errorObject) {
    //             console.log("The read failed: " + errorObject.code);
    //         });
    //     }
    // })
    
    
///////////////////////account controller//////////////////////

    .controller('AccountCtrl', function ($scope, $firebaseArray, $location,
        $timeout, $ionicActionSheet, $cordovaCamera, $state, $firebase) {

        var ref = new Firebase('https://blistering-heat-8225.firebaseio.com/user');
        var register = $firebaseArray(ref);

        $scope.login = true;
        $scope.register = false;

        $scope.showLogin = function () {
            $scope.login = true;
            $scope.register = false;
        }

        $scope.showRegister = function () {
            $scope.register = true;
            $scope.login = false;
        }

        $scope.showLogout = function () {
            $scope.register = false;
            $scope.login = false;
            $scope.logout = true;
        }

        //////////////////////////////////////////////////////////////
        //login
        /////////////////////////////////////////////////////////////////////

        $scope.loginUser = function (data) {

            if (data.username === undefined || data.username === null || data.username === " "
                || data.password === undefined || data.password === null || data.password === " ") {
                alert("Please fill all the details");
            }
            else {
                ref.authWithPassword({
                    email: data.username,
                    password: data.password
                }, function (error, authData) {
                    if (error) {
                        console.log("Login Failed!", error);
                    } else {
                        console.log("Authenticated successfully with payload:", authData);
                        $state.go("tab.chats");
                    }
                });
            };

        };
     

        //////////////////////////////////////////////////////////////////////////
        //register
        //////////////////////////////////////////////////////////
    
        $scope.registerUser = function (data) {
            if (data.user === undefined || data.user === null || data.user === "" ||
                data.password === undefined || data.password === null || data.password === "") {
                alert('Please fill all the details');
            }

            else {               
                //add user
                register.$add({
                    "Username": data.user,
                    "Name": data.name,
                    "Mobile": data.mobile,
                    "Age": data.age,
                })
                //create user        
                ref.createUser({
                    email: data.user,
                    password: data.password,
                },
                    function (error, userData) {
                        if (error) {
                            console.log('error creating user:', error);
                        }
                        else {
                            console.log('successfully create user:', userData.uid);
                            alert("Register successfully.");
                            $scope.login = true;
                            $scope.register = false;
                            $state.go('tab.account');

                        }
                    })

            }

        };

        //********************** Action sheet ******************************** 
        $scope.show = function () {
            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: ' Upload From Gallery ' },
                    { text: ' Upload From Camera ' }
                ],
                titleText: ' Choose Photo',
                cancelText: 'Cancel',
                cancel: function () {
                    // add cancel code..
                },
                buttonClicked: function (index) {
                    if (index == 0) {
                        $scope.choosePhoto();

                    }
                    else if (index == 1) {
                        $scope.takePhoto();
                    }
                    else {
                        console.log('BUTTON CLICKED', index);
                    }
                    return true;
                }
            });

            // For example's sake, hide the sheet after two seconds
            $timeout(function () {
                hideSheet();
            }, 2000);

        };
        //********************* camera plug-in code *********************
        $scope.takePhoto = function () {
            // alert("takePhoto");
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function (imageData) {
                $scope.imgURI = "data:image/jpeg;base64," + imageData;
            }, function (err) {
                // An error occured. Show a message to the user
            });
        };
        //---------------------------------------
        $scope.choosePhoto = function () {
            //alert("choosePhoto");
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function (imageData) {
                $scope.imgURI = "data:image/jpeg;base64," + imageData;
            }, function (err) {

                alert("error occured");
                // An error occured. Show a message to the user
            });
        };



    });