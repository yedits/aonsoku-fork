import { useCallback, useState } from 'react';
import { Upload, Music, X } from 'lucide-react';
import type { UploadFile } from '@/types/upload';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  acceptedFormats?: string[];
}

export function FileUploader({ 
  onFilesSelected,
  acceptedFormats = ['.mp3', '.flac', '.m4a', '.ogg', '.opus', '.wav', '.aac']
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) => {
      const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
      return acceptedFormats.includes(ext);
    });

    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [acceptedFormats, onFilesSelected]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  }, [onFilesSelected]);

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-lg p-12 text-center
        transition-colors duration-200 cursor-pointer
        ${isDragging 
          ? 'border-primary bg-primary/10' 
          : 'border-border hover:border-primary/50'
        }
      `}
      onDrag={handleDrag}
      onDragStart={handleDrag}
      onDragEnd={handleDragOut}
      onDragOver={handleDragIn}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        accept={acceptedFormats.join(',')}
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 rounded-full bg-primary/10">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-1">
            {isDragging ? 'Drop files here' : 'Upload Music Files'}
          </h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop or click to select files
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Supported: {acceptedFormats.join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
}
