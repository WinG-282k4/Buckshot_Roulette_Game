# syntax=docker/dockerfile:1.6

# --- Build stage: compile Spring Boot app with Maven (Java 17) ---
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /workspace

# Copy entire project and build
COPY . .
RUN --mount=type=cache,target=/root/.m2 mvn -B -q -DskipTests package

# --- Runtime stage: run the packaged jar ---
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the built jar from the builder stage
COPY --from=builder /workspace/target/*.jar /app/app.jar

# App listens on 8080 (default Spring Boot)
EXPOSE 8080

# Optional JVM args can be passed via JAVA_OPTS
ENV JAVA_OPTS=""

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]