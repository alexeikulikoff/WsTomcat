package WsTomcat;

import java.io.IOException;
import java.util.concurrent.atomic.AtomicBoolean;

import javax.websocket.Endpoint;
import javax.websocket.EndpointConfig;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;


@ServerEndpoint("/echoBasic")
public class Basic {
	
	 private WebSocketRunner webSocketRunner;
	 public static class Locker {
			public static  AtomicBoolean flag = new AtomicBoolean(false);
	 }
	 private void toggleThreadState( String msg ) {
	    	if (Locker.flag.get() && msg.equals("stop")) {
	    		Locker.flag.set(false);
	    		return;
	    	}
	    	if (!Locker.flag.get()  && msg.equals("start")) {
	    		synchronized(Locker.class) {
	    			Locker.class.notify();
	        		Locker.flag.set( true );
	    		}
	    		
	    	}
	  }
	 @OnOpen
	 public void onOpen(Session session) {
		
		 webSocketRunner = new WebSocketRunner( session );
		 Thread thread = new Thread( webSocketRunner );
		 thread.start();
	 }
	 @OnMessage
	 public void echoTextMessage(Session session, String msg) {
       
       	 toggleThreadState( msg );

	 }
	
}
