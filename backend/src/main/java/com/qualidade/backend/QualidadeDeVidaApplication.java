
package com.qualidade.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

import java.awt.Desktop;
import java.io.File;
import java.net.URI;

@SpringBootApplication
public class QualidadeDeVidaApplication {

	public static void main(String[] args) {
		System.setProperty("java.awt.headless", "false");
		SpringApplication.run(QualidadeDeVidaApplication.class, args);
	}

	@EventListener(ApplicationReadyEvent.class)
	public void abrirComoJanelaAplicativo() {
		try {
			String url = "http://localhost:8080";
			boolean abertoComoApp = false;

			// 1. Tenta Microsoft Edge nativo do Windows (modo janela de aplicativo isolada sem abas/URL)
			String progFilesX86 = System.getenv("ProgramFiles(x86)");
			String progFiles = System.getenv("ProgramFiles");
			String localAppData = System.getenv("LOCALAPPDATA");

			String edgePath86 = (progFilesX86 != null ? progFilesX86 : "C:\\Program Files (x86)") + "\\Microsoft\\Edge\\Application\\msedge.exe";
			String edgePath = (progFiles != null ? progFiles : "C:\\Program Files") + "\\Microsoft\\Edge\\Application\\msedge.exe";

			if (new File(edgePath86).exists()) {
				new ProcessBuilder(edgePath86, "--app=" + url).start();
				abertoComoApp = true;
			} else if (new File(edgePath).exists()) {
				new ProcessBuilder(edgePath, "--app=" + url).start();
				abertoComoApp = true;
			}

			// 2. Se não encontrou o Edge nos caminhos padrão, tenta Google Chrome em modo App
			if (!abertoComoApp) {
				String chromePath = (progFiles != null ? progFiles : "C:\\Program Files") + "\\Google\\Chrome\\Application\\chrome.exe";
				String chromePath86 = (progFilesX86 != null ? progFilesX86 : "C:\\Program Files (x86)") + "\\Google\\Chrome\\Application\\chrome.exe";
				String chromeLocal = (localAppData != null ? localAppData : "") + "\\Google\\Chrome\\Application\\chrome.exe";

				if (new File(chromePath).exists()) {
					new ProcessBuilder(chromePath, "--app=" + url).start();
					abertoComoApp = true;
				} else if (new File(chromePath86).exists()) {
					new ProcessBuilder(chromePath86, "--app=" + url).start();
					abertoComoApp = true;
				} else if (new File(chromeLocal).exists()) {
					new ProcessBuilder(chromeLocal, "--app=" + url).start();
					abertoComoApp = true;
				}
			}

			// 3. Tenta comando start genérico do Windows com flag --app
			if (!abertoComoApp) {
				try {
					Process p = new ProcessBuilder("cmd", "/c", "start", "msedge", "--app=" + url).start();
					if (p.waitFor() == 0) {
						abertoComoApp = true;
					}
				} catch (Exception ignored) {}
			}

			// 4. Fallback de segurança para navegadores padrão caso o Windows não suporte o modo App
			if (!abertoComoApp) {
				if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
					Desktop.getDesktop().browse(new URI(url));
				} else {
					new ProcessBuilder("cmd", "/c", "start", url).start();
				}
			}
		} catch (Exception ignored) {
		}
	}
}
