package com.qualidade.backend.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Aula {
    private String id;
    private String titulo;
    private String materia;
    private String descricao;
    private List<ItemArquivo> arquivos = new ArrayList<>();
    private String dataCriacao;
    private int ordem;

    public Aula() {
        this.id = UUID.randomUUID().toString();
        this.dataCriacao = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
    }

    public Aula(String titulo, String materia, String descricao, List<ItemArquivo> arquivos) {
        this();
        this.titulo = titulo;
        this.materia = materia;
        this.descricao = descricao;
        if (arquivos != null) {
            this.arquivos = arquivos;
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getMateria() {
        return materia;
    }

    public void setMateria(String materia) {
        this.materia = materia;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public List<ItemArquivo> getArquivos() {
        return arquivos;
    }

    public void setArquivos(List<ItemArquivo> arquivos) {
        this.arquivos = arquivos != null ? arquivos : new ArrayList<>();
    }

    public String getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(String dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public int getOrdem() {
        return ordem;
    }

    public void setOrdem(int ordem) {
        this.ordem = ordem;
    }
}
