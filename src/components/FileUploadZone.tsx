import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import {
  UploadCloud,
  FileImage,
  FileArchive,
  FileText,
  File,
  X,
  Plus,
  FolderOpen,
  CheckCircle2,
} from 'lucide-react';

interface FileUploadZoneProps {
  id: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
  label: string;
  badge?: string;
  badgeColor?: 'optional' | 'required';
  hint?: string;
  required?: boolean;
  language?: 'fr' | 'en';
  accept?: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function FileUploadZone({
  id,
  files,
  onFilesChange,
  label,
  badge,
  badgeColor = 'optional',
  hint,
  required = false,
  language = 'fr',
  accept = 'image/*,.zip,.rar,.7z,.pdf,.doc,.docx',
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      // Eviter les doublons stricts par nom et taille
      const existingKey = new Set(files.map((f) => `${f.name}_${f.size}`));
      const newFiles = droppedFiles.filter((f) => !existingKey.has(`${f.name}_${f.size}`));
      onFilesChange([...files, ...newFiles]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const existingKey = new Set(files.map((f) => `${f.name}_${f.size}`));
      const newFiles = selectedFiles.filter((f) => !existingKey.has(`${f.name}_${f.size}`));
      onFilesChange([...files, ...newFiles]);
      // Reset input value to allow selecting same files again if deleted
      e.target.value = '';
    }
  };

  const removeFile = (indexToRemove: number) => {
    const updated = files.filter((_, idx) => idx !== indexToRemove);
    onFilesChange(updated);
  };

  const clearAllFiles = () => {
    onFilesChange([]);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <FileImage className="w-5 h-5 text-blue-400" />;
    }
    if (
      file.name.endsWith('.zip') ||
      file.name.endsWith('.rar') ||
      file.name.endsWith('.7z') ||
      file.type.includes('zip') ||
      file.type.includes('archive')
    ) {
      return <FileArchive className="w-5 h-5 text-amber-400" />;
    }
    if (
      file.name.endsWith('.pdf') ||
      file.name.endsWith('.doc') ||
      file.name.endsWith('.docx')
    ) {
      return <FileText className="w-5 h-5 text-emerald-400" />;
    }
    return <File className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className="w-full">
      {/* Label and badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <label htmlFor={id} className="block text-xs font-semibold text-slate-200">
          {label}
        </label>
        {badge && (
          <span
            className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              badgeColor === 'required'
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                : 'bg-blue-500/15 border border-blue-500/30 text-blue-300'
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Hint */}
      {hint && (
        <p className="text-xs text-slate-400 mb-3 leading-relaxed">
          {hint}
        </p>
      )}

      {/* Drag & Drop Area */}
      <div
        id={id}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed p-6 transition-all duration-300 text-center cursor-pointer ${
          isDragging
            ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20 scale-[1.01]'
            : files.length > 0
            ? 'border-emerald-500/40 bg-[#0d1222]/80 hover:border-emerald-500/70 hover:bg-[#0f152a]'
            : 'border-white/15 bg-white/[0.02] hover:border-blue-500/40 hover:bg-white/[0.04]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
        />
        {/* Hidden directory picker */}
        <input
          ref={folderInputRef}
          type="file"
          {...({ webkitdirectory: '', directory: '' } as React.InputHTMLAttributes<HTMLInputElement>)}
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              files.length > 0
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-blue-500/15 text-blue-400 border border-blue-500/25'
            }`}
          >
            <UploadCloud className="w-6 h-6" />
          </div>

          <div>
            <p className="text-sm font-semibold text-white mb-1">
              {language === 'fr'
                ? 'Glissez-déposez vos photos, captures ou dossier ici'
                : 'Drag and drop photos, screenshots or folder here'}
            </p>
            <p className="text-xs text-slate-400">
              {language === 'fr'
                ? 'ou cliquez pour parcourir vos fichiers depuis votre appareil'
                : 'or click to browse files from your device'}
            </p>
          </div>

          {/* Action buttons inside the dropzone */}
          <div
            className="flex flex-wrap items-center justify-center gap-2 mt-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'fr' ? 'Ajouter des fichiers / photos' : 'Add files / photos'}</span>
            </button>

            <button
              type="button"
              onClick={() => folderInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'fr' ? 'Ajouter tout un dossier' : 'Add full folder'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 mt-1">
            {language === 'fr'
              ? 'Formats acceptés : Images (PNG, JPG, WEBP), ZIP, RAR, 7Z, PDF, DOCX'
              : 'Accepted formats: Images (PNG, JPG, WEBP), ZIP, RAR, 7Z, PDF, DOCX'}
          </p>
        </div>
      </div>

      {/* Selected files list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white">
                {files.length} {language === 'fr' ? 'fichier(s) sélectionné(s)' : 'file(s) selected'}
              </span>
            </div>
            <button
              type="button"
              onClick={clearAllFiles}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium transition-colors cursor-pointer"
            >
              {language === 'fr' ? 'Tout retirer' : 'Remove all'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {files.map((file, idx) => {
              const isImage = file.type.startsWith('image/');
              return (
                <div
                  key={`${file.name}_${file.size}_${idx}`}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {isImage ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                          onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                        />
                      ) : (
                        getFileIcon(file)
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white truncate max-w-[160px] sm:max-w-[180px]">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {formatBytes(file.size)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    aria-label={language === 'fr' ? 'Supprimer le fichier' : 'Remove file'}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
