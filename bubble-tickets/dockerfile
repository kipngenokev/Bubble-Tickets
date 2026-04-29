# Build frontend
FROM node:18-alpine as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Build backend
FROM maven:3.9-eclipse-temurin-17 as backend-build
WORKDIR /app
COPY pom.xml .
COPY src/ src/
RUN mvn clean package -DskipTests

# Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/target/bubble-tickets-0.0.1-SNAPSHOT.jar app.jar
COPY --from=frontend-build /app/frontend/dist ./static
EXPOSE 8090
CMD ["java", "-jar", "app.jar"]