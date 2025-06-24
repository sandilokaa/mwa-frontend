"use client"

import Link from "next/link";
import AddButton from "@/components/common/button/AddButton";

export default function ShowData() {
    return (
        <div>
            <div className="flex flex-col gap-5">
                <p className="font-bold">Product</p>
                <div className="flex justify-between">
                    <Link href="/product/add">
                        <AddButton
                            buttonText="Add Product"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}
