/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSnackbar } from "notistack";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/store/slice/authSlice";
import type { RootState } from "@/store/store";
import InputForm from "@/components/common/input/InputForm";
import AuthButton from "@/components/common/button/AuthButton";

export default function LoginData() {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const [formError, setFormError] = useState("");

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const { loading, error } = useAppSelector((state: RootState) => state.auth);

    const handleSubmit = async () => {
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        if (!email || !password) {
            setFormError("Email or password is required!");
            return;
        }

        const result = await dispatch(loginUser({ email, password }));

        if (loginUser.fulfilled.match(result)) {
            enqueueSnackbar('Login successful!', { variant: 'success' });
            router.push('/dashboard');
        } else {
            setFormError("Your email or password is incorrect!");
        }
    }

    const handleInputChange = () => {
        if (formError) setFormError("");
    };

    return (
        <div className="relative h-screen overflow-hidden">
            <div className="grid grid-cols-3 gap-[50px] h-full">
                <div className="grid col-span-2">
                    <div className="h-full w-full relative">
                        {/* <Image src="https://images.unsplash.com/photo-1584549239925-5554aa6b9183?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Login Image" layout="fill" objectFit="cover"/> */}
                        <Image src="/images/general/login-img.jpg" alt="Login Image" layout="fill"/>
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
                                <div className="flex flex-col mt-[50px] gap-[35px] w-[84%]">
                                    <div className="flex flex-col gap-5">
                                        <InputForm
                                            ref={emailRef}
                                            type="email"
                                            label="Email *"
                                            placeholder="Enter your email"
                                            onChange={handleInputChange}
                                        />
                                        <InputForm
                                            ref={passwordRef}
                                            type="password"
                                            label="Password *"
                                            placeholder="Enter your password"
                                            onChange={handleInputChange}
                                        />
                                        {formError && (
                                            <p className="text-red-500 text-sm">{formError}</p>
                                        )}
                                    </div>
                                    <div className="flex">
                                        <AuthButton
                                            onClick={handleSubmit}
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