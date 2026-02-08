import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import api from '../services/api';

export const PredictiveAnalytics: React.FC = () => {
    const [studentId, setStudentId] = useState('');
    const [prediction, setPrediction] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handlePredict = async () => {
        setLoading(true);
        try {
            // In a real app, this would get actual student data first
            // For now we trigger the prediction on the ID directly
            const response = await api.post(`/api/v1/ml/predict/${studentId}`);
            setPrediction(response.data);
        } catch (error) {
            console.error("Prediction failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">AI Performance Prediction</h2>

            <div className="bg-white p-6 rounded-lg shadow max-w-xl">
                <div className="flex gap-4 items-end mb-6">
                    <div className="flex-1">
                        <Input
                            label="Enter Student ID"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            placeholder="e.g. STU001"
                        />
                    </div>
                    <Button onClick={handlePredict} disabled={loading || !studentId} className="mb-4">
                        {loading ? 'Analyzing...' : 'Predict Performance'}
                    </Button>
                </div>

                {prediction && (
                    <div className="border-t pt-6">
                        <h3 className="font-semibold text-lg mb-4">Analysis Result</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded">
                                <p className="text-sm text-gray-600">Predicted Outcome</p>
                                <p className={`text-2xl font-bold ${prediction.predicted_category === 'Excellent' ? 'text-green-600' :
                                    prediction.predicted_category === 'At Risk' ? 'text-red-600' : 'text-yellow-600'
                                    }`}>
                                    {prediction.predicted_category}
                                </p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded">
                                <p className="text-sm text-gray-600">Confidence Score</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {(prediction.confidence_score * 100).toFixed(1)}%
                                </p>
                            </div>
                        </div>

                        {/* Explainable AI Section */}
                        <div className="mt-6">
                            <h4 className="font-medium mb-2">Key Factors (Explainable AI)</h4>
                            <p className="text-sm text-gray-500 italic">
                                Use the 'Inspect' feature to see SHAP values detailed breakdown.
                                (Visualization placeholder)
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
