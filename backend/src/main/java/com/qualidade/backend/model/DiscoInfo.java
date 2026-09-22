package com.qualidade.backend.model;

public class DiscoInfo {
    private String letra;
    private String nomeExibicao;
    private long espacoLivreBytes;
    private long espacoTotalBytes;
    private String espacoLivreFormatado;
    private String espacoTotalFormatado;

    public DiscoInfo() {
    }

    public DiscoInfo(String letra, String nomeExibicao, long espacoLivreBytes, long espacoTotalBytes) {
        this.letra = letra;
        this.nomeExibicao = nomeExibicao;
        this.espacoLivreBytes = espacoLivreBytes;
        this.espacoTotalBytes = espacoTotalBytes;
        this.espacoLivreFormatado = formatarTamanho(espacoLivreBytes);
        this.espacoTotalFormatado = formatarTamanho(espacoTotalBytes);
    }

    private String formatarTamanho(long bytes) {
        if (bytes <= 0) return "0 GB";
        double gb = bytes / (1024.0 * 1024.0 * 1024.0);
        return String.format("%.1f GB", gb);
    }

    public String getLetra() {
        return letra;
    }

    public void setLetra(String letra) {
        this.letra = letra;
    }

    public String getNomeExibicao() {
        return nomeExibicao;
    }

    public void setNomeExibicao(String nomeExibicao) {
        this.nomeExibicao = nomeExibicao;
    }

    public long getEspacoLivreBytes() {
        return espacoLivreBytes;
    }

    public void setEspacoLivreBytes(long espacoLivreBytes) {
        this.espacoLivreBytes = espacoLivreBytes;
    }

    public long getEspacoTotalBytes() {
        return espacoTotalBytes;
    }

    public void setEspacoTotalBytes(long espacoTotalBytes) {
        this.espacoTotalBytes = espacoTotalBytes;
    }

    public String getEspacoLivreFormatado() {
        return espacoLivreFormatado;
    }

    public void setEspacoLivreFormatado(String espacoLivreFormatado) {
        this.espacoLivreFormatado = espacoLivreFormatado;
    }

    public String getEspacoTotalFormatado() {
        return espacoTotalFormatado;
    }

    public void setEspacoTotalFormatado(String espacoTotalFormatado) {
        this.espacoTotalFormatado = espacoTotalFormatado;
    }
}
