package com.qualidade.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.qualidade.backend.model.Aula;
import com.qualidade.backend.model.ItemArquivo;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class AulaService {

    private final ExploradorService exploradorService;
    private final Map<String, Aula> aulasMap = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper;
    private final File arquivoArmazenamento;

    public AulaService(ExploradorService exploradorService) {
        this.exploradorService = exploradorService;
        this.objectMapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
        // Salva arquivo no diretório de execução ou documentos
        this.arquivoArmazenamento = new File("aulas-db.json");
    }

    @PostConstruct
    public void carregarDadosIniciais() {
        if (arquivoArmazenamento.exists()) {
            try {
                List<Aula> lista = objectMapper.readValue(arquivoArmazenamento, new TypeReference<List<Aula>>() {});
                for (Aula a : lista) {
                    aulasMap.put(a.getId(), a);
                }
            } catch (IOException e) {
                System.err.println("Erro ao carregar aulas do arquivo JSON: " + e.getMessage());
            }
        }
    }

    private synchronized void persistirEmArquivo() {
        try {
            objectMapper.writeValue(arquivoArmazenamento, new ArrayList<>(aulasMap.values()));
        } catch (IOException e) {
            System.err.println("Erro ao salvar aulas no arquivo JSON: " + e.getMessage());
        }
    }

    public List<Aula> listarTodas() {
        return aulasMap.values().stream()
                .sorted(Comparator.comparing(Aula::getDataCriacao).reversed())
                .collect(Collectors.toList());
    }

    public Optional<Aula> buscarPorId(String id) {
        return Optional.ofNullable(aulasMap.get(id));
    }

    public Aula salvar(Aula aula) {
        if (aula.getId() == null || aula.getId().trim().isEmpty()) {
            aula.setId(UUID.randomUUID().toString());
        }
        aulasMap.put(aula.getId(), aula);
        persistirEmArquivo();
        return aula;
    }

    public Optional<Aula> atualizar(String id, Aula aulaAtualizada) {
        Aula existente = aulasMap.get(id);
        if (existente != null) {
            if (aulaAtualizada.getTitulo() != null) existente.setTitulo(aulaAtualizada.getTitulo());
            if (aulaAtualizada.getMateria() != null) existente.setMateria(aulaAtualizada.getMateria());
            if (aulaAtualizada.getDescricao() != null) existente.setDescricao(aulaAtualizada.getDescricao());
            if (aulaAtualizada.getArquivos() != null) existente.setArquivos(aulaAtualizada.getArquivos());
            persistirEmArquivo();
            return Optional.of(existente);
        }
        return Optional.empty();
    }

    public boolean deletar(String id) {
        boolean removido = aulasMap.remove(id) != null;
        if (removido) {
            persistirEmArquivo();
        }
        return removido;
    }

    public Map<String, Object> abrirTodosArquivos(String id) {
        Map<String, Object> resultado = new HashMap<>();
        Aula aula = aulasMap.get(id);
        if (aula == null) {
            resultado.put("sucesso", false);
            resultado.put("mensagem", "Aula não encontrada.");
            return resultado;
        }

        List<ItemArquivo> arquivos = aula.getArquivos();
        int abertos = 0;
        List<String> erros = new ArrayList<>();

        for (ItemArquivo arq : arquivos) {
            boolean ok = exploradorService.abrirArquivo(arq.getCaminhoCompleto());
            if (ok) {
                abertos++;
            } else {
                erros.add(arq.getNome() + " (Arquivo não encontrado ou inacessível)");
            }
            try {
                // Pequena pausa para o Windows abrir os programas em ordem
                Thread.sleep(250);
            } catch (InterruptedException ignored) {}
        }

        resultado.put("sucesso", abertos > 0 || arquivos.isEmpty());
        resultado.put("totalArquivos", arquivos.size());
        resultado.put("arquivosAbertos", abertos);
        resultado.put("erros", erros);
        return resultado;
    }

    public Map<String, Object> obterResumo() {
        int totalAulas = aulasMap.size();
        int totalArquivos = 0;
        int totalVideos = 0;
        int totalPdfs = 0;
        int totalSlides = 0;
        int totalDocs = 0;
        int totalOutros = 0;

        for (Aula aula : aulasMap.values()) {
            if (aula.getArquivos() != null) {
                totalArquivos += aula.getArquivos().size();
                for (ItemArquivo arq : aula.getArquivos()) {
                    if (arq.getTipo() == null) continue;
                    switch (arq.getTipo().toUpperCase()) {
                        case "VIDEO" -> totalVideos++;
                        case "PDF" -> totalPdfs++;
                        case "SLIDE" -> totalSlides++;
                        case "DOCUMENTO" -> totalDocs++;
                        default -> totalOutros++;
                    }
                }
            }
        }

        Set<String> materias = aulasMap.values().stream()
                .map(Aula::getMateria)
                .filter(m -> m != null && !m.trim().isEmpty())
                .collect(Collectors.toSet());

        List<Aula> ultimasAulas = aulasMap.values().stream()
                .sorted(Comparator.comparing(Aula::getDataCriacao).reversed())
                .limit(4)
                .collect(Collectors.toList());

        Map<String, Object> resumo = new HashMap<>();
        resumo.put("totalAulas", totalAulas);
        resumo.put("totalMateriais", totalArquivos);
        resumo.put("totalMaterias", materias.size());
        resumo.put("materias", materias);
        resumo.put("totalVideos", totalVideos);
        resumo.put("totalPdfs", totalPdfs);
        resumo.put("totalSlides", totalSlides);
        resumo.put("totalDocs", totalDocs);
        resumo.put("totalOutros", totalOutros);
        resumo.put("ultimasAulas", ultimasAulas);
        return resumo;
    }
}

