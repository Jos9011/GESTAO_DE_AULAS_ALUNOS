package com.qualidade.backend.controller;

import com.qualidade.backend.model.DiscoInfo;
import com.qualidade.backend.service.ExploradorService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/explorador")
@CrossOrigin(origins = "*")
public class ExploradorController {

    private final ExploradorService exploradorService;

    public ExploradorController(ExploradorService exploradorService) {
        this.exploradorService = exploradorService;
    }

    @GetMapping("/discos")
    public ResponseEntity<List<DiscoInfo>> listarDiscos() {
        return ResponseEntity.ok(exploradorService.listarDiscos());
    }

    @GetMapping("/conteudo")
    public ResponseEntity<Map<String, Object>> listarConteudo(
            @RequestParam(required = false) String caminho,
            @RequestParam(required = false, defaultValue = "TODOS") String filtro,
            @RequestParam(required = false) String busca) {
        return ResponseEntity.ok(exploradorService.listarConteudo(caminho, filtro, busca));
    }

    @PostMapping("/abrir")
    public ResponseEntity<Map<String, Object>> abrirArquivo(@RequestBody Map<String, String> payload) {
        String caminho = payload.get("caminho");
        boolean sucesso = exploradorService.abrirArquivo(caminho);
        return ResponseEntity.ok(Map.of(
                "sucesso", sucesso,
                "caminho", caminho != null ? caminho : "",
                "mensagem", sucesso ? "Arquivo aberto no Windows com sucesso!" : "Não foi possível abrir o arquivo."
        ));
    }

    @PostMapping("/abrir-explorer")
    public ResponseEntity<Map<String, Object>> abrirNoExplorer(@RequestBody Map<String, String> payload) {
        String caminho = payload.get("caminho");
        boolean sucesso = exploradorService.abrirNoExplorer(caminho);
        return ResponseEntity.ok(Map.of(
                "sucesso", sucesso,
                "caminho", caminho != null ? caminho : "",
                "mensagem", sucesso ? "Pasta aberta no Windows Explorer!" : "Não foi possível abrir a pasta."
        ));
    }

    @GetMapping("/stream")
    public ResponseEntity<?> streamVideo(
            @RequestParam String caminho,
            @RequestHeader(required = false) HttpHeaders headers) throws IOException {
        File file = exploradorService.resolverArquivoComRelocacaoDeDisco(caminho);
        if (file == null || !file.exists() || file.isDirectory()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(file);
        String contentType = exploradorService.determinarContentType(file.getName());
        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(contentType);
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        List<HttpRange> ranges = (headers != null) ? headers.getRange() : Collections.emptyList();
        if (ranges != null && !ranges.isEmpty()) {
            long contentLength = resource.contentLength();
            HttpRange range = ranges.get(0);
            long start = range.getRangeStart(contentLength);
            long end = range.getRangeEnd(contentLength);
            long rangeLength = Math.min(1024 * 1024 * 3, end - start + 1); // 3MB chunks for smooth scrub
            ResourceRegion region = new ResourceRegion(resource, start, rangeLength);
            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                    .contentType(mediaType)
                    .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                    .body(region);
        } else {
            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                    .body(resource);
        }
    }

    @GetMapping("/visualizar")
    public ResponseEntity<Resource> visualizarArquivo(@RequestParam String caminho) {
        File file = exploradorService.resolverArquivoComRelocacaoDeDisco(caminho);
        if (file == null || !file.exists() || file.isDirectory()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(file);
        String contentType = exploradorService.determinarContentType(file.getName());
        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(contentType);
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getName() + "\"")
                .body(resource);
    }
}
