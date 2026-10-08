# 1단계(build): JDK로 jar를 만든다. 2단계(run): jar와 JRE만 담아서 이미지를 작게 만든다.
FROM eclipse-temurin:21-jdk AS build
WORKDIR /workspace

# 의존성 다운로드를 소스 복사보다 먼저 한다. 소스만 바뀌면 이 레이어는 캐시를 재사용해서
# 매번 라이브러리를 다시 받지 않는다.
COPY gradlew settings.gradle build.gradle ./
COPY gradle gradle
RUN chmod +x gradlew && ./gradlew dependencies --no-daemon > /dev/null

COPY src src
RUN ./gradlew bootJar --no-daemon

FROM eclipse-temurin:21-jre
WORKDIR /app

ENV TZ=Asia/Seoul
# 컨테이너 안에서 root로 실행하지 않는다. 앱이 뚫려도 컨테이너 전체 권한을 못 갖게 한다.
RUN groupadd --system app && useradd --system --gid app --no-create-home app

COPY --from=build /workspace/build/libs/*.jar app.jar

USER app
EXPOSE 8080
# 컨테이너 메모리 한도의 75%까지만 힙으로 쓴다. 한도를 넘으면 컨테이너가 강제 종료되기 때문이다.
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "/app/app.jar"]
