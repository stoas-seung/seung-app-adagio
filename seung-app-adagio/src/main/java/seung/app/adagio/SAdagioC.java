package seung.app.adagio;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import seung.commons.arguments.SMap;
import seung.commons.arguments.SRequestMap;

@Controller
public class SAdagioC {

	private static final Logger logger = LoggerFactory.getLogger(SAdagioC.class);
	
	@Resource(name = "sAdagioS")
	private SAdagioS sAdagioS;
	
	@RequestMapping(value = {"/", "/root"}, method = {RequestMethod.GET, RequestMethod.POST})
	public String root(
			Model model
			, SRequestMap sRequestMap
			) {
		
		logger.debug("SAdagioC.root");
		
		model.addAttribute("res", sAdagioS.root(sRequestMap.getQuery()));
		
		return "/views/index";
	}
}
