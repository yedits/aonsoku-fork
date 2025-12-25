import { useState } from 'react';
import { FileUploader } from '@/app/components/upload/FileUploader';
import { MetadataEditor } from '@/app/components/upload/MetadataEditor';
import { UploadProgress } from '@/app/components/upload/UploadProgress';
import { Button } from '@/app/components/ui/button';
import { uploadService } from '@/api/uploadService';
import type { UploadFile, MusicMetadata } from '@/types/upload';
import { toast } from 'react-toastify';
import { Upload, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';

export default function UploadPage() {
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const [editingFile, setEditingFile] = useState<UploadFile | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleFilesSelected = async (files: File[]) => {
    const newUploads: UploadFile[] = files.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      status: 'pending',
      progress: 0,
    }));

    setUploads((prev) => [...prev, ...newUploads]);

    // Auto-extract metadata for each file
    for (const upload of newUploads) {
      try {
        const metadataResponse = await uploadService.extractMetadata(upload.file);
        setUploads((prev) =>
          prev.map((u) =>
            u.id === upload.id
              ? { ...u, metadata: metadataResponse.common }
              : u
          )
        );
      } catch (error) {
        console.error('Failed to extract metadata:', error);
      }
    }
  };

  const handleEditMetadata = (upload: UploadFile) => {
    setEditingFile(upload);
    setIsEditorOpen(true);
  };

  const handleSaveMetadata = (metadata: MusicMetadata) => {
    if (editingFile) {
      setUploads((prev) =>
        prev.map((u) =>
          u.id === editingFile.id ? { ...u, metadata } : u
        )
      );
      setIsEditorOpen(false);
      setEditingFile(null);
      toast.success('Metadata updated');
    }
  };

  const handleUploadAll = async () => {
    const pendingUploads = uploads.filter((u) => u.status === 'pending');

    for (const upload of pendingUploads) {
      try {
        // Update status to uploading
        setUploads((prev) =>
          prev.map((u) =>
            u.id === upload.id ? { ...u, status: 'uploading', progress: 0 } : u
          )
        );

        // Upload file
        await uploadService.uploadFile(
          upload.file,
          upload.metadata,
          (progress) => {
            setUploads((prev) =>
              prev.map((u) =>
                u.id === upload.id ? { ...u, progress } : u
              )
            );
          }
        );

        // Mark as success
        setUploads((prev) =>
          prev.map((u) =>
            u.id === upload.id ? { ...u, status: 'success', progress: 100 } : u
          )
        );

        toast.success(`${upload.file.name} uploaded successfully`);
      } catch (error) {
        // Mark as error
        setUploads((prev) =>
          prev.map((u) =>
            u.id === upload.id
              ? {
                  ...u,
                  status: 'error',
                  error: error instanceof Error ? error.message : 'Upload failed',
                }
              : u
          )
        );

        toast.error(`Failed to upload ${upload.file.name}`);
      }
    }
  };

  const handleClearCompleted = () => {
    setUploads((prev) => prev.filter((u) => u.status !== 'success'));
  };

  const pendingCount = uploads.filter((u) => u.status === 'pending').length;
  const uploadingCount = uploads.filter((u) => u.status === 'uploading').length;

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upload Music</h1>
        <p className="text-muted-foreground">
          Upload your music files to Navidrome with custom metadata
        </p>
      </div>

      <div className="space-y-6">
        <FileUploader onFilesSelected={handleFilesSelected} />

        {uploads.length > 0 && (
          <>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={handleClearCompleted}
                disabled={uploads.filter((u) => u.status === 'success').length === 0}
              >
                Clear Completed
              </Button>
              <Button
                onClick={handleUploadAll}
                disabled={pendingCount === 0 || uploadingCount > 0}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload {pendingCount} {pendingCount === 1 ? 'File' : 'Files'}
              </Button>
            </div>

            <UploadProgress uploads={uploads} />

            {uploads.some((u) => u.status === 'pending') && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Pending Files</h3>
                <div className="space-y-2">
                  {uploads
                    .filter((u) => u.status === 'pending')
                    .map((upload) => (
                      <div
                        key={upload.id}
                        className="p-3 border rounded-lg bg-card flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{upload.file.name}</p>
                          {upload.metadata && (
                            <p className="text-sm text-muted-foreground">
                              {upload.metadata.artist} - {upload.metadata.title || 'Unknown'}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditMetadata(upload)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Edit Metadata
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Metadata</DialogTitle>
            <DialogDescription>
              {editingFile?.file.name}
            </DialogDescription>
          </DialogHeader>
          {editingFile && (
            <MetadataEditor
              initialMetadata={editingFile.metadata}
              onSave={handleSaveMetadata}
              onCancel={() => setIsEditorOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
