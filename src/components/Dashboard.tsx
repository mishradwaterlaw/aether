"use client";

import { useState, useEffect } from "react";
import { Student } from "@/data/students";
import { subjects, Subject } from "@/data/subjects";
import { calculateSGPA, calculateForecast } from "@/lib/grades";
import { encryptData } from "@/lib/security";
import { motion } from "framer-motion";
import { Save, LogOut, TrendingUp, Calculator } from "lucide-react";

interface DashboardProps {
    student: Student;
    initialData: any;
    onLogout: () => void;
}

export default function Dashboard({ student, initialData, onLogout }: DashboardProps) {
    const [scores, setScores] = useState<Record<string, Record<string, number>>>(initialData.scores || {});
    const [sgpa, setSgpa] = useState(0);
    const [targetSgpa, setTargetSgpa] = useState<number | null>(null);
    const [forecast, setForecast] = useState<string[]>([]);

    useEffect(() => {
        setSgpa(calculateSGPA(subjects, scores));
    }, [scores]);

    const handleScoreChange = (subjectId: string, eventName: string, value: string) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return;

        // Validate max score
        const subject = subjects.find(s => s.id === subjectId);
        let maxScore = 0;

        if (eventName === 'SEE') {
            maxScore = 60;
        } else {
            const event = subject?.events.find(e => e.name === eventName);
            maxScore = event?.maxScore || 0;
        }

        if (numValue > maxScore) return;

        setScores(prev => ({
            ...prev,
            [subjectId]: {
                ...prev[subjectId],
                [eventName]: numValue
            }
        }));
    };

    const saveToVault = () => {
        alert("In a full implementation, this would re-encrypt with your PIN and save.");
    };

    const [forecastError, setForecastError] = useState("");

    const handleForecast = () => {
        setForecastError("");
        setForecastResults({});

        if (!targetSgpa) {
            setForecastError("Please enter a target SGPA (e.g., 9.0)");
            return;
        }

        // Check if at least one score is entered
        let hasScore = false;
        Object.values(scores).forEach(subScores => {
            if (Object.keys(subScores).length > 0) hasScore = true;
        });

        if (!hasScore) {
            setForecastError("Please enter at least one score to predict.");
            return;
        }

        const results = calculateForecast(subjects, scores, targetSgpa);
        setForecastResults(results);
    };

    const [forecastResults, setForecastResults] = useState<Record<string, string>>({});

    return (
        <div className="max-w-6xl mx-auto p-6">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Welcome, {student.name}</h1>

                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-sm text-gray-400">Current SGPA</div>
                        <div className="text-3xl font-bold text-blue-400">{sgpa}</div>
                    </div>
                    <button onClick={onLogout} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {subjects.map((subject) => (
                        <motion.div key={subject.id} className="glass-panel p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">{subject.name}</h3>
                                <div className="flex items-center gap-2">
                                    {forecastResults[subject.id] && (
                                        <span className={`text-xs px-2 py-1 rounded animate-pulse border ${forecastResults[subject.id] === "Impossible"
                                            ? "bg-red-900/50 text-red-200 border-red-500/30"
                                            : forecastResults[subject.id] === "Target Achieved"
                                                ? "bg-green-900/50 text-green-200 border-green-500/30"
                                                : "bg-purple-900/50 text-purple-200 border-purple-500/30"
                                            }`}>
                                            {forecastResults[subject.id] === "Impossible" ? "Impossible" :
                                                forecastResults[subject.id] === "Target Achieved" ? "Achieved" :
                                                    `Aim: ${forecastResults[subject.id]}`}
                                        </span>
                                    )}
                                    <span className="text-xs bg-blue-900/50 text-blue-200 px-2 py-1 rounded">{subject.credits} Credits</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                {subject.events.map((event) => (
                                    <div key={event.name}>
                                        <label className="text-xs text-gray-500 block mb-1">{event.name} (Max {event.maxScore})</label>
                                        <input
                                            type="number"
                                            className="w-full bg-black/50 border border-gray-700 rounded p-2 text-center focus:border-blue-500 outline-none"
                                            value={scores[subject.id]?.[event.name] || ""}
                                            onChange={(e) => handleScoreChange(subject.id, event.name, e.target.value)}
                                            placeholder="-"
                                        />
                                    </div>
                                ))}
                                <div>
                                    <label className="text-xs text-purple-400 block mb-1">SEE (Max 60)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-purple-900/20 border border-purple-500/30 rounded p-2 text-center focus:border-purple-500 outline-none"
                                        value={scores[subject.id]?.['SEE'] || ""}
                                        onChange={(e) => handleScoreChange(subject.id, 'SEE', e.target.value)}
                                        placeholder="-"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <TrendingUp size={20} className="text-green-400" /> Forecaster
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Enter your target SGPA to see what you need to score in the remaining events.
                        </p>

                        <div className="flex flex-col gap-2 mb-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    className="bg-black border border-gray-700 rounded p-2 w-24 text-center"
                                    placeholder="9.0"
                                    onChange={(e) => setTargetSgpa(parseFloat(e.target.value))}
                                />
                                <button
                                    onClick={handleForecast}
                                    className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded flex-1 transition-colors"
                                >
                                    Calculate
                                </button>
                            </div>
                            {forecastError && (
                                <p className="text-red-400 text-xs text-center animate-pulse">{forecastError}</p>
                            )}
                        </div>

                        <div className="text-xs text-gray-500 italic">
                            *Predictions assume equal performance across remaining events.
                        </div>
                    </div>

                    <div className="glass-panel p-6 bg-blue-900/10 border-blue-500/30">
                        <h3 className="text-lg font-bold mb-2 text-blue-300">Security Status</h3>
                        <div className="flex items-center gap-2 text-sm text-green-400">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            Vault Encrypted (AES-256)
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Your grades are stored locally on this device. No data is sent to any server.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
