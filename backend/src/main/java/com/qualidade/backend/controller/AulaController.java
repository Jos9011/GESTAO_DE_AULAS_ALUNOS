package com.qualidade.backend.controller;

import com.qualidade.backend.model.Aula;
import com.qualidade.backend.service.AulaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/aulas")
@CrossOrigin(origins = "*")
public class AulaController {

    private final AulaService aulaService;

    public AulaController(AulaService aulaService) {
        this.aulaService = aulaService;
    }

    @GetMapping
    public ResponseEntity<List<Aula>> listarTodas() {
        return ResponseEntity.ok(aulaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Aula> buscarPorId(@PathVariable String id) {
        return aulaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Aula> criar(@RequestBody Aula aula) {
        Aula salva = aulaService.salvar(aula);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Aula> atualizar(@PathVariable String id, @RequestBody Aula dados) {
        return aulaService.atualizar(id, dados)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable String id) {
        if (aulaService.deletar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}/toggle-concluida")
    public ResponseEntity<Aula> alternarConclusao(@PathVariable String id) {
        return aulaService.alternarConclusao(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/toggle-favorita")
    public ResponseEntity<Aula> alternarFavorita(@PathVariable String id) {
        return aulaService.alternarFavorita(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/anotacoes")
    public ResponseEntity<Aula> salvarAnotacoes(@PathVariable String id, @RequestBody Map<String, String> payload) {
        String texto = payload.getOrDefault("anotacoes", "");
        return aulaService.salvarAnotacoes(id, texto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/abrir-todos")
    public ResponseEntity<Map<String, Object>> abrirTodosArquivos(@PathVariable String id) {
        return ResponseEntity.ok(aulaService.abrirTodosArquivos(id));
    }

    @GetMapping("/resumo")
    public ResponseEntity<Map<String, Object>> obterResumo() {
        return ResponseEntity.ok(aulaService.obterResumo());
    }
}
