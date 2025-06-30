
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Image, X } from 'lucide-react';

interface ImageUploaderProps {
  questionId: string;
  image?: File;
  onImageUpload: (file: File) => void;
  onImageRemove: () => void;
  isDiagramRequired?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  questionId,
  image,
  onImageUpload,
  onImageRemove,
  isDiagramRequired = false
}) => {
  return (
    <div className="space-y-2">
      <Label>
        {isDiagramRequired ? 'Diagram Image' : 'Question Image (Optional)'}
      </Label>
      {!image ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onImageUpload(file);
              }
            }}
            className="hidden"
            id={`image-${questionId}`}
          />
          <label
            htmlFor={`image-${questionId}`}
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <Image className="h-8 w-8 text-gray-400" />
            <span className="text-sm text-gray-500">Click to upload image</span>
          </label>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <Image className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">{image.name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onImageRemove}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
