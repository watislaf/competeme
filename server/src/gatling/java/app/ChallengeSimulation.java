package app;

import io.gatling.javaapi.core.ChainBuilder;
import io.gatling.javaapi.core.ScenarioBuilder;
import io.gatling.javaapi.core.Simulation;
import io.gatling.javaapi.http.HttpProtocolBuilder;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Stream;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.http;
import static io.gatling.javaapi.http.HttpDsl.status;

public class ChallengeSimulation extends Simulation {

    private final HttpProtocolBuilder httpProtocol = http
        .baseUrl("http://localhost:8080/api/v1")
        .acceptHeader("application/json")
        .contentTypeHeader("application/json");

    private final ChainBuilder registerAndLogin =
        feed(userGenerator())
            .exec(
                http("Register User")
                    .post("/auth/register")
                    .body(StringBody(
                        """
                            {
                                "username": "#{username}",
                                "email": "#{email}",
                                "password": "#{password}"
                            }
                            """
                    ))
                    .check(
                        status().in(200, 409),
                        jsonPath("$.accessToken").optional().saveAs("accessToken"),
                        jsonPath("$.userId").optional().saveAs("userId")
                    )
            )
            .doIf(session -> session.getString("accessToken") == null)
            .then(
                pause(1)
                .exec(
                    http("Login User")
                        .post("/auth/authenticate")
                        .body(StringBody(
                            """
                                {
                                    "email": "#{email}",
                                    "password": "#{password}"
                                }
                                """
                        ))
                        .check(
                            status().is(200),
                            jsonPath("$.accessToken").saveAs("accessToken"),
                            jsonPath("$.userId").saveAs("userId")
                        )
                )
            );

    private final ChainBuilder createAndGetChallenges =
        doIf(session -> session.getString("userId") != null)
        .then(
            exec(
                http("Create Challenge")
                    .post("/users/#{userId}/challenges/")
                    .header("Authorization", session -> "Bearer " + session.getString("accessToken"))
                    .body(StringBody(
                        """
                            {
                                "title": "Monthly Fitness Goal",
                                "description": "Complete 30 workouts this month",
                                "goal": 30,
                                "unit": "workouts",
                                "participants": []
                            }
                            """
                    ))
                    .check(status().in(200, 201, 400, 401, 403))
            )
                .pause(1)
                .exec(
                    http("Get Challenges")
                        .get("/users/#{userId}/challenges/")
                        .header("Authorization", session -> "Bearer " + session.getString("accessToken"))
                        .check(
                            status().in(200, 401, 403),
                            bodyString().saveAs("getChallengesResponse")
                        )
                )
                .exec(session -> {
                    System.out.println("User ID: " + session.getString("userId"));
                    System.out.println("Get Challenges Response: " + session.getString("getChallengesResponse"));
                    return session;
                })
        );

    private final ScenarioBuilder scenario = scenario("Challenge Simulation")
        .exec(registerAndLogin)
        .pause(1)
        .exec(createAndGetChallenges);

    {
        setUp(
            scenario.injectOpen(
                rampUsersPerSec(1).to(5).during(30),
                constantUsersPerSec(5).during(60)
            )
        ).protocols(httpProtocol);
    }

    private Iterator<Map<String, Object>> userGenerator() {
        return Stream.generate(() -> {
            String uuid = UUID.randomUUID().toString().substring(0, 8);
            Map<String, Object> map = new HashMap<>();
            map.put("username", uuid);
            map.put("email", uuid + "@example.com");
            map.put("password", "password");
            return map;
        }).iterator();
    }
}