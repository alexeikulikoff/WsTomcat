import '../css/style.css'

const body = document.getElementsByTagName("body")[0]
const foreign = document.createElement("p")
const translate = document.createElement("p")



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

const Sound = (function () {
    var df = document.createDocumentFragment();
    return function Sound(src) {
        var snd = new Audio(src);
        df.appendChild(snd); // keep in fragment until finished playing
        snd.addEventListener('ended', function () {df.removeChild(snd);});
        snd.play();
        return snd;
    }
}());
// then do it


const updateGUI = ( msg )=>{
	
	if (!msg.phrase.includes(":")) return ;
	let arr = msg.phrase.split(":")
	
	foreign.innerHTML = arr[0]

	translate.innerHTML = '[ ' + arr[1] + ' ]'
	
//	audio.setAttribute("controls", "controls")
//	audio.setAttribute("autobuffer", "autobuffer")
//	audio.setAttribute("autoplay", "autoplay")

	var elem = document.getElementById("audio")
	
	if (typeof(elem) != 'undefined' && elem != null)
	{
 	   	console.log('audio exist')
		body.removeChild( elem )
	}
	
	const audio = document.createElement("audio")
	body.appendChild( audio )

	const url =  "data:audio/wav;base64," + msg.audio 
	
	audio.setAttribute("src",  url )
	audio.setAttribute("id",  "audio" )
	
	audio.addEventListener("canplaythrough", event => {
  		console.log('play')
 		 audio.play();
	});
	
	
	//var snd = Sound("data:audio/wav;base64," + msg.audio );
}


const createUI = () => {
	const startButton = document.createElement("button")
	startButton.innerHTML = "Start"
	startButton.classList.add('button')
	
	const stopButton = document.createElement("button")
	stopButton.innerHTML = "Stop"
	stopButton.classList.add('button')
	
	const nav = document.createElement("nav")
	const ul = document.createElement("ul")
	const li1 = document.createElement("li")
	const li2 = document.createElement("li")
	li1.appendChild(startButton)
	li2.appendChild(stopButton)
	ul.appendChild( li1 )
	ul.appendChild( li2 )
	nav.appendChild( ul )
	
	const container = document.createElement("div")
	container.classList.add('container')

	
	const header =  document.createElement("div")
	header.classList.add('header')
	
	const contentbody = document.createElement("div")
	contentbody.classList.add('content-body')
	contentbody.classList.add('content')
	
	
	const content  = document.createElement("main")
	content.classList.add('content')
	
	const text = document.createElement("div")
	
	text.style.position = "absolute";
	text.style.transform = "translate(-50%, -50%)";
	text.style.top = "50%";
	text.style.left = "50%";
	
	
	foreign.classList.add('foreign')
	translate.classList.add('translate')
	
	text.appendChild( foreign )
	text.appendChild( translate )
	
	content.appendChild( text )

	const footer = document.createElement("div")
	footer.classList.add('footer')
	
	contentbody.appendChild(content);
	header.appendChild(nav);
	container.appendChild(header)
	container.appendChild(contentbody)
	container.appendChild(footer)
	body.appendChild(container)
	
	
	startButton.addEventListener ("click", () => {
		connect().then(( socket)=> {
        	socket.onmessage = (event)=> {
				const msg = JSON.parse( event.data )
				updateGUI( msg )
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
}

	
createUI()

	
	