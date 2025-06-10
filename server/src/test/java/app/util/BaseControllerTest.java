package app.util;

import app.config.JwtAuthenticationFilter;
import app.config.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

public abstract class BaseControllerTest {

    @Autowired
    protected MockMvc mockMvc;

    @MockBean
    protected JwtService jwtService;

    @MockBean
    protected JwtAuthenticationFilter jwtAuthenticationFilter;

    private final ObjectMapper objectMapper = new ObjectMapper();

    protected ResultActions performGet(String url) throws Exception {
        return mockMvc.perform(get(url));
    }

    protected ResultActions performGetWithParam(String url, String paramName, String paramValue) throws Exception {
        return mockMvc.perform(get(url).param(paramName, paramValue));
    }

    protected ResultActions performPost(String url, Object body) throws Exception {
        return mockMvc.perform(post(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)));
    }

    protected ResultActions performPostWithString(String url, String body) throws Exception {
        return mockMvc.perform(post(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body));
    }

    protected ResultActions performPut(String url, Object body) throws Exception {
        return mockMvc.perform(put(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)));
    }

    protected ResultActions performPutWithString(String url, String body) throws Exception {
        return mockMvc.perform(put(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body));
    }

    protected ResultActions performDelete(String url) throws Exception {
        return mockMvc.perform(delete(url));
    }

    protected String toJson(Object obj) throws Exception {
        return objectMapper.writeValueAsString(obj);
    }

    protected String jsonString(String value) {
        return "\"" + value + "\"";
    }
} 