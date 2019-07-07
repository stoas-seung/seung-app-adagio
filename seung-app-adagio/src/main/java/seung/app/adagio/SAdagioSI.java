package seung.app.adagio;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import seung.commons.arguments.SMap;

@Service("sAdagioS")
public class SAdagioSI implements SAdagioS {

	private static final Logger logger = LoggerFactory.getLogger(SAdagioS.class);
	
	@Override
	public SMap root(SMap sMap) {
		
		logger.debug("SAdagioSI.root");
		
		SMap res = new SMap();
		
		res.put("message", sMap.get("message") == null ? "message" : sMap.get("message"));
		
		return res;
	}
	
}
