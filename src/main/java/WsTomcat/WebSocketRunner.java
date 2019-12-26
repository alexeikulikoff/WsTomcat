package WsTomcat;


import java.io.ByteArrayInputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.websocket.Session;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;

import com.google.gson.Gson;

import WsTomcat.Basic.Locker;


public class WebSocketRunner implements Runnable{
	
	class Message {
		
		String phrase;
		String audio;
		public String getPhrase() {
			return phrase;
		}
		public void setPhrase(String phrase) {
			this.phrase = phrase;
		}
		public String getAudio() {
			return audio;
		}
		public void setAudio(String audio) {
			this.audio = audio;
		}
		@Override
		public String toString() {
			return "Message [phrase=" + phrase + ", audio=" + audio + "]";
		}
	}
	
	private List<String> list = new ArrayList<>();
	private Session session;
	
	
	public WebSocketRunner( Session session ) {
		this.session = session;
	}
	private static int randomRange(int min, int max) {

		if (min >= max) {
			throw new IllegalArgumentException("max must be greater than min");
		}

		Random r = new Random();
		return r.nextInt((max - min) + 1) + min;
	}

	private void initData(String fileName) {

		try (Stream<String> stream = Files.lines(Paths.get(fileName))) {
			list = stream.collect(Collectors.toList());
		}catch (IOException e) {
			e.printStackTrace();
		}
	}
	private void saveToFile(String word, DataInputStream dataInputStream) throws IOException {
		
		DataOutputStream dataOutputStream = new DataOutputStream(new FileOutputStream("/home/admin2/tmp/" + word + ".wav"));
		IOUtils.copy(dataInputStream, dataOutputStream);
		dataOutputStream.close();
		dataInputStream.close();
	}
	private String Audio2Base64( String word) {

		String result = null;
		try {
			String cmd[] = new String[] {"/bin/sh", "-c", "echo " +  word  +  " | /usr/bin/text2wave"} ;
			//String cmd[] = new String[] {"/usr/bin/espeak-ng","-v", "mb-us1", "-s", "140", "-p","75", word, "--stdout"} ;
			
			Process p1 = Runtime.getRuntime().exec( cmd );
			
			DataInputStream dataInputStream = new DataInputStream( p1.getInputStream() );
			
			byte[] bytes = IOUtils.toByteArray( dataInputStream );
			
			result = Base64.encodeBase64String(  bytes );
			
			InputStream targetStream = new ByteArrayInputStream( bytes );
			
			DataOutputStream dataOutputStream = new DataOutputStream(new FileOutputStream("/home/admin2/tmp/" + word + ".wav"));
			  
			IOUtils.copy(targetStream, dataOutputStream);
			
			
			dataInputStream.close();
			dataOutputStream.close();
	
			
		} catch (IOException e1) {
			
			e1.printStackTrace();
		}

		return  result;
		
	}
	
	@Override
	public void run() {
	  initData("/home/admin2/workspaces/mibs-cabinet/WsTomcat/vocabulary.txt.csv");
	   synchronized ( Locker.class ) {
		while(true) {
			
			int i = 0;
			while(Locker.flag.get()) {
				try {
					Thread.sleep(2500);
					try {
						String phrase = list.get( randomRange(0, list.size()-1 ));
						String word = phrase.contains(":") ? phrase.split(":")[0] : "";
						String audioBase64 = Audio2Base64(word);
						Message msg = new Message();
						msg.setAudio(audioBase64);
						msg.setPhrase(phrase);
						Gson g = new Gson();
						String str = g.toJson( msg );
					
						session.getBasicRemote().sendText( str );
						

					} catch (IOException e) {
						
						e.printStackTrace();
					}
					 
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			try {
				Locker.class.wait();
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
	   }
	}

}
