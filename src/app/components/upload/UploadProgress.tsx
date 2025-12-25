import { Progress } from '@/app/components/ui/progress';
import { CheckCircle, XCircle, Loader2, Music } from 'lucide-react';
import type { UploadFile } from '@/types/upload';

interface UploadProgressProps {
  uploads: UploadFile[];
}

export function UploadProgress({ uploads }: UploadProgressProps) {
  if (uploads.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Upload Progress</h3>
      
      <div className="space-y-2">
        {uploads.map((upload) => (
          <div
            key={upload.id}
            className="p-3 border rounded-lg bg-card"
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {upload.status === 'success' && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {upload.status === 'error' && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                {upload.status === 'uploading' && (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                )}
                {upload.status === 'pending' && (
                  <Music className="w-5 h-5 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {upload.file.name}
                </p>
                {upload.error && (
                  <p className="text-xs text-red-500 mt-1">{upload.error}</p>
                )}
                {upload.status === 'uploading' && (
                  <Progress value={upload.progress} className="mt-2" />
                )}
              </div>

              <div className="flex-shrink-0 text-xs text-muted-foreground">
                {upload.status === 'uploading' && `${Math.round(upload.progress)}%`}
                {upload.status === 'success' && 'Complete'}
                {upload.status === 'error' && 'Failed'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
