"use client";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import SavedDataPipelines from "./saved";
import NewDataPipeline from "./new";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";

export default function DataPipeline() {
    // ----------- Options List Sidebar -----------//

    const SidebarOptions = [
        { name: "New Pipeline", href: "" },
        { name: "Saved Pipeline", href: "" },
    ];

    const [activeSection, setActiveSection] = useState(SidebarOptions[0].name);

    // useEffect(() => {
    //     // Set the first option as current on initial render
    //     setSidebarOptions((prevOptions) =>
    //         prevOptions.map((option, index) =>
    //             index === 0 ? { ...option, current: true } : { ...option, current: false }
    //         )
    //     );
    // }, []);

    function handleSidebarClick(name: string) {
        setActiveSection(name);
    }

    // const [pipelineName, setPipelineName] = useState("");
    // const [resultPreview, setResultPreview] = useState<
    //     Record<string, unknown>[]
    // >([]);

    // const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

    // const selectedFeatures = useAppSelector((state) => state.fieldnames.selectedFieldname);
    // const dispatch = useAppDispatch();

    // const [initialData, setInitialData] = useState({
    //     pipelineName: "Initial Pipeline",
    //     steps: [
    //         {
    //             type: "fetch_api",
    //             config: {
    //                 url: "https://openholidaysapi.org/PublicHolidays?countryIsoCode=DE&validFrom=2023-01-01&validTo=2023-12-31&languageIsoCode=DE&subdivisionCode=DE-BE",
    //                 method: "GET",
    //                 headers: { Authorization: "Bearer token123" },
    //                 params: { limit: 100 },
    //             },
    //         },
    //     ],
    // });

    // function sendPipelineData() {
    //     fetch("http://localhost:3002/etl/fetchData", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify(initialData),
    //     })
    //         .then((res) => res.json())
    //         .then((data) => {
    //             setPipelineName(data.pipelineName || "");
    //             const json = data.json;
    //             setResultPreview(json);
    //             console.log("Fetch response:", json);
    //             alert(data.message || "Pipeline sent successfully!");
    //         })
    //         .catch(() => {
    //             alert("Error sending pipeline");
    //         });
    // }

    // // Toggle feature selection
    // function toggleFeature(key: string) {
    //     dispatch({
    //         type: "fieldnames/toggleFieldname",
    //         payload: key,
    //     });
    // }

    // // Send selected features to server for transformation
    // function sendSelectedFeatures() {
    //     const cleanedFeatures = selectedFeatures.map(
    //         (f) => f.replace(/^"|"$/g, "") // removes surrounding quotes
    //     );

    //     fetch("http://localhost:3002/etl/selectfeatures", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ features: cleanedFeatures }),
    //     })
    //         .then((res) => res.json())
    //         .then((data) => {
    //             console.log("Transformation response:", data);
    //             alert("Transformation complete!");
    //         })
    //         .catch(() => {
    //             alert("Error transforming features");
    //         });
    // }

    return (
        <>
            <Navbar />
            <div className="flex flex-col md:flex-row">
                {/* Sidebar */}
                <div className="sidebar md:w-1/6 bg-gray-200 p-4">
                    <ul className="flex md:flex-col flex-row">
                        {SidebarOptions.map((option) => (
                            <li
                                key={option.name}
                                onClick={() => handleSidebarClick(option.name)}
                                className={`p-4 hover:font-bold cursor-pointer ${
                                    activeSection === option.name
                                        ? "font-bold border-gray-700 md:border-l-4 md:px-3 border-b-4 md:border-b-0"
                                        : ""
                                }`}
                            >
                                <span>{option.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Main Content */}
                <div className="main-content flex-1 p-4">
                    {activeSection === "New Pipeline" && <NewDataPipeline />}
                    {activeSection === "Saved Pipeline" && (
                        <SavedDataPipelines />
                    )}
                </div>
            </div>
        </>
    );
}
