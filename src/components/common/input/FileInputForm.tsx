import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface FileInputFormProps {
    label: string;
    acceptFile?: string;
}

const FileInputForm = forwardRef<HTMLInputElement, FileInputFormProps>(({ label, acceptFile }, ref) => {

    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => fileInputRef.current as HTMLInputElement);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
        setFiles([e.target.files[0]]);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) {
        setFiles([e.dataTransfer.files[0]]);
        }
    };

    const handleRemoveFile = (fileName: string) => {
        setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
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
                />

                {files.length > 0 && files[0] ? (
                    <div className="flex items-center gap-5 bg-[#FAFAFA] rounded p-3 w-fit">
                        <div className="flex gap-3">
                            <Image src="/images/icon/document-upload.svg" alt="Upload Icon" width={20} height={20} />
                            <p className="text-sm text-[#292929]">{files[0].name}</p>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile(files[0].name);
                            }}
                            className="ml-auto cursor-pointer"
                        >
                            <X className="w-4 h-4 text-red-500" />
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="flex justify-center">
                            <Image src="/images/icon/document-upload.svg" alt="Upload Icon" width={24} height={24}/>
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
