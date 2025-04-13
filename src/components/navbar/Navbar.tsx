"use client"

import Image from "next/image"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import type { RootState } from "@/store/store"
import { useRouter } from "next/navigation"
import { logoutUser } from "@/store/slice/authSlice"
import DropdownProduct from "../common/dropdown/DropdownProduct"
import { useSnackbar } from "notistack"

export default function Navbar() {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { user, loading } = useAppSelector((state: RootState) => state.auth);

    const handleLogout = async () => {
        const result = await dispatch(logoutUser());
        if (logoutUser.fulfilled.match(result)) {
            enqueueSnackbar('Logout successful!', { variant: 'success' });
            router.push("/login");
        } else {
            enqueueSnackbar(result.payload as string, { variant: 'error' });
        }
    };

    return (
        <div className="p-5 h-auto bg-white">
            <div className="flex justify-end gap-3">
                <div className="flex">
                    <DropdownProduct/>
                </div>
                <div className="flex gap-x-[8px] justify-center items-center py-2 px-4 bg-[#292929] text-white rounded-sm">
                    <Image src="/images/icon/profile.svg" alt="Profile Icon" width={20} height={20}/>
                    <p className="text-sm">
                        {loading ? <span className="animate-pulse">Loading...</span> : user?.username ?? "Guest"}
                    </p>
                </div>
                <div onClick={handleLogout} className="flex gap-x-[8px] justify-center items-center py-2 px-4 bg-[#FEF2F3] text-white rounded-sm cursor-pointer">
                    <Image className="h-[20px] w-[20px]" src="/images/icon/logout.svg" alt="Logout Icon" width={20} height={20}/>
                    <p className="text-sm text-[#EB575F]">Logout</p>
                </div>
            </div>
        </div>
    )
}