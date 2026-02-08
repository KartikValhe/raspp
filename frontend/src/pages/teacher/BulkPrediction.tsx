import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Upload, Download, X, CheckCircle, AlertCircle, FileText,
    TrendingUp, Minus, Award, Search
} from 'lucide-react';
import api from '../../services/api';

interface Prediction {
    student_id: string;
    name: string;
    branch: string;
    predicted_class: number;
    predicted_label: string;
    confidence: number;
    features: {
        avg_score: number;
        attendance_rate: number;
        marks_std_dev: number;
        total_absences: number;
        consistency_score: number;
        improvement_rate: number;
    };
}

interface BulkPredictionResult {
    total_students: number;
    predictions: Prediction[];
    summary: {
        at_risk: number;
        average: number;
        good: number;
        excellent: number;
    };
}

const BulkPrediction: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [results, setResults] = useState<BulkPredictionResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<'name' | 'confidence' | 'score'>('name');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post<BulkPredictionResult>('/api/v1/ml/bulk-predict', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResults(response.data);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to process CSV file');
        } finally {
            setUploading(false);
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;

    const exportResults = () => {
        if (!results) return;
        const csvContent = [
            ['Student ID', 'Name', 'Branch', 'Prediction', 'Confidence', 'Avg Score', 'Attendance'].join(','),
            ...results.predictions.map(p =>
                [p.student_id, p.name, p.branch, p.predicted_label, p.confidence, p.features.avg_score, p.features.attendance_rate].join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'predictions_results.csv';
        a.click();
    };

    const allFilteredPredictions = results?.predictions.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.student_id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterClass === null || p.predicted_class === filterClass;
        return matchesSearch && matchesFilter;
    }).sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'confidence') return b.confidence - a.confidence;
        if (sortBy === 'score') return b.features.avg_score - a.features.avg_score;
        return 0;
    }) || [];

    const totalPages = Math.ceil(allFilteredPredictions.length / itemsPerPage);
    const paginatedPredictions = allFilteredPredictions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const getClassColor = (predictedClass: number) => {
        const colors = [
            'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400',
            'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400',
            'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400',
            'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',
        ];
        return colors[predictedClass] || colors[0];
    };

    const getClassIcon = (predictedClass: number) => {
        const icons = [AlertCircle, Minus, TrendingUp, Award];
        const Icon = icons[predictedClass] || icons[0];
        return <Icon size={18} />;
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Bulk Performance Prediction</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                    Upload CSV file with student data to get batch predictions
                </p>
            </div>

            {!results && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${file
                            ? 'border-green-400 bg-green-50 dark:bg-green-900/10'
                            : 'border-slate-300 dark:border-slate-600 hover:border-violet-400 dark:hover:border-violet-500'
                            }`}
                    >
                        {file ? (
                            <div className="space-y-4">
                                <CheckCircle className="mx-auto text-green-500" size={48} />
                                <div>
                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{file.name}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {(file.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                                <button
                                    onClick={() => setFile(null)}
                                    className="text-red-500 hover:text-red-600 font-medium flex items-center gap-2 mx-auto"
                                >
                                    <X size={20} /> Remove file
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Upload className="mx-auto text-slate-400 dark:text-slate-500" size={48} />
                                <div>
                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Drop CSV file here or click to upload
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                        File must contain: student_id, name, branch, avg_score, attendance_rate, etc.
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="csv-upload"
                                />
                                <label
                                    htmlFor="csv-upload"
                                    className="inline-block px-6 py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 cursor-pointer transition-colors"
                                >
                                    Choose File
                                </label>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    <div className="mt-6 flex justify-between items-center">
                        <a
                            href="/docs/student_data.csv"
                            download
                            className="text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-2"
                        >
                            <Download size={18} />
                            Download sample CSV
                        </a>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="px-8 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all"
                        >
                            {uploading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Upload size={20} />
                                    Upload & Predict
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>
            )}

            {results && (
                <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Students</p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{results.total_students}</p>
                                </div>
                                <FileText className="text-violet-500" size={32} />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/10 p-6 rounded-xl shadow border border-red-200 dark:border-red-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-red-700 dark:text-red-400">At Risk</p>
                                    <p className="text-3xl font-bold text-red-900 dark:text-red-300 mt-1">{results.summary.at_risk}</p>
                                </div>
                                <AlertCircle className="text-red-500" size={32} />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 p-6 rounded-xl shadow border border-green-200 dark:border-green-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-700 dark:text-green-400">Good</p>
                                    <p className="text-3xl font-bold text-green-900 dark:text-green-300 mt-1">{results.summary.good}</p>
                                </div>
                                <TrendingUp className="text-green-500" size={32} />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-808/10 p-6 rounded-xl shadow border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-700 dark:text-blue-400">Excellent</p>
                                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-300 mt-1">{results.summary.excellent}</p>
                                </div>
                                <Award className="text-blue-500" size={32} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search by name or ID..."
                                        value={searchTerm}
                                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>

                                <select
                                    value={filterClass === null ? '' : filterClass}
                                    onChange={(e) => { setFilterClass(e.target.value === '' ? null : parseInt(e.target.value)); setCurrentPage(1); }}
                                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500"
                                >
                                    <option value="">All Predictions</option>
                                    <option value="0">At Risk</option>
                                    <option value="1">Average</option>
                                    <option value="2">Good</option>
                                    <option value="3">Excellent</option>
                                </select>

                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500"
                                >
                                    <option value="name">Sort by Name</option>
                                    <option value="confidence">Sort by Confidence</option>
                                    <option value="score">Sort by Score</option>
                                </select>
                            </div>

                            <div className="flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={exportResults}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-green-700 transition-colors"
                                >
                                    <Download size={18} />
                                    Export CSV
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => { setResults(null); setFile(null); }}
                                    className="px-4 py-2 bg-slate-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-slate-700 transition-colors"
                                >
                                    <X size={18} />
                                    New Upload
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Student ID</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Branch</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Prediction</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Confidence</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Avg Score</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Attendance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {paginatedPredictions.map((prediction) => (
                                        <tr
                                            key={prediction.student_id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">{prediction.student_id}</td>
                                            <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">{prediction.name}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{prediction.branch}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getClassColor(prediction.predicted_class)}`}>
                                                    {getClassIcon(prediction.predicted_class)}
                                                    {prediction.predicted_label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-semibold">{(prediction.confidence * 100).toFixed(1)}%</td>
                                            <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">{prediction.features.avg_score.toFixed(1)}</td>
                                            <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">{prediction.features.attendance_rate.toFixed(1)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {allFilteredPredictions.length === 0 ? (
                            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                                No students match your search criteria
                            </div>
                        ) : (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, allFilteredPredictions.length)}</span> of <span className="font-medium">{allFilteredPredictions.length}</span> results
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 text-sm font-medium rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 text-sm font-medium rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BulkPrediction;
