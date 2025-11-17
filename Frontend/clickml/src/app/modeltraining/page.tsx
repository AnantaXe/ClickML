"use client";
import Navbar from "../components/Navbar";
import { useState } from "react";
import Image from "next/image";
const lrimage = "/images/modelimages/lr.png";
const dtcimage = "/images/modelimages/dtc.png";
const rfcimage = "/images/modelimages/rfc.png";
const dtrimage = "/images/modelimages/dtr.png";
const rfrimage = "/images/modelimages/rfr.png";
const arrowright = "/images/arrowright.png";
import {
    LinearRegressionForm,
    DecisionTreeRegressorForm,
    DecisionTreeClassifierForm,
    RandomForestClassifierForm,
    RandomForestRegressorForm
} from "../components/Forms";

export default function ModelTraining() {
    // ----------- Options List Sidebar -----------//

    const SidebarOptions = [
        { name: "New Pipeline", href: "" },
        { name: "Saved Pipeline", href: "" },
    ];

    const [activeSection, setActiveSection] = useState(SidebarOptions[0].name);
    const [activeModelForm, setActiveModelForm] = useState("Available Models");

    function handleSidebarClick(name: string) {
        setActiveSection(name);
    }

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
                    {/* {activeSection === "New Pipeline" && <NewDataPipeline />}
                    {activeSection === "Saved Pipeline" && (
                        <SavedDataPipelines />
                    )} */}
                    {/* <LinearRegressionForm /> */}
                    <div className="flex">
                        <Image
                            src={arrowright}
                            alt="arrow"
                            width={30}
                            height={30}
                            className={`${
                                activeModelForm === "Available Models"
                                    ? "hidden"
                                    : ""
                            } cursor-pointer mt`}
                            onClick={() =>
                                setActiveModelForm("Available Models")
                            }
                        />

                        <h1 className="text-xl pl-5">{activeModelForm}</h1>
                    </div>
                    {/* <h1 className="text-xl pl-5">Available Models</h1> */}

                    {activeModelForm === "Available Models" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 p-3">
                            <div
                                className="border-2 rounded-lg p-7 flex flex-col hover:shadow-lg cursor-pointer hover:border-amber-500 justify-center items-center gap-2"
                                onClick={() =>
                                    setActiveModelForm("Linear Regression")
                                }
                            >
                                <Image
                                    src={lrimage}
                                    alt="Linear Regression"
                                    width={100}
                                    height={100}
                                />
                                <p className="text-lg">Linear Regression</p>
                            </div>
                            <div
                                className="border-2 rounded-lg p-7 flex flex-col hover:shadow-lg cursor-pointer hover:border-amber-500 justify-center items-center"
                                onClick={() =>
                                    setActiveModelForm(
                                        "Random Forest Classifier"
                                    )
                                }
                            >
                                <Image
                                    src={rfcimage}
                                    alt="Random Forest Classifier"
                                    width={100}
                                    height={100}
                                />
                                <p className="text-lg">
                                    Random Forest Classifier
                                </p>
                            </div>
                            <div
                                className="border-2 rounded-lg p-7 flex flex-col hover:shadow-lg cursor-pointer hover:border-amber-500 justify-center items-center"
                                onClick={() =>
                                    setActiveModelForm(
                                        "Decision Tree Classifier"
                                    )
                                }
                            >
                                <Image
                                    src={dtcimage}
                                    alt="Decision Tree Classifier"
                                    width={100}
                                    height={100}
                                />
                                <p className="text-lg">
                                    Decision Tree Classifier
                                </p>
                            </div>
                            <div
                                className="border-2 rounded-lg p-7 flex flex-col hover:shadow-lg cursor-pointer hover:border-amber-500 justify-center items-center"
                                onClick={() =>
                                    setActiveModelForm(
                                        "Random Forest Regressor"
                                    )
                                }
                            >
                                <Image
                                    src={rfrimage}
                                    alt="Random Forest Regressor"
                                    width={100}
                                    height={100}
                                />
                                <p className="text-lg">
                                    Random Forest Regressor
                                </p>
                            </div>
                            <div
                                className="border-2 rounded-lg p-7 flex flex-col hover:shadow-lg cursor-pointer hover:border-amber-500 justify-center items-center"
                                onClick={() =>
                                    setActiveModelForm(
                                        "Decision Tree Regressor"
                                    )
                                }
                            >
                                <Image
                                    src={dtrimage}
                                    alt="Decision Tree Regressor"
                                    width={100}
                                    height={100}
                                />
                                <p className="text-lg">
                                    Decision Tree Regressor
                                </p>
                            </div>
                        </div>
                    )}

                    {activeModelForm === "Linear Regression" && (
                        <div className="mt-5">
                            <LinearRegressionForm />
                        </div>
                    )}

                    {activeModelForm === "Decision Tree Classifier" && (
                        <div className="mt-5">
                            <DecisionTreeClassifierForm />
                        </div>
                    )}

                    {activeModelForm === "Random Forest Classifier" && (
                        <div className="mt-5">
                            <RandomForestClassifierForm />
                        </div>
                    )}

                    {activeModelForm === "Random Forest Regressor" && (
                        <div className="mt-5">
                            <RandomForestRegressorForm />
                        </div>
                    )}

                    {activeModelForm === "Decision Tree Regressor" && (
                        <div className="mt-5">
                            <DecisionTreeRegressorForm />
                        </div>
                    )}

                    {/* Add other model forms here based on activeModelForm state */}
                </div>
            </div>
        </>
    );
}
