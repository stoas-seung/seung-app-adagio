package seung.app.conf.views;

import java.util.Map;

import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

public class SMappingJackson2JsonView extends MappingJackson2JsonView {

	@Override
	protected Object filterModel(Map<String, Object> model) {
		
		if(model.containsKey("res")) return model.get("res");
		
		return super.filterModel(model);
	}
	
}
