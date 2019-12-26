import '../css/style.css'
import '../css/bootstrap.min.css'

let socket ;
const connect = ()=> {
    const promise =  new Promise((resolve, reject)=> {
         socket = new WebSocket('ws://localhost:8090/echoBasic')
	     socket.onopen = function() {
			   socket.send("start")	
	           resolve(socket)
	       }
	     socket.onerror = function(err) {
	           reject(err)
	       }
	
    })
	return promise
}

const startButton = document.createElement("button")
startButton.innerHTML = "Start"
startButton.classList.add('button')
const body = document.getElementsByTagName("body")[0]
body.appendChild(startButton);

const stopButton = document.createElement("button")
stopButton.innerHTML = "Stop"
stopButton.classList.add('button')
body = document.getElementsByTagName("body")[0]
body.appendChild(stopButton);


startButton.addEventListener ("click", () => {
	connect().then(( socket)=> {
        socket.onmessage = (event)=> {
			console.log('get message ' +  event.data)
		};
		socket.onclose = (event)=>{
			console.log('close websocket')
		}
	}).catch(function(err) {
		console.log(err)
		
	})
})

stopButton.addEventListener ("click", () => {
	socket.send("stop")
})


	


	
	