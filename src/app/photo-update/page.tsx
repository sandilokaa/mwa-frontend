"use client"

import Link from "next/link";
import AddButton from "@/components/common/button/AddButton";
import SearchInput from "@/components/common/input/SearchInput";
import DropdownCategory from "@/components/common/dropdown/DropdownFilterCategory";

export default function ShowData() {
    return (
        <div>
            <div className="flex flex-col gap-y-5">
                <p className="font-bold">Photo Update</p>
                <div className="flex justify-between">
                    <Link href="/highlight-issue/add">
                        <AddButton
                            buttonText="Add Photo"
                            height="45px"
                            width="200px"
                        />
                    </Link>
                    <div className="flex gap-5">
                        <DropdownCategory
                            options={["Chassis", "Drivetrain", "Wheel", "Suspension"]}
                            onSelect={() => ""}
                        />
                        <SearchInput
                            value=""
                            onChange={() => ""}
                        />
                    </div>
                </div>
            </div>
            <div className="mt-10">
                <div className="grid grid-cols-1">
                    <p className="font-bold">Chassis</p>
                </div>
                <div className="mt-5">
                    <div className="grid grid-cols-4 gap-4">
                        <div>halo</div>
                        <div>halo</div>
                        <div>halo</div>
                        <div>halo</div>
                    </div>
                </div>
            </div>
        </div>
    );
}