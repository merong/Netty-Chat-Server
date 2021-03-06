//LoginController.js


angular.module("chatApp").controller("LoginController", function($scope,$state, $http, websockets) {
    var aurl = "http://localhost:8080";
    $scope.error = false;
    $scope.errorText = "Error!";

    $scope.login = function() {

        var builder = new flatbuffers.Builder(1024);

        var nameData = builder.createString($scope.username);
        var pwData = builder.createString($scope.password);

        $scope.password = "";


        Schema.Credentials.startCredentials(builder);
        Schema.Credentials.addUsername(builder, nameData);
        Schema.Credentials.addPassword(builder, pwData);

        var cred = Schema.Credentials.endCredentials(builder);

        Schema.Message.startMessage(builder);
        Schema.Message.addDataType(builder, Schema.Data.Credentials);
        Schema.Message.addData(builder, cred);

        var data = Schema.Message.endMessage(builder);
        builder.finish(data);

        var credBytes = builder.asUint8Array();

        var config = {'Content-Type': 'application/x-www-form-urlencoded'};

        $http({
            method: 'post',
            url: aurl,
            data: credBytes,
            headers: config,
            responseType: "arraybuffer",
            transformRequest: []
        }).then(function (response) {

            var bytes = new Uint8Array(response.data);

            var buf = new flatbuffers.ByteBuffer(bytes);
            var msg = Schema.Message.getRootAsMessage(buf);

            var dataType = msg.dataType();

            if (dataType == Schema.Data.Auth) {
                console.log("got auth packet from server");
                var auth = msg.data(new Schema.Auth()).verified();
                var ticket = msg.data(new Schema.Auth()).ticket();

                if (auth) {
                    console.log("got auth");
                }
                console.log("[LoginController] ticket: ", ticket);
            } 
            else {
                console.log("dataType was ", dataType);
                console.log("got unknown stuff, here it is: ", response.data);
            }
            websockets.setTicket(ticket);

            websockets.connect();

            websockets.setUsername($scope.username);
            $scope.username = "";

            var socket = websockets.getSocket();
            
            socket.addEventListener("open", function(event) {
                console.log('[LoginController] Handshake complete');
                $state.go('chat');
            });

        }, function (error) {
            $scope.error = true;
            switch(error.status) {
                case -1:
                  console.log("Couldn't establish connection to the server!");
                  $scope.errorText = "Couldn't establish connection to the server!";
                  break;
                case 401:
                  $scope.errorText = "Invalid username/password combination!";
                  break;
                default:
                  console.log("Unk error");
                  console.log("Errorcode: " + error.status);
                  $scope.errorText = "ERROR";
                  break;
            }



        });
    }
});