"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { updateMonitoringForm, resetMonitoringForm } from "@/redux/Features/FormStatesSlices/FormStateSlices";

export default function MonitoringForm() {

    const MonitoringFormState = useAppSelector((state) => state.monitoring);
    const dispatch = useAppDispatch();
    type MonitoringFormState = typeof MonitoringFormState;
    const setMonitoringInitialState = (newState: MonitoringFormState) => {
        // This function should dispatch an action to update the Redux state
        dispatch(updateMonitoringForm(newState));
    }

    return (
        <>
            <div className="space-y-3 w-2xl">
                <h2 className="font-bold text-xl">Monitoring Pipeline</h2>
                <input
                    placeholder="Pipeline Name"
                    value={MonitoringFormState.pipelineName}
                    onChange={(e) =>
                        setMonitoringInitialState({
                            ...MonitoringFormState,
                            pipelineName: e.target.value,
                        })
                    }
                    className="w-full border p-2 rounded"
                />
                <input
                    placeholder="Metric (row_count, latency)"
                    value={MonitoringFormState.metric}
                    onChange={(e) =>
                        setMonitoringInitialState({
                            ...MonitoringFormState,
                            metric: e.target.value,
                        })
                    }
                    className="w-full border p-2 rounded"
                />
                <input
                    placeholder="Alert Email"
                    value={MonitoringFormState.alertEmail}
                    onChange={(e) =>
                        setMonitoringInitialState({
                            ...MonitoringFormState,
                            alertEmail: e.target.value,
                        })
                    }
                    className="w-full border p-2 rounded"
                />
            </div>
        </>
    );
}
