import { X, Upload, Edit, Trash2 } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "./button";
import { ToastError } from "@/utils/ToastContainers";
import ReactCrop, { type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'


interface UploadImageProps {
  onFileSelect: (file: File) => void;
  onClose: () => void;
}

const UploadImage = ({onFileSelect,onClose}:UploadImageProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5
  });

  const handleFileSelect = (file:File) => {
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      ToastError('Please select a valid image format (JPEG, PNG, JPG, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      ToastError('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) {
        setPreviewUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    handleFileSelect(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    
    // console.log('Selected file:', selectedFile);
    // console.log('File name:', selectedFile.name);
    // console.log('File size:', selectedFile.size);
    // console.log('File type:', selectedFile.type);
    // console.log('Crop settings:', crop);
    // console.log('Preview URL:', previewUrl);

     onFileSelect(selectedFile);
    onClose();
  };

  const formatFileSize = (bytes:number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm p-4">
      <div className="bg-neutral-900 text-neutral-200 w-full max-w-md sm:max-w-lg h-[70vh] sm:h-[80vh] px-4 sm:px-6 py-4 sm:py-6 rounded-2xl shadow-xl relative overflow-y-auto">
        
        <button 
        className="absolute top-3 right-3 sm:top-4 sm:right-4 text-neutral-400 hover:text-white transition"
        onClick={()=>onClose()}>
        
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <h1 className="text-xl sm:text-2xl font-semibold text-center mb-4 sm:mb-6 tracking-wide">
          Upload Image
        </h1>

        <div 
          className={`border-2 border-dashed w-full h-48 sm:h-56 md:h-64 rounded-xl px-3 sm:px-6 py-3 sm:py-6 flex items-center justify-center transition ${
            isDragOver 
              ? 'border-blue-400 bg-blue-400/10' 
              : selectedFile 
                ? 'border-green-400 bg-green-400/5' 
                : 'border-neutral-500 hover:border-white hover:bg-neutral-700/40'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          <div className="w-full h-full rounded-xl flex flex-col justify-center items-center space-y-3 p-6">
            {previewUrl ? (
              <div className="w-full h-full flex flex-col items-center space-y-2">
                <div className="max-w-full max-h-32">
                  <ReactCrop 
                    crop={crop} 
                    onChange={(newCrop) => setCrop(newCrop)}
                    aspect={1}
                    circularCrop
                  >
                    <img 
                      src={previewUrl} 
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: '128px' }}
                    />
                  </ReactCrop>
                </div>
                <p className="text-sm text-green-400 text-center">
                  {selectedFile?.name}
                </p>
                <p className="text-xs text-neutral-400">
                  {formatFileSize(selectedFile?.size || 0)}
                </p>
              </div>
            ) : (
              <>
                <Upload className="w-16 h-16 opacity-70 text-neutral-400" />
                <p className="text-lg text-center">
                  Drag & drop avatar or{" "}
                  <span 
                    className="text-blue-400 hover:underline cursor-pointer"
                    onClick={handleBrowseClick}
                  >
                    Browse
                  </span>
                </p>
                <p className="text-sm text-neutral-400 text-center">
                  Supported formats: JPEG, PNG, JPG, WEBP <br /> Max size: 5MB
                </p>
              </>
            )}
          </div>
        </div>

        {selectedFile && (
          <div className="mt-4 sm:mt-6 w-full">
            <p className="text-xs sm:text-sm mb-2 text-neutral-300">
              Ready to upload - 1/1 file
            </p>
            <div className="relative bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 flex items-center justify-between text-xs sm:text-sm">
              <span className="truncate flex-1 mr-2">{selectedFile.name}</span>
              
              <div className="flex space-x-1 sm:space-x-2">
                <Button 
                  className="text-neutral-500 hover:text-blue-400 transition p-1"
                  onClick={handleBrowseClick}
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button 
                  className="text-neutral-500 hover:text-red-400 transition p-1"
                  onClick={handleRemoveFile}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>

              {/* Progress bar removed */}
            </div>
          </div>
        )}

        <div className="mt-6 sm:mt-8 w-full">
          <Button 
            className={`px-4 py-2 sm:py-3 w-full rounded-md text-sm transition ${
              selectedFile
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
            }`}
            onClick={handleUpload}
            disabled={!selectedFile}
          >
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;