package WsTomcat;


import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.UnknownHostException;
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


import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;

import com.google.gson.Gson;
import com.sun.jersey.core.util.Base64;

import WsTomcat.Basic.Locker;

import it.sauronsoftware.jave.*;
//import com.sun.jersey.core.util.Base64;


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
	
	private Optional<String> Audio2Base64Client(String message) {
		
		  Optional<String> result;
		  Client client = null;
		  byte [] wave = null;
		  try {
			client = new Client(1314);
			wave = client.StringToWave(message,"wav");
			Optional<byte[]> mp3 = convertToMp3(wave);
			result = mp3.isPresent() ? Optional.of( new String(Base64.encode(mp3.get())) ) : Optional.empty();
		  
		  } catch ( IOException e) {
			  System.out.println("Client error : " + e.getMessage());  	
			  return Optional.empty();
		  }
		  finally {
			  client.disconnect();
		  }
		  return result;
	}
	/* 	private String Audio2Base64( String word) {

		String result = null;
		try {
		//	String cmd[] = new String[] {"/bin/sh", "-c", "echo " +  word  +  " | /usr/bin/text2wave"} ;
			String cmd[] = new String[] {"/usr/bin/espeak-ng","-v", "mb-us1", "-s", "140", "-p","75", word, "--stdout"} ;
			
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
	*/
	  private Optional<byte[]> convertToMp3(byte[] wave){
			FileInputStream fis = null;
			ByteArrayOutputStream bos = null;
			byte [] mp3 = null;
	    	File tempwav = null, tempmp3 = null;
	    	AudioAttributes audio = new AudioAttributes();
		    audio.setCodec("libmp3lame");
		    audio.setBitRate(new Integer(128000));
		    audio.setChannels(new Integer(2));
		    audio.setSamplingRate(new Integer(44100));
		    EncodingAttributes attrs = new EncodingAttributes();
		    attrs.setFormat("mp3");
		    attrs.setAudioAttributes(audio);
		    Encoder encoder = new Encoder();
	    	try{
	        	tempwav = File.createTempFile("wav", ".wav");
	        	tempmp3 = File.createTempFile("mp3", ".mp3");
	        	BufferedOutputStream bs = new BufferedOutputStream(new FileOutputStream(tempwav));
	        	bs.write(wave);
	        	try {
					encoder.encode(tempwav, tempmp3, attrs);
					fis = new FileInputStream(tempmp3);
					bos = new ByteArrayOutputStream();
					for (int readNum; (readNum = fis.read(wave)) != -1;) {
		                bos.write(wave, 0, readNum); //no doubt here is 0
		            }
					mp3 = bos.toByteArray();
					
				} catch (IllegalArgumentException  |  EncoderException err) {
					System.out.print("Encode error :  " + err.getMessage());
					return Optional.empty();
			
				}finally {
					if (fis != null) {
						fis.close();
					}
					if (bos != null) {
						bos.close();
					}
					if (bs != null) {
						bs.close();
					}
				}
	    	 }catch(IOException e){
		        	System.out.print("Failed to create file:  " + e.getMessage());
		        	return Optional.empty();
		        
		     }finally {
		      	 if (tempwav!=null)
		        		tempwav.delete();
		        	
		         if (tempmp3!=null)
		        		tempmp3.delete();
		        	
		     }
	        return mp3 != null ? Optional.of(mp3) : Optional.empty();     
	    }    
	@Override
	public void run() {
	  initData("/home/admin2/workspace/WsTomcat/vocabulary.txt.csv");
	   synchronized ( Locker.class ) {
		while(true) {
			
			int i = 0;
			while(Locker.flag.get()) {
				try {
					Thread.sleep(2500);
					try {
						String phrase = list.get( randomRange(0, list.size()-1 ));
						String word = phrase.contains(":") ? phrase.split(":")[0] : "";
					//	String audioBase64 = Audio2Base64(word);
						Optional<String> audioBase64 = Audio2Base64Client( word );
						if ( audioBase64.isPresent() ) {
							Message msg = new Message();
							msg.setAudio(audioBase64.get());
							msg.setPhrase(phrase);
							Gson g = new Gson();
							String str = g.toJson( msg );
							session.getBasicRemote().sendText( str );
						}

					} catch (IOException e) {
						
						System.out.println("IOError in Runner:  " + e.getMessage());
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
