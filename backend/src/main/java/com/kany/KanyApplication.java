package com.kany;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
// @ConfigurationProperties 클래스(JwtProperties 등)를 찾아서 빈으로 등록한다.
@ConfigurationPropertiesScan
public class KanyApplication {

	public static void main(String[] args) {
		SpringApplication.run(KanyApplication.class, args);
	}
}
