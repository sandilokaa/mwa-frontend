"use client"

import InputForm from "@/components/common/input/InputForm";
import AuthButton from "@/components/common/button/AuthButton";
import Image from "next/image";

export default function LoginData() {
    return (
        <div className="relative h-screen overflow-hidden">
            <div className="grid grid-cols-3 gap-[50px] h-full">
                <div className="grid col-span-2">
                    <div className="h-full w-full relative">
                        <Image src="/images/general/login-image.svg" alt="Login Image" layout="fill" objectFit="cover"/>
                    </div>
                </div>
                <div className="grid grid-cols-1">
                    <div className="flex flex-col h-full">
                        <div className="flex justify-center items-center h-full">
                            <div className="flex flex-col">
                                <div className="flex">
                                    <Image className="w-[180px] h-auto" src="/images/icon/prodflow-logo.svg" alt="Logo Image" width={100} height={100}/>
                                </div>
                                <div className="flex flex-col gap-4 w-[90%] mt-5">
                                    <p className="text-[32px] font-bold">Welcome to the Merpati Wahana Raya Dashboard</p>
                                    <p className="text-sm font-normal">Sign in to access full features</p>
                                </div>
                                <div className="flex flex-col mt-[50px] gap-[35px] w-[80%]">
                                    <div className="flex flex-col gap-5">
                                        <InputForm
                                            label="Email *"
                                            placeholder="Enter your email"
                                        />
                                        <InputForm
                                            label="Password *"
                                            placeholder="Enter your password"
                                        />
                                    </div>
                                    <div className="flex">
                                        <AuthButton
                                            buttonText="Sign In"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}