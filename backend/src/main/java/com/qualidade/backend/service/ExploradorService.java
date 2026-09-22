package com.qualidade.backend.service;

import com.qualidade.backend.model.DiscoInfo;
import com.qualidade.backend.model.ItemArquivo;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExploradorService {

    public List<DiscoInfo> listarDiscos() {
        List<DiscoInfo> discos = new ArrayList<>();
        File[] roots = File.listRoots();
        if (roots != null) {
            for (File root : roots) {
                String letra = root.getAbsolutePath();
                long total = root.getTotalSpace();
                long livre = root.getFreeSpace();
                String nome = "Disco Local (" + letra.replace("\\", "") + ")";
                discos.add(new DiscoInfo(letra, nome, livre, total));
            }
        }
        return discos;
    }

    public Map<String, Object> listarConteudo(String caminho, String filtroTipo, String busca) {
        Map<String, Object> resposta = new HashMap<>();

        if (caminho != null) {
            caminho = caminho.trim();
            if (caminho.startsWith("\"") && caminho.endsWith("\"") && caminho.length() >= 2) {
                caminho = caminho.substring(1, caminho.length() - 1).trim();
            }
        }

        if (caminho == null || caminho.isEmpty()) {
            // Se nenhum caminho for informado, usa a pasta Documentos do usuário ou primeiro disco
            caminho = System.getProperty("user.home") + File.separator + "Documents";
            File test = new File(caminho);
            if (!test.exists()) {
                File[] roots = File.listRoots();
                caminho = (roots != null && roots.length > 0) ? roots[0].getAbsolutePath() : "C:\\";
            }
        }

        File target = resolverArquivoComRelocacaoDeDisco(caminho);
        if (target == null) {
            target = new File(caminho);
        }

        if (!target.exists()) {
            resposta.put("erro", "Caminho não encontrado: " + caminho);
            resposta.put("caminhoAtual", caminho);
            resposta.put("itens", Collections.emptyList());
            return resposta;
        }

        File diretorio = target.isDirectory() ? target : target.getParentFile();
        if (diretorio == null) {
            diretorio = target;
        }

        if (!target.isDirectory()) {
            resposta.put("arquivoDestacado", ItemArquivo.fromFile(target));
        }

        resposta.put("caminhoAtual", diretorio.getAbsolutePath());
        resposta.put("nomePastaAtual", diretorio.getName().isEmpty() ? diretorio.getAbsolutePath() : diretorio.getName());
        resposta.put("caminhoPai", diretorio.getParent() != null ? diretorio.getParent() : null);


        File[] files = diretorio.listFiles();
        List<ItemArquivo> itens = new ArrayList<>();

        if (files != null) {
            for (File f : files) {
                // Ignora arquivos/pastas de sistema ocultos
                if (f.isHidden() || f.getName().startsWith(".")) {
                    continue;
                }
                try {
                    ItemArquivo item = ItemArquivo.fromFile(f);

                    // Filtro de busca textual
                    if (busca != null && !busca.trim().isEmpty()) {
                        String termo = busca.toLowerCase().trim();
                        if (!item.getNome().toLowerCase().contains(termo)) {
                            continue;
                        }
                    }

                    // Filtro de tipo (ignora filtro se for pasta, para permitir navegar)
                    if (filtroTipo != null && !filtroTipo.equalsIgnoreCase("TODOS") && !item.isDiretorio()) {
                        if (!item.getTipo().equalsIgnoreCase(filtroTipo)) {
                            continue;
                        }
                    }

                    itens.add(item);
                } catch (Exception ignored) {
                }
            }
        }

        // Ordena: Pastas primeiro, depois arquivos alfabeticamente
        itens.sort((a, b) -> {
            if (a.isDiretorio() && !b.isDiretorio()) return -1;
            if (!a.isDiretorio() && b.isDiretorio()) return 1;
            return a.getNome().compareToIgnoreCase(b.getNome());
        });

        resposta.put("itens", itens);
        resposta.put("totalItens", itens.size());
        return resposta;
    }

    public File resolverArquivoComRelocacaoDeDisco(String caminho) {
        if (caminho == null || caminho.trim().isEmpty()) return null;
        File file = new File(caminho);
        if (file.exists()) {
            return file;
        }

        // Se a letra do drive mudou em outro computador (ex: de E:\ para D:\ ou F:\):
        String caminhoSemDrive = caminho.replaceAll("^[a-zA-Z]:", "");
        File[] roots = File.listRoots();
        if (roots != null) {
            for (File root : roots) {
                String sub = caminhoSemDrive.startsWith("\\") || caminhoSemDrive.startsWith("/") 
                        ? caminhoSemDrive.substring(1) 
                        : caminhoSemDrive;
                File tentativa = new File(root, sub);
                if (tentativa.exists()) {
                    return tentativa;
                }
            }
        }
        return null;
    }

    public boolean abrirArquivo(String caminho) {
        File file = resolverArquivoComRelocacaoDeDisco(caminho);
        if (file == null || !file.exists()) return false;

        try {
            // No Windows, cmd /c start "" "caminho" abre qualquer arquivo com o programa padrão
            new ProcessBuilder("cmd", "/c", "start", "\"\"", file.getAbsolutePath()).start();
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean abrirNoExplorer(String caminho) {
        File file = resolverArquivoComRelocacaoDeDisco(caminho);
        if (file == null || !file.exists()) return false;

        try {
            if (file.isDirectory()) {
                new ProcessBuilder("explorer.exe", file.getAbsolutePath()).start();
            } else {
                new ProcessBuilder("explorer.exe", "/select,", file.getAbsolutePath()).start();
            }
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
}

