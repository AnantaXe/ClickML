"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function CollapsibleForm() {
    const [open, setOpen] = useState(false);

    return (
        <div className="border rounded-xl shadow-sm p-3 w-full transition-all">
            {/* Header */}
            <div
                className="flex justify-between items-center cursor-pointer select-none"
                onClick={() => setOpen(!open)}
            >
                <h2 className="text-lg font-semibold">dfjksdj</h2>

                {open ? (
                    <ChevronUp className="w-5 h-5 transition-transform" />
                ) : (
                    <ChevronDown className="w-5 h-5 transition-transform" />
                )}
            </div>

            {/* Content Area */}
            <div
                className={`transition-all overflow-hidden ${
                    open
                        ? "max-h-[1000px] opacity-100 mt-3"
                        : "max-h-0 opacity-0"
                }`}
            >
                fdskjfks
            </div>
        </div>
    );
}
