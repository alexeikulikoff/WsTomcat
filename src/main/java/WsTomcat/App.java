/*
 * This Java source file was generated by the Gradle 'init' task.
 */
package WsTomcat;

import java.io.File;

import org.apache.catalina.Context;
import org.apache.catalina.LifecycleException;
import org.apache.catalina.servlets.DefaultServlet;
import org.apache.catalina.startup.Tomcat;

public class App {
    public String getGreeting() {
        return "Hello world.";
    }

    public static void main(String[] args) throws LifecycleException {
    	
    	Tomcat tomcat = new Tomcat();
 	    tomcat.setPort(8090);
 	    tomcat.getConnector();
 	    
       
        tomcat.addWebapp("/app", new File("src/main/resources/templates").getAbsolutePath()); 
        tomcat.addWebapp("/js", new File("src/main/resources/static/js").getAbsolutePath());
        tomcat.addWebapp("/css", new File("src/main/resources/static/css").getAbsolutePath());
        
        
        Context ctx = tomcat.addContext("", null);
        ctx.addApplicationListener(MyWsConfig.class.getName());
        Tomcat.addServlet(ctx, "default", new DefaultServlet());
        ctx.addServletMappingDecoded("/", "default");
 	    
        tomcat.start();
        tomcat.getServer().await();
       
    }
}
