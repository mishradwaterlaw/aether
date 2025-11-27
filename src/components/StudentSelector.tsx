"use client";

import { useState } from "react";
import { students, Student } from "@/data/students";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Lock, User } from "lucide-react";
import { encryptData, decryptData, hashPin } from "@/lib/security";

interface StudentSelectorProps {
    onLogin: (student: Student, data: any) => void;
}

export default function StudentSelector({ onLogin }: StudentSelectorProps) {
    const [search, setSearch] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [pin, setPin] = useState("");
    const [newPin, setNewPin] = useState("");
    const [mode, setMode] = useState<"LOGIN" | "SETUP">("LOGIN");
    const [error, setError] = useState("");
    const [usnVerify, setUsnVerify] = useState("");
    const [showReset, setShowReset] = useState(false);

    const filtered = students.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleStudentClick = (student: Student) => {
        setSelectedStudent(student);
        setPin("");
        setError("");
        setNewPin("");
        setNewPin("");
        setUsnVerify("");
        setShowReset(false);

        // Check if vault exists
        const vault = localStorage.getItem(`vault_${student.id}`);
        if (!vault) {
            setMode("SETUP");
        } else {
            setMode("LOGIN");
        }
    };

    const handleLogin = () => {
        if (!selectedStudent) return;
        const vault = localStorage.getItem(`vault_${selectedStudent.id}`);

        if (!vault) return; // Should not happen in LOGIN mode

        const data = decryptData(vault, pin);
        if (data) {
            onLogin(selectedStudent, data);
        } else {
            setError("Invalid PIN");
        }
    };

    const handleMasterReset = () => {
        if (!selectedStudent) return;
        // Hash: 2305 + Salt
        const masterHash = "794500a8a121aa3b5a09a08ab6cb0bee0a1ec2f57e682e595b36a3ae8fb4b66dd";
        if (hashPin(pin) === masterHash) {
            localStorage.removeItem(`vault_${selectedStudent.id}`);
            setMode("SETUP");
            setPin("");
            setError("Vault Reset. Please setup again.");
            setShowReset(false);
        } else {
            setError("Invalid Master PIN");
        }
    };

    const handleSetup = () => {
        if (!selectedStudent) return;

        // Verify USN (Last 4 digits)
        const inputHash = hashPin(usnVerify);
        if (inputHash !== selectedStudent.usnHash) {
            setError("Incorrect USN (Last 4 digits)");
            return;
        }
        if (newPin.length < 4) {
            setError("New PIN must be at least 4 digits");
            return;
        }

        // Initialize Vault
        const initialData = { scores: {} };
        const encrypted = encryptData(initialData, newPin);
        localStorage.setItem(`vault_${selectedStudent.id}`, encrypted);

        // Auto login
        onLogin(selectedStudent, initialData);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    GradeVault
                </h1>
                <p className="text-gray-400">Secure Grade Forecasting System</p>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-3 top-3 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search your name..."
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((student, index) => (
                    <motion.div
                        key={student.id}
                        layoutId={student.id}
                        onClick={() => handleStudentClick(student)}
                        className="glass-panel p-4 cursor-pointer hover:bg-white/10 transition-colors flex items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {student.name[0]}
                        </div>
                        <div>
                            <div className="font-medium text-white">{student.name}</div>
                            <div className="text-xs text-gray-400">Roll No: {students.indexOf(student) + 1}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedStudent && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold">
                                    {selectedStudent.name[0]}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{selectedStudent.name}</h2>
                                    <p className="text-sm text-gray-400">{mode === "SETUP" ? "First Time Setup" : "Secure Login"}</p>
                                </div>
                            </div>

                            {mode === "SETUP" ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-purple-400 uppercase">Verify Identity</label>
                                        <input
                                            type="text"
                                            className="w-full bg-black border border-purple-900/50 rounded-lg p-3 text-center tracking-widest text-xl focus:border-purple-500 outline-none"
                                            placeholder="Last 4 digits of USN"
                                            maxLength={4}
                                            value={usnVerify}
                                            onChange={(e) => setUsnVerify(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-blue-400 uppercase">Set New PIN</label>
                                        <input
                                            type="password"
                                            className="w-full bg-black border border-blue-900/50 rounded-lg p-3 text-center tracking-widest text-xl focus:border-blue-500 outline-none"
                                            placeholder="New PIN"
                                            value={newPin}
                                            onChange={(e) => setNewPin(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        onClick={handleSetup}
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors"
                                    >
                                        Initialize Vault
                                    </button>
                                </div>
                            ) : showReset ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-red-500 uppercase">Master PIN</label>
                                        <input
                                            type="password"
                                            className="w-full bg-black border border-red-900/50 rounded-lg p-3 text-center tracking-widest text-xl focus:border-red-500 outline-none"
                                            autoFocus
                                            placeholder="Enter Master PIN"
                                            value={pin}
                                            onChange={(e) => setPin(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        onClick={handleMasterReset}
                                        className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg transition-colors"
                                    >
                                        Reset Vault
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowReset(false);
                                            setPin("");
                                            setError("");
                                        }}
                                        className="w-full text-gray-500 hover:text-white text-sm"
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase">Enter PIN</label>
                                        <input
                                            type="password"
                                            className="w-full bg-black border border-gray-700 rounded-lg p-3 text-center tracking-widest text-xl"
                                            autoFocus
                                            value={pin}
                                            onChange={(e) => setPin(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        onClick={handleLogin}
                                        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Lock size={18} /> Unlock
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowReset(true);
                                            setPin("");
                                            setError("");
                                        }}
                                        className="w-full text-xs text-gray-500 hover:text-gray-300"
                                    >
                                        Forgot PIN?
                                    </button>
                                </div>
                            )}

                            {error && (
                                <div className="mt-4 text-red-500 text-center text-sm bg-red-900/20 p-2 rounded">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="mt-4 w-full text-gray-500 hover:text-white text-sm"
                            >
                                Cancel
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
