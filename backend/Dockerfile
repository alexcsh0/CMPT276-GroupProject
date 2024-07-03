FROM maven AS build
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jdk-jammy
COPY --from=build /target/CMPT276-GroupProject-0.0.1-SNAPSHOT.jar CMPT276-GroupProject.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","CMPT276-GroupProject.jar"]