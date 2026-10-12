package com.kany.global.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** application.yml의 app.jwt.* 값. 비밀키는 코드에 쓰지 않고 환경변수(JWT_SECRET)로만 받는다. */
@ConfigurationProperties(prefix = "app.jwt")
public record JwtProperties(String secret, long accessTokenMinutes) {
}
