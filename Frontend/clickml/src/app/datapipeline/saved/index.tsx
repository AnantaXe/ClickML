export default function SavedDataPipelines() {
    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-4xl text-center">
                <div className="flex flex-col justify-center space-y-6 w-full bg-[#1A1A1A] border border-[#333333] rounded-xl p-8">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <span className="text-xl font-medium text-gray-400">
                            / Saved Data Pipelines
                        </span>
                    </div>

                    <div className="p-10 bg-[#0a0a0a] border border-[#333333] rounded-lg shadow-inner mx-auto w-full max-w-2xl">
                        <h2 className="text-xl font-bold text-white mb-3">
                            No saved pipelines yet
                        </h2>
                        <p className="text-gray-400">
                            You haven&#39;t saved any data pipelines yet. Create
                            and save your first pipeline to see it listed here.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
