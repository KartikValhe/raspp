import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, RefreshCw, Download } from 'lucide-react';
import api from '../../services/api';
import { PageHeader } from '../../components/PageHeader';

const BulkPlacementPrediction: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [results, setResults] = useState<any[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/api/v1/placement/upload-csv', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResults(response.data.predictions);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Error uploading file');
        } finally {
            setUploading(false);
        }
    };

    const downloadSample = () => {
        // Create sample CSV content
        const headers = ["student_id", "cgpa", "tenth_percentage", "twelfth_percentage", "backlogs", "java_skill", "python_skill", "dsa_level", "web_dev", "db_knowledge", "projects_count", "internship_count", "aptitude_score", "coding_score", "communication_skill", "hackathons_count", "certifications_count", "mock_interviews", "placement_training_attended"];
        const row = ["STU001", "8.5", "90", "88", "0", "4", "3", "2", "3", "4", "2", "1", "75", "80", "4", "1", "2", "5", "1"];
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + row.join(",");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "placement_prediction_sample.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="page-wrap">
            <div className="max-w-7xl mx-auto space-y-6">
                <PageHeader
                    icon={Upload}
                    title="Bulk Placement Prediction"
                    subtitle="Upload batch student CSV data to forecast placement probability with machine learning"
                    iconClass="bg-primary-500"
                    actions={
                        <button
                            onClick={downloadSample}
                            className="btn-secondary"
                        >
                            <Download size={16} />
                            <span>Sample CSV</span>
                        </button>
                    }
                />

                {/* Upload Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-5">
                        <div
                            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${dragActive
                                ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-500/10'
                                : 'border-slate-300 dark:border-white/10 hover:border-primary-400 dark:hover:border-primary-400/50 card'
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                id="csv-upload"
                                className="hidden"
                                accept=".csv"
                                onChange={handleChange}
                            />

                            <div className="w-14 h-14 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-primary">
                                <Upload size={26} />
                            </div>

                            {file ? (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                                        <FileText size={18} />
                                        <span className="truncate max-w-[200px]">{file.name}</span>
                                    </div>
                                    <button
                                        onClick={() => setFile(null)}
                                        className="btn-link text-xs text-danger-500 hover:text-danger-600"
                                    >
                                        Remove file
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <h3 className="text-base font-bold text-slate-800 dark:text-white">Drag & Drop Student CSV</h3>
                                    <p className="text-xs text-slate-400">or click to browse from device</p>
                                    <label
                                        htmlFor="csv-upload"
                                        className="btn-secondary mt-2 inline-flex"
                                    >
                                        Browse Files
                                    </label>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="btn-primary w-full py-3 text-base justify-center shadow-primary"
                        >
                            {uploading ? (
                                <>
                                    <RefreshCw className="animate-spin" size={18} />
                                    <span>Processing Telemetry...</span>
                                </>
                            ) : (
                                <>
                                    <Upload size={18} />
                                    <span>Run Batch Predictions</span>
                                </>
                            )}
                        </button>

                        {error && (
                            <div className="p-4 bg-danger-50 dark:bg-danger-500/10 text-danger-600 dark:text-danger-400 border border-danger-200 dark:border-danger-500/20 rounded-xl flex items-start gap-3 text-sm">
                                <AlertCircle className="shrink-0 mt-0.5" size={18} />
                                <p>{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Results Section */}
                    <div className="lg:col-span-2">
                        {results ? (
                            <motion.div
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="table-container"
                            >
                                <div className="p-5 border-b border-slate-200 dark:border-white/[0.07] flex justify-between items-center bg-slate-50 dark:bg-white/[0.02]">
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <CheckCircle className="text-emerald-500" size={18} />
                                        Prediction Results
                                    </h2>
                                    <span className="badge badge-primary">
                                        {results.length} Students Processed
                                    </span>
                                </div>

                                {/* Mobile Cards View (< md) */}
                                <div className="md:hidden p-4 space-y-3">
                                    {results.map((result, idx) => (
                                        <div key={idx} className="bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] rounded-xl p-4 shadow-xs space-y-2.5">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug">
                                                        {result.name}
                                                    </h4>
                                                    <p className="text-xs text-slate-400 font-mono">{result.student_id}</p>
                                                </div>
                                                <span className={`badge ${result.prediction === 'Placed' ? 'badge-success' : 'badge-danger'}`}>
                                                    {result.prediction}
                                                </span>
                                            </div>
                                            <div className="pt-2 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Confidence</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${result.prediction === 'Placed' ? 'bg-emerald-500' : 'bg-danger-500'}`}
                                                            style={{ width: `${(result.confidence * 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{(result.confidence * 100).toFixed(0)}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Table (>= md) */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="table-base">
                                        <thead>
                                            <tr>
                                                <th className="table-th">Student ID</th>
                                                <th className="table-th">Name</th>
                                                <th className="table-th">Prediction</th>
                                                <th className="table-th">Confidence</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                            {results.map((result, idx) => (
                                                <tr key={idx} className="table-tr">
                                                    <td className="table-td font-mono text-xs text-slate-500 dark:text-slate-400">{result.student_id}</td>
                                                    <td className="table-td font-medium text-slate-900 dark:text-white">{result.name}</td>
                                                    <td className="table-td">
                                                        <span className={`badge ${result.prediction === 'Placed' ? 'badge-success' : 'badge-danger'}`}>
                                                            {result.prediction}
                                                        </span>
                                                    </td>
                                                    <td className="table-td">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-20 h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full ${result.prediction === 'Placed' ? 'bg-emerald-500' : 'bg-danger-500'}`}
                                                                    style={{ width: `${(result.confidence * 100)}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{(result.confidence * 100).toFixed(0)}%</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl card min-h-[300px]">
                                <FileText size={44} className="mb-3 opacity-40 text-slate-400" />
                                <h3 className="text-base font-semibold mb-1 text-slate-700 dark:text-slate-300">No Telemetry Output Yet</h3>
                                <p className="text-xs text-slate-500">Upload a CSV file and run batch prediction to evaluate cohort placement readiness.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkPlacementPrediction;
