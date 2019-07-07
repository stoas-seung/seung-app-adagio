package seung.app.conf;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class SPostConstruct {

	private static final Logger logger = LoggerFactory.getLogger(SPostConstruct.class);
	
	@PostConstruct
	public void init() {
		
		logger.debug("postconstruct init.");
//		SMap systemProperties = new SMap();
//		
//		Properties properties = System.getProperties();
//		String key = "";
//		for(Enumeration propertyNames = properties.propertyNames(); propertyNames.hasMoreElements();) {
//			key = (String) propertyNames.nextElement();
//			systemProperties.put(key, System.getProperty(key));
//		}
//		logger.debug(systemProperties.toJson(true));
	}
	
}
