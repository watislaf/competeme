# Stage 1: Build the application
FROM gradle:jdk21 AS build
WORKDIR /app
COPY . /app/
RUN gradle build --no-daemon -x test

# Stage 2: Run the application
FROM openjdk:21-jdk
WORKDIR /app
COPY --from=build /app/build/libs/security-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]