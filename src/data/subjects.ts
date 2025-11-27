export interface Subject {
    id: string;
    name: string;
    credits: number;
    maxMarks: number;
    events: {
        name: string;
        maxScore: number;
    }[];
}

export const subjects: Subject[] = [
    {
        id: "eng",
        name: "English",
        credits: 1,
        maxMarks: 15,
        events: [
            { name: "CIE 1", maxScore: 15 },
            { name: "Event 2", maxScore: 10 },
            { name: "CIE 2", maxScore: 15 },
        ],
    },
    {
        id: "chem",
        name: "Chemistry",
        credits: 4,
        maxMarks: 30,
        events: [
            { name: "CIE 1", maxScore: 30 },
            { name: "Event 2", maxScore: 20 },
            { name: "CIE 2", maxScore: 30 },
        ],
    },
    {
        id: "math",
        name: "Maths",
        credits: 4,
        maxMarks: 30,
        events: [
            { name: "CIE 1", maxScore: 30 },
            { name: "Event 2", maxScore: 20 },
            { name: "CIE 2", maxScore: 30 },
        ],
    },
    {
        id: "elec",
        name: "Electronics",
        credits: 3,
        maxMarks: 30,
        events: [
            { name: "CIE 1", maxScore: 30 },
            { name: "Event 2", maxScore: 20 },
            { name: "CIE 2", maxScore: 30 },
        ],
    },
    {
        id: "cyber",
        name: "Cyber Security",
        credits: 2,
        maxMarks: 15,
        events: [
            { name: "CIE 1", maxScore: 15 },
            { name: "Event 2", maxScore: 10 },
            { name: "CIE 2", maxScore: 15 },
        ],
    },
    {
        id: "egd",
        name: "Engineering Graphics & Design",
        credits: 2,
        maxMarks: 30,
        events: [
            { name: "CIE 1", maxScore: 30 },
            { name: "Event 2", maxScore: 20 },
            { name: "CIE 2", maxScore: 30 },
        ],
    },
];
