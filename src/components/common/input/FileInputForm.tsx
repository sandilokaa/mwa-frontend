'use client'

import { useRef, useState, forwardRef, useImperativeHandle, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface FileInputFormProps {
    label: string;
    acceptFile?: string;
    defaultFile?: string;
    multiple?: boolean;
    onFileChange?: (files: File[]) => void;
}

const FileInputForm = forwardRef<HTMLInputElement, FileInputFormProps>(({ label, acceptFile, defaultFile, multiple, onFileChange }, ref) => {

    const [files, setFiles] = useState<File[]>([]);
    const [defaultFileName, setDefaultFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => fileInputRef.current as HTMLInputElement);

    useEffect(() => {
        if (defaultFile) {
            setDefaultFileName(defaultFile);
        }
    }, [defaultFile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFiles(selectedFiles);
            onFileChange?.(selectedFiles);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) {
            const droppedFiles = Array.from(e.dataTransfer.files);
            setFiles(droppedFiles);
            onFileChange?.(droppedFiles);
        }
    };

    const handleRemoveFile = () => {
        setFiles([]);
        setDefaultFileName(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">{label}</label>
            <div
                className="p-6 border border-[#EFEFEF] rounded-lg cursor-pointer bg-white hover:border-[#D4D4D4] transition-all"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    id="fileInput"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept={acceptFile}
                    multiple={multiple}
                />
                {files.length > 0 ? (
                    <div className="flex gap-2">
                        {files.map((file, index) => (
                            <div key={index} className="flex items-center gap-5 bg-[#FAFAFA] rounded p-3 w-fit">
                                <div className="flex gap-3">
                                    <Image src="/images/icon/document-upload.svg" alt="Upload Icon" width={20} height={20} />
                                    <p className="text-sm text-black">{file.name}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newFiles = [...files];
                                        newFiles.splice(index, 1);
                                        setFiles(newFiles);
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = "";
                                        }
                                        onFileChange?.(newFiles);
                                    }}
                                    className="ml-auto cursor-pointer"
                                >
                                    <X className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : defaultFileName ? (
                    <div className="flex items-center gap-5 bg-[#FAFAFA] rounded p-3 w-fit">
                        <div className="flex gap-3">
                            <Image src="/images/icon/document-upload.svg" alt="Upload Icon" width={20} height={20} />
                            <p className="text-sm text-[#292929]">
                                {defaultFileName}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile();
                            }}
                            className="ml-auto cursor-pointer"
                        >
                            <X className="w-4 h-4 text-red-500" />
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="flex justify-center">
                            <Image src="/images/icon/document-upload.svg" alt="Upload Icon" width={24} height={24} />
                        </div>
                        <p className="text-sm text-[#292929] mt-2">
                            Drag and drop your file 
                            <br />
                            or <span className="text-[#2181E8] ml-[1px]">search</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
});

FileInputForm.displayName = 'FileInputForm';

export default FileInputForm;
