"use client";

import { useState } from "react";
import StudentSelector from "@/components/StudentSelector";
import Dashboard from "@/components/Dashboard";
import { Student } from "@/data/students";

export default function Home() {
    const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
    const [studentData, setStudentData] = useState<any>(null);

    const handleLogin = (student: Student, data: any) => {
        setCurrentStudent(student);
        setStudentData(data);
    };

    const handleLogout = () => {
        setCurrentStudent(null);
        setStudentData(null);
    };

    return (
        <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="relative z-10">
                {!currentStudent ? (
                    <StudentSelector onLogin={handleLogin} />
                ) : (
                    <Dashboard
                        student={currentStudent}
                        initialData={studentData}
                        onLogout={handleLogout}
                    />
                )}
            </div>
        </main>
    );
}
