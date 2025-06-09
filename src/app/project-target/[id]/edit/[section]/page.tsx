"use client"

import Image from "next/image";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useParams } from "next/navigation";
import { fetchProjectTargetDetail } from "@/store/slice/projectTarget/getDetailSlice";
import { useEffect, useState, useRef } from "react";
import { projectTargetMeta } from "@/utils/section/projectTargetMeta";
import useFileInputs from "@/hooks/useFileInput";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { updateProjectTargetData } from "@/store/slice/projectTarget/updateSlice";

import InputForm from "@/components/common/input/InputForm";
import DropdownProductForm from "@/components/common/dropdown/DropdownProductForm";
import SubmitButton from "@/components/common/button/SubmitButton";
import TextAreaForm from "@/components/common/input/TextAreaForm";
import FileInputForm from "@/components/common/input/FileInputForm";
import LargePhotoModal from "@/components/common/modal/LargePhotoModal";

export default function EditData() {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const id = Number(params.id);

    const { section } = useParams() as { section: keyof typeof projectTargetMeta };
    const meta = projectTargetMeta[section];

    const { products } = useAppSelector((state) => state.productList);

    /* ------------------ Get Detail ------------------ */
    
    const { projectTargetDetail } = useAppSelector(state => state.projectTargetDetail);

    useEffect(() => {
        if (id) {
            dispatch(fetchProjectTargetDetail({ id }));
        }
    }, [id, dispatch]);

    /* ------------------ End Get Detail ------------------ */


    /* ---------------- Large Photo Update ---------------- */

    const [openModal, setOpenModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const largePhotoModal = () => {
        setOpenModal(true);
    };

    /* ---------------- End Large Photo Update ---------------- */


    /* ------------------ Update Project Target ------------------ */

    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
    const [imageList, setImageList] = useState(projectTargetDetail?.ProjectTargetImages || []);

    const handleRemoveImageFromList = (imageId: number) => {
        setDeletedImageIds(prev => [...prev, imageId]);
        setImageList(prev => prev.filter(img => img.id !== imageId));
    };

    const {
        fileInputs,
        handleAddFileInput,
        handleFileChange,
        removeFileInput
    } = useFileInputs();

    const nameRef = useRef<HTMLInputElement>(null);
    const informationRef = useRef<HTMLTextAreaElement | null>(null);
    const fileRefs = useRef<(HTMLInputElement | null)[]>([])
    const selectedProductIdRef = useRef<number>(0);

    useEffect(() => {
        if (projectTargetDetail?.ProjectTargetImages && imageList.length === 0) {
            setImageList(projectTargetDetail.ProjectTargetImages);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectTargetDetail]);

    useEffect(() => {
        if (projectTargetDetail?.productId) {
            selectedProductIdRef.current = projectTargetDetail.productId;
        }
    }, [projectTargetDetail]);

    const handleSubmit = () => {
        try {
            if (!projectTargetDetail?.id) {
                throw new Error("Procurement ID is required");
            }

            const newFiles: File[] = fileInputs.flat();
            const remainingOldImages = imageList.length;
            const totalImagesToSubmit = remainingOldImages + newFiles.length;

            if (totalImagesToSubmit === 0) {
                enqueueSnackbar("Please upload at least one image or keep at least one existing image", { variant: "error" });
                return;
            }

            const updatedImageId: number[] = [];
            const updatedImage: File[] = [];

            fileRefs.current.forEach((input, idx) => {
                if (input?.files && input.files.length > 0) {
                    updatedImageId.push(imageList[idx].id);
                    updatedImage.push(input.files[0]);
                }
            });

            const payload = {
                id: projectTargetDetail?.id,
                productId: selectedProductIdRef.current,
                name: `${meta.name}`,
                information: informationRef.current?.value || '',
                deletedImageId: deletedImageIds,
                picture: newFiles,
                updatedImageId,
                updatedImage
            };

            dispatch(updateProjectTargetData(payload));
            enqueueSnackbar("You have successfully updated the data", { variant: "success" });

            router.push("/project-target");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            enqueueSnackbar(error.message, { variant: "error" });
        }
        };

    /* ------------------ End Update Project Target ------------------ */

    return (
        <div>
            <LargePhotoModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                imgUrl={
                    selectedImage 
                    ? `${process.env.NEXT_PUBLIC_API_URL}/${selectedImage}` 
                    : ''
                }
                downloadUrl={
                    selectedImage 
                    ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/download/${selectedImage}` 
                    : ''
                }
            />
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/project-target">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Edit {meta.name}</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">{meta.name} Form</p>
                <div className="flex flex-col gap-y-5 mt-5">
                    <div className="flex flex-col gap-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <InputForm
                                    label={`${meta.label} Name *`}
                                    placeholder="Example: 6x6 Conversion Design"
                                    defaultValue={projectTargetDetail?.name}
                                    disable
                                    ref={nameRef}
                                />
                            </div>
                            <DropdownProductForm
                                label="Product *"
                                options={products}
                                onSelect={(value) => {
                                    selectedProductIdRef.current = value.id;
                                }}
                                defaultValue={projectTargetDetail?.productId}
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            <TextAreaForm
                                label="Information *"
                                placeholder="Example: Describe the information"
                                rows={3}
                                defaultValue={projectTargetDetail?.information}
                                ref={informationRef}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {imageList.map((image, index) => (
                                <div key={`existing-${index}`} className="flex justify-between items-center gap-4">
                                    <div className="w-full">
                                        <FileInputForm
                                            label={`Uploaded Image ${index + 1}`}
                                            acceptFile=".jpg,.jpeg,.png"
                                            defaultFile={image.picture.split("/").pop()}
                                            ref={(el) => { fileRefs.current[index] = el }}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div 
                                            onClick={() => {
                                                setSelectedImage(image.picture);
                                                largePhotoModal();
                                            }}
                                            className="p-2 rounded-sm bg-[#2181E8] cursor-pointer"
                                        >
                                            <Image src="/images/icon/eye.svg" alt="view icon" height={16} width={16} />
                                        </div>
                                        <div 
                                            onClick={() => handleRemoveImageFromList(image.id)}
                                            className="p-2 rounded-sm bg-[#D62C35] cursor-pointer h-fit"
                                        >
                                            <Image src="/images/icon/trash.svg" alt="view icon" height={16} width={16}/>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="grid grid-cols-1 gap-2">
                                {fileInputs.map((_, index) => (
                                    <div key={index} className="flex justify-between items-center gap-4">
                                        <div className="w-full">
                                            <FileInputForm
                                                key={index}
                                                label={`Upload Documents *`}
                                                acceptFile=".jpg,.jpeg,.png"
                                                onFileChange={(files: File[]) => handleFileChange(files, index)}
                                            />
                                        </div>
                                        <div 
                                            onClick={() => removeFileInput(index)}
                                            className="p-2 rounded-sm bg-[#D62C35] cursor-pointer h-fit"
                                        >
                                            <Image  src="/images/icon/trash.svg" alt="view icon" height={16} width={16}/>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="text-blue-600 text-sm mt-4 cursor-pointer"
                                    onClick={handleAddFileInput}
                                >
                                    + Add another file
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <SubmitButton
                            onClick={handleSubmit}
                            buttonText="Save Change"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}