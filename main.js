function jsonPost(url, data) {
    return new Promise((resolve, reject) => {
        var x = new XMLHttpRequest();   
        x.onerror = () => reject(new Error('jsonPost failed'))
        //x.setRequestHeader('Content-Type', 'application/json');
        x.open("POST", url, true);
        x.send(JSON.stringify(data))

        x.onreadystatechange = () => {
            if (x.readyState == XMLHttpRequest.DONE && x.status == 200){
                resolve(JSON.parse(x.responseText))
            }
            else if (x.status != 200){
                reject(new Error('status is not 200'))
            }
        }
    })
}

var send = document.getElementById('send');
send.onclick = function sendMessage(){
    var newMessage = {
        func: "addMessage",
        nick: nick.value,
        message: document.getElementById("message").value
    }
    jsonPost("http://students.a-level.com.ua:10012", newMessage)
};

var nextMesId = 0;

// var smiles = {
//     ":-)": "ссылка",
//     ":-(": "ссылка",
//     ":-/": "ссылка",
// } через replace
// два подхода: 
    // проверять при отправке (и тогда будет видно у всех)
    // фильтровать все сообщения которые приходят 
   // img.src и ссылка на картинку   - вставка картинки
   // видео - регулярные выражения:общая ссылка - это ключ потом ифрем

function receiving(){
    var history = {
                func: "getMessages",
                messageId: nextMesId
            }; 

jsonPost("http://students.a-level.com.ua:10012", history)
  .then(
    response => {
        var lMess = document.getElementById('loadMessages');

        for(i = 0; i <  response.data.length; i++){
            item = response.data[i];
            var p = document.createElement("P");

            var tt = item["timestamp"];
			var date = new Date();
			date.setTime(tt);
			var hours = date.getHours(); //(hours.length == 2 ? date.getHours() : "0" + date.getHours());
			var minutes = date.getMinutes(); //(minutes.length == 2 ? date.getMinutes() : "0" + date.getMinutes());

  			var text = document.createTextNode("(" + hours + ":" + minutes +") "  + item["nick"] + ": " + item["message"]);
  			p.appendChild(text);
  			lMess.insertBefore(p, lMess.firstChild);
        };
        nextMesId = response.nextMesId;
    });
  }
setInterval(receiving, 3000);







