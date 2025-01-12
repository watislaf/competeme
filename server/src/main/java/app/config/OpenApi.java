package app.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApi {
    public static final String EXAMPLE_SERVER_URL = "http://localhost:8080";

    @Bean
    public OpenAPI devApi() {
        return new OpenAPI().components(
                new Components()
                    .addSecuritySchemes(
                        "JwtAuth",
                        new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")
                    )
            )
            .addServersItem(new Server().url("http://localhost:8080"))
            .info(new Info().title("API").version("1"));
    }

}
