'use client';

import { useState, useRef } from 'react';
import { FiUpload, FiX, FiImage, FiMove } from 'react-icons/fi';
import styles from './ImageUploader.module.css';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  folder?: string;
  maxImages?: number;
  single?: boolean;
  label?: string;
}

export default function ImageUploader({
  images,
  onChange,
  folder = 'blog',
  maxImages = 10,
  single = false,
  label = 'الصور',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = single ? 1 : maxImages - images.length;
    if (remainingSlots <= 0) {
      setError(`الحد الأقصى ${maxImages} صور`);
      return;
    }

    setUploading(true);
    setError('');

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    const newImages: string[] = [];

    for (const file of filesToUpload) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'فشل رفع الملف');
        }

        newImages.push(data.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ أثناء الرفع');
      }
    }

    if (newImages.length > 0) {
      if (single) {
        onChange(newImages);
      } else {
        onChange([...images, ...newImages]);
      }
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = async (index: number) => {
    const imageUrl = images[index];
    
    // Try to delete from server
    try {
      await fetch(`/api/upload?url=${encodeURIComponent(imageUrl)}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Failed to delete image:', err);
    }

    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  // Drag and drop reordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    
    onChange(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className={styles.uploader}>
      <label className={styles.label}>{label}</label>
      
      {/* Upload Area */}
      <div
        className={styles.dropzone}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleUpload(e.dataTransfer.files);
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple={!single}
          onChange={(e) => handleUpload(e.target.files)}
          className={styles.fileInput}
        />
        
        {uploading ? (
          <div className={styles.uploading}>
            <span className={styles.spinner}></span>
            <span>جاري الرفع...</span>
          </div>
        ) : (
          <div className={styles.dropzoneContent}>
            <FiUpload className={styles.uploadIcon} />
            <p>اسحب الصور هنا أو انقر للاختيار</p>
            <span className={styles.hint}>JPG, PNG, WebP, GIF - حد أقصى 5MB</span>
          </div>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className={styles.imageGrid}>
          {images.map((url, index) => (
            <div
              key={url}
              className={`${styles.imageItem} ${draggedIndex === index ? styles.dragging : ''}`}
              draggable={!single}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <img src={url} alt={`صورة ${index + 1}`} />
              <div className={styles.imageOverlay}>
                {!single && (
                  <span className={styles.dragHandle}>
                    <FiMove />
                  </span>
                )}
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => handleRemove(index)}
                >
                  <FiX />
                </button>
              </div>
              {index === 0 && !single && (
                <span className={styles.mainBadge}>رئيسية</span>
              )}
            </div>
          ))}
        </div>
      )}

      {!single && images.length > 0 && (
        <p className={styles.hint}>اسحب الصور لإعادة ترتيبها. الصورة الأولى هي الصورة الرئيسية.</p>
      )}
    </div>
  );
}
