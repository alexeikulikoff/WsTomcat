import anime from 'animejs/lib/anime.es.js';
import '../css/style.css'

const body = document.getElementsByTagName("body")[0]
const foreign = document.createElement("p")
const native = document.createElement("p")

const win = window
const doc = document
const docElem = doc.documentElement

const x = win.innerWidth || docElem.clientWidth || body.clientWidth
const y = win.innerHeight|| docElem.clientHeight|| body.clientHeight

const initModel = {
	leftRight : {
		top : '50%' 
	}
}


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

	native.innerHTML =  arr[1] 

	var elem = document.getElementById("audio")
	
	if (typeof(elem) != 'undefined' && elem != null)
	{
		body.removeChild( elem )
	}
	
	const audio = document.createElement("audio")
	body.appendChild( audio )

	const url =  "data:audio/wav;base64," + msg.audio 
	
	audio.setAttribute("src",  url )
	audio.setAttribute("id",  "audio" )
	
	audio.addEventListener("canplaythrough", event => {
  		
 		 audio.play();
	});
	
}


const createUI = () => {
	const startButton = document.createElement("button")
	startButton.innerHTML = "Start"
	startButton.classList.add('button')
	
	const stopButton = document.createElement("button")
	stopButton.innerHTML = "Stop"
	stopButton.classList.add('button')
	
	
	const animateButton = document.createElement("button")
	animateButton.innerHTML = "Animate"
	animateButton.classList.add('button')
	
	const nav = document.createElement("nav")
	const ul = document.createElement("ul")
	const li1 = document.createElement("li")
	const li2 = document.createElement("li")
	const li3 = document.createElement("li")
	li1.appendChild(startButton)
	li2.appendChild(stopButton)
	li3.appendChild(animateButton)
	ul.appendChild( li1 )
	ul.appendChild( li2 )
	ul.appendChild( li3 )
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
	
	
	foreign.classList.add('foreign')
	native.classList.add('native')
	foreign.setAttribute('id', 'foreign')
	native.setAttribute('id', 'native')
	
    if ( process.env.NODE_ENV === 'development'){	
	
		foreign.innerHTML = 'retreat'
		native.innerHTML =  'come back' 
	}
	content.appendChild( foreign )

	content.appendChild( native )
	
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
	animateButton.addEventListener ("click", () => {
		
		const forRect = foreign.getBoundingClientRect();
		
		setTimeout(()=>{
			anime({
  				targets: '.foreign',
  				translateX: 0 ,
				translateY: y/2 
			})
		}, 100)
		
		setTimeout(()=>{
			anime({
  				targets: '.foreign',
  				translateX: x/2 
			})
		}, 200)
		setTimeout(()=>{
			anime({
  				targets: '.foreign',
  				translateX: x + forRect.width 
			})
		}, 2000)
		
		setTimeout(()=>{
			anime({
  				targets: '.foreign',
  				translateX: x/2, 
				translateY: - y/2
			})	
		}, 3000)
		setTimeout(()=>{
			anime({
  				targets: '.foreign',
				translateY: y/2 - 150
			})	
		}, 5000)
	
		setTimeout(()=>{
			anime({
  				targets: '.foreign',
				translateY: y +  forRect.height 
			})	
		}, 7500)
	
		
	})
	window.addEventListener("load", function(event) {
		console.log('locad')
    	const forRect = foreign.getBoundingClientRect();
		foreign.style.top  = -forRect.height + 'px'
		foreign.style.left = -forRect.width + 'px'
		native.style.top='350px'	

  	});
	
	
}

	
createUI()

	
	