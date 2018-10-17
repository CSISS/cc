package edu.gmu.csiss.earthcube.cyberconnector.ssh;
/*

The MIT License (MIT)

Copyright (c) 2013 The Authors

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import java.io.BufferedReader;
import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

public class SSHSessionOutput implements Runnable {

    protected final Logger log = LoggerFactory.getLogger(getClass());

    private final BufferedReader in;
    
    private WebSocketSession out;
    
    private boolean run = true;
    
    public SSHSessionOutput(BufferedReader in) {
        log.info("created");
        this.in = in;
    }
    
    public void stop() {
    	
    	run = false;
    	
    }
    
    @Override
    public void run() {
        
    	log.info("SSH session output thread started");
        
        while (run) {
            try {
                // readLine will block if nothing to send
                String line = in.readLine();
                log.debug("message out {}:{}", out.getId(), line);
                out.sendMessage(new TextMessage(line));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        
        log.info("SSH session output thread ended");

    }
    
    public void setWebSocketSession(WebSocketSession session) {
        log.info("received websocket session");
        this.out = session;
    }
    
}
