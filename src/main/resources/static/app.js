var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    //说明：如果在不跨域访问，new SockJS('/gs-guide-websocket')即可，而跨域的话使用ws(s)|http(s)://{ip}:{port}/gs-guide-websocket访问
    // var socket = new SockJS('/gs-guide-websocket');
    var socket = new SockJS('ws://127.0.0.1:8080/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/greetings', function (greeting) {
            showGreeting(JSON.parse(greeting.body).content);
        });
    });
}
function formSubmit() {
    //简单的ajax表单提交，会触发服务器主动推送，跨域访问的话记得改写url
    console.log("form submit");
    $.ajax({
        url:'call_ws',
        data:{'name': $("#name").val()}
    })
}
function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    stompClient.send("/app/hello", {}, JSON.stringify({'name': $("#name").val()}));
}

function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
    $( "#post" ).click(function() { formSubmit(); });
});

