"use client";

import Image from "next/image";

type SearchInputProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
    return (
        <div className="relative">
            <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" src="/images/icon/search-normal.svg" alt="Search Icon" width={20} height={20}/>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder="Search"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 bg-white text-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 h-[45px] text-sm"
            />
        </div>
    );
}
