package com.qualidade.backend.model;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class ItemArquivo {
    private String nome;
    private String caminhoCompleto;
    private boolean diretorio;
    private long tamanhoBytes;
    private String tamanhoFormatado;
    private String extensao;
    private String tipo; // VIDEO, PDF, SLIDE, DOCUMENTO, AUDIO, IMAGEM, OUTRO
    private String dataModificacao;

    public ItemArquivo() {
    }

    public static ItemArquivo fromFile(File file) {
        ItemArquivo item = new ItemArquivo();
        item.setNome(file.getName().isEmpty() ? file.getAbsolutePath() : file.getName());
        item.setCaminhoCompleto(file.getAbsolutePath());
        item.setDiretorio(file.isDirectory());

        if (!file.isDirectory()) {
            item.setTamanhoBytes(file.length());
            item.setTamanhoFormatado(formatarBytes(file.length()));
            item.setExtensao(extrairExtensao(file.getName()));
            item.setTipo(identificarTipo(item.getExtensao()));
        } else {
            item.setExtensao("");
            item.setTipo("PASTA");
            item.setTamanhoFormatado("-");
        }

        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault());
        item.setDataModificacao(sdf.format(new Date(file.lastModified())));

        return item;
    }

    private static String extrairExtensao(String nome) {
        int idx = nome.lastIndexOf('.');
        if (idx > 0 && idx < nome.length() - 1) {
            return nome.substring(idx + 1).toLowerCase();
        }
        return "";
    }

    private static String identificarTipo(String ext) {
        if (ext == null || ext.isEmpty()) return "OUTRO";
        return switch (ext.toLowerCase()) {
            case "mp4", "mkv", "avi", "mov", "wmv", "flv", "webm", "m4v" -> "VIDEO";
            case "pdf" -> "PDF";
            case "ppt", "pptx", "odp" -> "SLIDE";
            case "doc", "docx", "odt", "txt", "rtf", "md" -> "DOCUMENTO";
            case "xls", "xlsx", "ods", "csv" -> "PLANILHA";
            case "mp3", "wav", "aac", "flac", "ogg", "wma", "m4a" -> "AUDIO";
            case "png", "jpg", "jpeg", "webp", "gif", "svg", "bmp" -> "IMAGEM";
            case "zip", "rar", "7z", "tar", "gz" -> "COMPACTADO";
            default -> "OUTRO";
        };
    }

    private static String formatarBytes(long bytes) {
        if (bytes < 1024) return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        char pre = "KMGTPE".charAt(exp - 1);
        return String.format(Locale.US, "%.1f %cB", bytes / Math.pow(1024, exp), pre);
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCaminhoCompleto() {
        return caminhoCompleto;
    }

    public void setCaminhoCompleto(String caminhoCompleto) {
        this.caminhoCompleto = caminhoCompleto;
    }

    public boolean isDiretorio() {
        return diretorio;
    }

    public void setDiretorio(boolean diretorio) {
        this.diretorio = diretorio;
    }

    public long getTamanhoBytes() {
        return tamanhoBytes;
    }

    public void setTamanhoBytes(long tamanhoBytes) {
        this.tamanhoBytes = tamanhoBytes;
    }

    public String getTamanhoFormatado() {
        return tamanhoFormatado;
    }

    public void setTamanhoFormatado(String tamanhoFormatado) {
        this.tamanhoFormatado = tamanhoFormatado;
    }

    public String getExtensao() {
        return extensao;
    }

    public void setExtensao(String extensao) {
        this.extensao = extensao;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getDataModificacao() {
        return dataModificacao;
    }

    public void setDataModificacao(String dataModificacao) {
        this.dataModificacao = dataModificacao;
    }
}
