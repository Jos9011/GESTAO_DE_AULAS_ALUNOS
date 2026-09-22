
package com.qualidade.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

import java.awt.Desktop;
import java.net.URI;

@SpringBootApplication
public class QualidadeDeVidaApplication {

	public static void main(String[] args) {
		System.setProperty("java.awt.headless", "false");
		SpringApplication.run(QualidadeDeVidaApplication.class, args);
	}

	@EventListener(ApplicationReadyEvent.class)
	public void abrirNavegadorAutomaticamente() {
		try {
			String url = "http://localhost:8080";
			if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
				Desktop.getDesktop().browse(new URI(url));
			} else {
				new ProcessBuilder("cmd", "/c", "start", url).start();
			}
		} catch (Exception ignored) {
		}
	}
}
