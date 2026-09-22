package com.qualidade.backend.controller;

import com.qualidade.backend.model.DiscoInfo;
import com.qualidade.backend.service.ExploradorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
