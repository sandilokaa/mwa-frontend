import { useState } from "react";

export default function useFileInputs() {
    const [fileInputs, setFileInputs] = useState<File[][]>([]);

    const handleAddFileInput = () => {
        setFileInputs((prev) => [...prev, []]);
    };

    const handleFileChange = (files: File[], index: number): void => {
        const updatedFiles = [...fileInputs];
        updatedFiles[index] = files;
        setFileInputs(updatedFiles);
    };

    const removeFileInput = (index: number) => {
        setFileInputs((prev) => prev.filter((_, i) => i !== index));
    };

    return {
        fileInputs,
        handleAddFileInput,
        handleFileChange,
        removeFileInput,
    };
}
