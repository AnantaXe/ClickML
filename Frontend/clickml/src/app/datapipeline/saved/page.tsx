export default function SavedDataPipelines() {
    return (
        <div className="flex flex-col items-center h-screen justify-center">
            <div className="w-2/3 my-4 font-bold text-2xl">
                <h1>Saved Data Pipelines</h1>
            </div>
            <div className="flex flex-col justify-center space-y-2 w-2/3 bg-green-100 border-green-600 rounded-lg border-2">
                <p className="pl-5 py-5 text-xl">/ Saved Data Pipelines</p>
                <div className="p-6 bg-white rounded-lg shadow-md mx-4 my-2">
                    <h2 className="font-bold mb-2">No saved pipelines yet.</h2>
                    <p className="text-gray-600">
                        You haven&#39;t saved any data pipelines yet. Create and
                        save your first pipeline to see it listed here.
                    </p>
                </div>
            </div>
        </div>
    );
}
