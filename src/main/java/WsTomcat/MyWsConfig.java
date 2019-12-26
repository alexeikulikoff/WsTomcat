package WsTomcat;

import javax.servlet.ServletContextEvent;
import javax.websocket.DeploymentException;
import javax.websocket.server.ServerContainer;
import org.apache.tomcat.websocket.server.Constants;

import org.apache.tomcat.websocket.server.WsContextListener;


public class MyWsConfig extends WsContextListener{
	  
	   @Override
       public void contextInitialized(ServletContextEvent sce) {
           super.contextInitialized(sce);
           ServerContainer sc =(ServerContainer)
        		   					sce.getServletContext().getAttribute( Constants.SERVER_CONTAINER_SERVLET_CONTEXT_ATTRIBUTE);
           try {
             
               sc.addEndpoint(Basic.class);
           
           } catch (DeploymentException e) {
               throw new IllegalStateException(e);
           }
	   } 
}
