package seung.app.conf.arguments;

import java.net.InetAddress;
import java.net.URI;
import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import seung.commons.arguments.SMap;
import seung.commons.arguments.SRequestMap;

public class SHandlerMethodArgumentResolver implements HandlerMethodArgumentResolver {

	private static final Logger logger = LoggerFactory.getLogger(SHandlerMethodArgumentResolver.class);
	
	@Override
	public boolean supportsParameter(MethodParameter methodParameter) {
		return methodParameter.getParameterType().equals(SRequestMap.class);
	}
	
	@Override
	public Object resolveArgument(
			MethodParameter methodParameter
			, ModelAndViewContainer modelAndViewContainer
			, NativeWebRequest nativeWebRequest
			, WebDataBinderFactory webDataBinderFactory
			) throws Exception {
		
		SRequestMap sRequestMap = new SRequestMap();
		
		HttpServletRequest httpServletRequest = (HttpServletRequest) nativeWebRequest.getNativeRequest();
		
		// network
		InetAddress addr = InetAddress.getLocalHost();
		sRequestMap.putNetwork("appHost"   , httpServletRequest.getHeader("host"));
		sRequestMap.putNetwork("hostType"  , httpServletRequest.getHeader("host").split("\\.")[0]);
		sRequestMap.putNetwork("hostName"  , addr.getHostName());
		sRequestMap.putNetwork("remoteAddr", (httpServletRequest.getHeader("X-FORWARDED-FOR") == null ? httpServletRequest.getRemoteAddr() : httpServletRequest.getHeader("X-FORWARDED-FOR")));
		sRequestMap.putNetwork("requestURI", httpServletRequest.getRequestURI().replace("/WEB-INF/views", "").replace(".jsp", "").replace(httpServletRequest.getContextPath(), ""));
		sRequestMap.putNetwork("refererURI", httpServletRequest.getHeader("referer") == null ? "" : new URI(httpServletRequest.getHeader("referer")).getPath());
		
		// parameters
		if(methodParameter.getParameterType().equals(SRequestMap.class)) {
			
			Enumeration<?> enumerations = null;
			String key = "";
			String[] vals = null;
			
			// parameters
			enumerations = httpServletRequest.getParameterNames();
			while(enumerations.hasMoreElements()) {
				
				key = (String) enumerations.nextElement();
				
				if(!key.startsWith("_ss")) {
					vals = httpServletRequest.getParameterValues(key);
					if(vals != null) {
						sRequestMap.putQuery(key, vals.length > 1 ? vals : vals[0]);
						logger.debug(String.format("[PARAMETER] %s: %s", key, sRequestMap.getQuery().getString(key)));
					}
				}
				
			}
			
			// fowarding attributes
			enumerations = httpServletRequest.getAttributeNames();
			while(enumerations.hasMoreElements()) {
				
				key = (String) enumerations.nextElement();
				
				if(key.startsWith("forward_")) {
					sRequestMap.putQuery(key.replaceAll("forward_", ""), httpServletRequest.getAttribute(key));
					logger.debug(String.format("[ATTRIBUTE] %s: %s", key, sRequestMap.getQuery().getString(key)));
				}
				
			}
			
			// headers
			enumerations = httpServletRequest.getHeaderNames();
			while(enumerations.hasMoreElements()) {
				
				key = (String) enumerations.nextElement();
				
				if(key instanceof String) {
					sRequestMap.putHeader(key, httpServletRequest.getHeader(key));
					logger.debug(String.format("[ATTRIBUTE] %s: %s", key, sRequestMap.getHeader().getString(key)));
				}
				
			}
		}
		
		// parameters - json
		if("XMLHttpRequest".equals(httpServletRequest.getHeader("X-Requested-With"))) {
			String json = IOUtils.toString(httpServletRequest.getInputStream(), "UTF-8");
			logger.debug(String.format("[JSON] %s", json));
			if(json != null && json.length() > 0) {
				try {
					Gson gson = new GsonBuilder().disableHtmlEscaping().create();
					sRequestMap.putQuery(gson.fromJson(json, SMap.class));
				} catch (Exception e) {
					logger.error(e.getMessage());
				}
			}
		}
		
		return sRequestMap;
	}

}
