import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, RefreshCw, Download } from 'lucide-react';
import api from '../../services/api';

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
        <div className="p-8 min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Bulk Placement Prediction</h1>
                    <p className="text-slate-500 dark:text-slate-400">Upload student data to predict placement probabilities.</p>
                </div>

                {/* Upload Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <div
                            className={`border-3 border-dashed rounded-3xl p-8 text-center transition-all ${dragActive
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                                : 'border-slate-300 dark:border-white/10 hover:border-blue-400 dark:hover:border-blue-400/50'
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

                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Upload size={32} />
                            </div>

                            {file ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                                        <FileText size={20} />
                                        <span className="truncate max-w-[200px]">{file.name}</span>
                                    </div>
                                    <button
                                        onClick={() => setFile(null)}
                                        className="text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 underline"
                                    >
                                        Remove file
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">Drag & Drop CSV</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">or</p>
                                    <label
                                        htmlFor="csv-upload"
                                        className="inline-block px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-medium cursor-pointer hover:opacity-90 transition-opacity"
                                    >
                                        Browse Files
                                    </label>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center text-sm">
                            <button
                                onClick={downloadSample}
                                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                <Download size={16} />
                                Download Sample CSV
                            </button>
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg shadow-lg transition-all ${!file || uploading
                                ? 'bg-slate-200 dark:bg-white/10 text-slate-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/30 transform hover:-translate-y-1'
                                }`}
                        >
                            {uploading ? (
                                <>
                                    <RefreshCw className="animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Run Predictions
                                </>
                            )}
                        </button>

                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-start gap-3 text-sm">
                                <AlertCircle className="shrink-0 mt-0.5" size={18} />
                                <p>{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Results Section */}
                    <div className="lg:col-span-2">
                        {results ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl"
                            >
                                <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-white/5">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <CheckCircle className="text-emerald-500" />
                                        Prediction Results
                                    </h2>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 rounded-full text-sm font-medium">
                                        {results.length} Students Processed
                                    </span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 dark:bg-black/20 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                                            <tr>
                                                <th className="px-6 py-4">Student ID</th>
                                                <th className="px-6 py-4">Name</th>
                                                <th className="px-6 py-4">Prediction</th>
                                                <th className="px-6 py-4">Confidence</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                            {results.map((result, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400">{result.student_id}</td>
                                                    <td className="px-6 py-4 font-medium">{result.name}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${result.prediction === 'Placed'
                                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                                                            : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                                                            }`}>
                                                            {result.prediction}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-16 h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full ${result.prediction === 'Placed' ? 'bg-emerald-500' : 'bg-red-500'
                                                                        }`}
                                                                    style={{ width: `${(result.confidence * 100)}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs text-slate-500">{(result.confidence * 100).toFixed(0)}%</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl bg-slate-50/50 dark:bg-white/5">
                                <FileText size={48} className="mb-4 opacity-50" />
                                <h3 className="text-xl font-semibold mb-2">No Results Yet</h3>
                                <p>Upload a CSV file and run predictions to see the analysis here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkPlacementPrediction;
