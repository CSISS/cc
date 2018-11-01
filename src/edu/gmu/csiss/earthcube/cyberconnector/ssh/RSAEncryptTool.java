package edu.gmu.csiss.earthcube.cyberconnector.ssh;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.Cipher;

import edu.gmu.csiss.earthcube.cyberconnector.utils.RandomString;

public class RSAEncryptTool {
	
	public static Map<String, KeyPair> token2KeyPair = new HashMap();
	
	public static String getPublicKey() throws NoSuchAlgorithmException {
		
		StringBuffer key = new StringBuffer();
		
		String token = new RandomString(20).nextString();
		
		KeyPair kp = RSAEncryptTool.buildKeyPair();
		
		token2KeyPair.put(token, kp);
		
		key.append("{ \"token\": \"").append(token).append("\", ");
		
		key.append(" \"rsa_public\": \"").append(kp.getPublic().getEncoded()).append("\" } ");
		
		return key.toString();
		
	}
	
    public static KeyPair buildKeyPair() throws NoSuchAlgorithmException {
        final int keySize = 2048;
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        keyPairGenerator.initialize(keySize);      
        return keyPairGenerator.genKeyPair();
    }

    public static byte[] decrypt(PrivateKey privateKey, byte [] encrypted) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA");  
        cipher.init(Cipher.DECRYPT_MODE, privateKey);  

        return cipher.doFinal(encrypted);  
    }
    
    public static String byte2Base64(byte [] bytes) {
    	
    	Base64 codec = new Base64();
    	String encoded = codec.encodeBase64String(bytes);
    	
    	return encoded;
    	
    }
    
    public static byte[] encrypt(PublicKey publicKey, String message) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA");  
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        
        return cipher.doFinal(message.getBytes());
    }
    
    public static void main(String [] args) throws Exception {
        // generate public and private keys
        KeyPair keyPair = buildKeyPair();
        PublicKey pubKey = keyPair.getPublic();
        PrivateKey privateKey = keyPair.getPrivate();
        
        // sign the message
        byte [] signed = encrypt(pubKey, "This is a secret message");     
        System.out.println(new String(signed));  // <<signed message>>
        
        // verify the message
        byte[] verified = decrypt(privateKey, signed);                                 
        System.out.println(new String(verified));     // This is a secret message
    	
//    	System.out.println(RSAEncryptTool.getPublicKey());
    	
    }
	
}
