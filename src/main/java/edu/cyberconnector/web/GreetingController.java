package edu.cyberconnector.web;

import java.util.concurrent.atomic.AtomicLong;

import edu.cyberconnector.Greeting;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GreetingController {

    private static final String template = "Hello, %s!";
    private final AtomicLong counter = new AtomicLong();

    @RequestMapping(value = "/greeting", method = RequestMethod.GET)
    public Greeting greeting(@RequestParam(value="name", defaultValue="World6") String name) {
        name = "test4";
        return new Greeting(counter.incrementAndGet(),
                String.format(template, name));
    }
}