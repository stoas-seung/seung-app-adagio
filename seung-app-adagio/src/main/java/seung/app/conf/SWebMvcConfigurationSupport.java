package seung.app.conf;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.mustache.MustacheEnvironmentCollector;
import org.springframework.boot.web.servlet.view.MustacheViewResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.core.env.Environment;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;
import org.springframework.web.servlet.view.BeanNameViewResolver;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import com.samskivert.mustache.Mustache;
import com.samskivert.mustache.Mustache.TemplateLoader;

import seung.app.conf.arguments.SHandlerMethodArgumentResolver;
import seung.app.conf.views.SMappingJackson2JsonView;
import seung.commons.SCommonU;
import seung.commons.arguments.SMap;

@Configuration
@ComponentScan({"seung","ift"})
@PropertySources({
	@PropertySource(value="classpath:application.properties")
	, @PropertySource(value="classpath:datasources.properties",ignoreResourceNotFound=true)
})
public class SWebMvcConfigurationSupport extends WebMvcConfigurationSupport {

	private static final Logger logger = LoggerFactory.getLogger(SWebMvcConfigurationSupport.class);
	
	@Autowired
	private Environment environment;
	
	@Bean(name="sDatasourceProperties")
	public SMap getSDatasourceProperties() {
		
		logger.debug("SWebMvcConfigurationSupport.getSDatasources");
		
		SMap sDatasourceProperties = null;
		
		if(environment.getProperty("datasources") != null && environment.getProperty("datasources").trim().length() > 0) {
			
			sDatasourceProperties = new SMap();
			
			SMap sDatasourceProperty = null;
			for(String datasourceName : environment.getProperty("datasources").split(",")) {
				
				sDatasourceProperty = new SMap();
				
				sDatasourceProperty.put("driverClassName"              , environment.getProperty("datasources." + datasourceName + ".driver-class-name"                , ""));
				sDatasourceProperty.put("url"                          , environment.getProperty("datasources." + datasourceName + ".url"                              , ""));
				sDatasourceProperty.put("username"                     , environment.getProperty("datasources." + datasourceName + ".username"                         , ""));
				sDatasourceProperty.put("password"                     , environment.getProperty("datasources." + datasourceName + ".password"                         , ""));
				sDatasourceProperty.put("maxTotal"                     , environment.getProperty("datasources." + datasourceName + ".max-total"                        , ""));
				sDatasourceProperty.put("initialSize"                  , environment.getProperty("datasources." + datasourceName + ".initial-size"                     , ""));
				sDatasourceProperty.put("maxIdle"                      , environment.getProperty("datasources." + datasourceName + ".max-idle"                         , ""));
				sDatasourceProperty.put("minIdle"                      , environment.getProperty("datasources." + datasourceName + ".min-idle"                         , ""));
				sDatasourceProperty.put("validationQuery"              , environment.getProperty("datasources." + datasourceName + ".validation-query"                 , ""));
				sDatasourceProperty.put("testWhileIdle"                , environment.getProperty("datasources." + datasourceName + ".test-while-idle"                  , ""));
				sDatasourceProperty.put("timeBetweenEvictionRunsMillis", environment.getProperty("datasources." + datasourceName + ".time-between-eviction-runs-millis", ""));
				sDatasourceProperty.put("minEvictableIdleTimeMillis"   , environment.getProperty("datasources." + datasourceName + ".min-evictable-idle-time-millis"   , ""));
				sDatasourceProperty.put("testOnBorrow"                 , environment.getProperty("datasources." + datasourceName + ".test-on-borrow"                   , ""));
				sDatasourceProperty.put("testOnReturn"                 , environment.getProperty("datasources." + datasourceName + ".test-on-return"                   , ""));
				sDatasourceProperty.put("maxWaitMillis"                , environment.getProperty("datasources." + datasourceName + ".max-wait-millis"                  , ""));
				sDatasourceProperty.put("xmlPath"                      , environment.getProperty("datasources." + datasourceName + ".xml-path"                         , ""));
				
				sDatasourceProperties.put(datasourceName, sDatasourceProperty);
			}
		}
		
		return sDatasourceProperties;
	}
	
	@Bean(name="sCommonU")
	public SCommonU importSCommonU() {
		logger.debug("importSCommonU.");
		return new SCommonU();
	}
	
	/**
	 * desc add SMap mapping
	@Override
	public RequestMappingHandlerAdapter requestMappingHandlerAdapter() {
		return new SRequestMappingHandlerAdapter();
	}
	 */
	/**
	 * desc add SReqMap mapping
	 */
	@Override
	protected void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
		logger.debug("addArgumentResolvers.");
		super.addArgumentResolvers(argumentResolvers);
		argumentResolvers.add(new SHandlerMethodArgumentResolver());
	}
	
	/**
	 * resource handler
	 */
	@Override
	protected void addResourceHandlers(ResourceHandlerRegistry registry) {
		logger.debug("addResourceHandlers.");
		if(!registry.hasMappingForPattern("/res/**")) {
			registry.addResourceHandler("/res/**").addResourceLocations("classpath:/static/");
		}
	}
	
	/**
	 * desc bean name resolver
	 */
	@Bean
	public ViewResolver buildBeanNameViewResolver() {
		logger.debug("buildBeanNameViewResolver.");
		BeanNameViewResolver beanNameViewResolver = new BeanNameViewResolver();
		beanNameViewResolver.setOrder(1);
		return beanNameViewResolver;
	}
	
	/**
	 * json view resolver
	 */
	@Bean(name="jsonView")
	public MappingJackson2JsonView buildSMappingJackson2JsonView() {
		logger.debug("buildSMappingJackson2JsonView.");
		SMappingJackson2JsonView sMappingJackson2JsonView = new SMappingJackson2JsonView();
		return sMappingJackson2JsonView;
	}
	
	/**
	 * mustache view resolver
	 */
	@Bean
	public ViewResolver buildMustacheViewResolver() {
		logger.debug("buildMustacheViewResolver.");
		MustacheViewResolver mustacheViewResolver = new MustacheViewResolver();
		mustacheViewResolver.setPrefix("classpath:/templates");
		mustacheViewResolver.setSuffix(".html");
		mustacheViewResolver.setCharset("UTF-8");
		mustacheViewResolver.setContentType("text/html; charset=utf-8");
		mustacheViewResolver.setCache(false);
		mustacheViewResolver.setOrder(2);
		return mustacheViewResolver;
	}
	
	/**
	 * set mustache default null value
	 */
	@Bean
	public com.samskivert.mustache.Mustache.Compiler buildMustacheCompiler(TemplateLoader templateLoader, Environment environment) {
		logger.debug("buildMustacheCompiler.");
		MustacheEnvironmentCollector mustacheEnvironmentCollector = new MustacheEnvironmentCollector();
		mustacheEnvironmentCollector.setEnvironment(environment);
		com.samskivert.mustache.Mustache.Compiler compiler = Mustache.compiler().defaultValue("").withLoader(templateLoader).withCollector(mustacheEnvironmentCollector);
		return compiler;
	}
	
}
