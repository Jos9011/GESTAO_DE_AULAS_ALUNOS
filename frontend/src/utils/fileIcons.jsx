import React from 'react';
import {
  Folder,
  Video,
  FileText,
  Presentation,
  FileSpreadsheet,
  Music,
  Image as ImageIcon,
  Archive,
  FileCode,
  File
} from 'lucide-react';

export function getFileMeta(tipo) {
  switch (tipo) {
    case 'PASTA':
      return { icon: <Folder size={20} color="#38bdf8" />, label: 'Pasta', badgeClass: 'badge-folder' };
    case 'VIDEO':
      return { icon: <Video size={20} color="#f43f5e" />, label: 'Vídeo Aula', badgeClass: 'badge-video' };
    case 'PDF':
      return { icon: <FileText size={20} color="#ef4444" />, label: 'PDF', badgeClass: 'badge-pdf' };
    case 'SLIDE':
      return { icon: <Presentation size={20} color="#f59e0b" />, label: 'Slide / PPT', badgeClass: 'badge-slide' };
    case 'DOCUMENTO':
      return { icon: <FileText size={20} color="#3b82f6" />, label: 'Documento', badgeClass: 'badge-doc' };
    case 'PLANILHA':
      return { icon: <FileSpreadsheet size={20} color="#10b981" />, label: 'Planilha', badgeClass: 'badge-sheet' };
    case 'AUDIO':
      return { icon: <Music size={20} color="#a855f7" />, label: 'Áudio', badgeClass: 'badge-audio' };
    case 'IMAGEM':
      return { icon: <ImageIcon size={20} color="#ec4899" />, label: 'Imagem', badgeClass: 'badge-img' };
    case 'COMPACTADO':
      return { icon: <Archive size={20} color="#eab308" />, label: 'Zip/Rar', badgeClass: 'badge-archive' };
    default:
      return { icon: <File size={20} color="#94a3b8" />, label: 'Arquivo', badgeClass: 'badge-other' };
  }
}
