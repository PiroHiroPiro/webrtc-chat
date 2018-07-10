
// 定数宣言
var APIKEY = 'SKYWAY_API_KEY';
var conn;     // データ通信用connectionオブジェクトの保存用変数

// SkyWayのシグナリングサーバーへ接続する  (APIキーを置き換える必要あり）
var peer = new Peer({ key: APIKEY, debug: 3});

// シグナリングサーバへの接続が確立したときに、このopenイベントが呼ばれる
peer.on('open', function(){
    // 自分のIDを表示する
    // - 自分のIDはpeerオブジェクトのidプロパティに存在する
    // - 相手はこのIDを指定することで、通信を開始することが出来る
    $('#my-id').text(peer.id);
    $('#MySpeakerID').text(peer.id);
});

// 相手からデータ通信の接続要求イベントが来た場合、このconnectionイベントが呼ばれる
// - 渡されるconnectionオブジェクトを操作することで、データ通信が可能
peer.on('connection', function(connection){
  　
    // データ通信用に connectionオブジェクトを保存しておく
    conn = connection;

    // 接続が完了した場合のイベントの設定
    conn.on('open', function() {
        // 相手のIDを表示する
        // - 相手のIDはconnectionオブジェクトのidプロパティに存在する
        $('#peer-id').text(conn.id);
        writeMessage('Peer', conn.id + 'が入室しました。');
    });

    // メッセージ受信イベントの設定
    conn.on('data', onRecvMessage);

    // 接続が切れた時に表示
    conn.on('close', function(){
        $('#peer-id').text('---');
        writeMessage('Peer', conn.id + 'が退室しました。');
        console.log("3");
    })
});

// メッセージ受信イベントの設定
function onRecvMessage(data) {
    // 画面に受信したメッセージを表示
    // $('#messages').append($('<p>').text(conn.id + ': ' + data).css('font-weight', 'bold'));
    writeMessage(conn.id, data);
}

// DOM要素の構築が終わった場合に呼ばれるイベント
// - DOM要素に結びつく設定はこの中で行なう
$(function() {

    // Connectボタンクリック時の動作
    $('#connect').click(function() {
        // 接続先のIDをフォームから取得する
        var peer_id = $('#peer-id-input').val();

        // 相手への接続を開始する
        conn = peer.connect(peer_id);

        // 接続が完了した場合のイベントの設定
        conn.on('open', function() {
            // 相手のIDを表示する
            // - 相手のIDはconnectionオブジェクトのidプロパティに存在する
            $('#peer-id').text(conn.id);
            writeMessage('Peer', conn.id + 'が入室しました。');
        });

        // メッセージ受信イベントの設定
        conn.on('data', onRecvMessage);
    });

    // Sendボタンクリック時の動作
    $('#send').click(function() {
        // 送信テキストの取得
        var message = $('#message').val();

        // 送信
        conn.send(message);

        // 自分の画面に表示
        // $('#messages').append($('<p>').html(peer.id + ': ' + message));
        writeMessage(peer.id, message);

        // 送信テキストボックスをクリア
        $('#message').val('');
    });

    // Closeボタンクリック時の動作
    $('#close').click(function() {
        conn.close();
        $('#peer-id').text('---');
        writeMessage('Peer', conn.id + 'が退室しました。');
        console.log("4");
    });
});

function writeMessage(id, msg) {
    var rowDiv = $('<div>', {'class': 'row comment'});
    if(id == "Peer"){
        rowDiv.append($('<div>', {'class': 'col-xs-4 ellipsis color_blue', text: id}));
    }else if(id == peer.id){
        rowDiv.append($('<div>', {'class': 'col-xs-4 ellipsis color_green', text: id}));
    }else{
        rowDiv.append($('<div>', {'class': 'col-xs-4 ellipsis', text: id}));
    }
    rowDiv.append($('<div>', {'class': 'col-xs-8 three-line-ellipsis', text: msg}));
    $('#messages').prepend(rowDiv);
}

function connect(){
  //EnterキーならSubmit
  if(window.event.keyCode==13)document.getElementById('connect').click();
}

function send(){
  //EnterキーならSubmit
  if(window.event.keyCode==13)document.getElementById('send').click();
}
