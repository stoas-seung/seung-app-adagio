package seung.app;

import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

@SpringBootApplication
public class SSpringBootApplication {

	public static void main(String[] args) {
		new SpringApplicationBuilder(SSpringBootApplication.class)
//			.web(WebApplicationType.NONE)
			.web(WebApplicationType.SERVLET)
//			.web(WebApplicationType.REACTIVE)
			.run(args)
			;
	}

}
