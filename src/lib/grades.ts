import { Subject } from "@/data/subjects";

export const calculateGradePoint = (percentage: number): number => {
    if (percentage >= 90) return 10;
    if (percentage >= 80) return 9;
    if (percentage >= 70) return 8;
    if (percentage >= 60) return 7;
    if (percentage >= 45) return 6;
    if (percentage >= 40) return 4; // Pass
    return 0; // Fail
};

export const calculateSGPA = (subjects: Subject[], scores: Record<string, Record<string, number>>): number => {
    let totalCredits = 0;
    let totalPoints = 0;

    subjects.forEach((sub) => {
        const subScores = scores[sub.id] || {};
        let eventSum = 0;

        // Calculate Internal Marks (Sum of 3 events / 2)
        sub.events.forEach((event) => {
            eventSum += subScores[event.name] || 0;
        });
        const internalMarks = eventSum / 2;

        // Add SEE (Semester End Exam)
        const seeMarks = subScores['SEE'] || 0;

        const totalMarks = internalMarks + seeMarks;

        // Calculate Percentage based on Total (Internal Max + SEE Max)
        // Internal Max = (Sum of Event Max / 2)
        // SEE Max = 60
        let maxEventSum = 0;
        sub.events.forEach(e => maxEventSum += e.maxScore);
        const maxInternal = maxEventSum / 2;
        const maxTotal = maxInternal + 60;

        if (maxTotal === 0) return;

        const percentage = (totalMarks / maxTotal) * 100;
        const gp = calculateGradePoint(percentage);

        totalCredits += sub.credits;
        totalPoints += gp * sub.credits;
    });

    if (totalCredits === 0) return 0;
    return parseFloat((totalPoints / totalCredits).toFixed(2));
};

export const calculateForecast = (
    subjects: Subject[],
    scores: Record<string, Record<string, number>>,
    targetSgpa: number
): Record<string, string> => {
    const results: Record<string, string> = {};

    // Mapping GP to Min Percentage
    const getMinPercentageForGP = (gp: number) => {
        if (gp >= 10) return 90;
        if (gp >= 9) return 80;
        if (gp >= 8) return 70;
        if (gp >= 7) return 60;
        if (gp >= 6) return 45;
        if (gp >= 4) return 40;
        return 0;
    };

    const targetGP = Math.ceil(targetSgpa);
    const targetPercentage = getMinPercentageForGP(targetGP);

    subjects.forEach((sub) => {
        const subScores = scores[sub.id] || {};

        let currentEventSum = 0;

        // Internal Events
        sub.events.forEach(e => {
            if (subScores[e.name] !== undefined) {
                currentEventSum += subScores[e.name];
            }
        });

        // SEE
        let seeScore = 0;
        if (subScores['SEE'] !== undefined) {
            seeScore = subScores['SEE'];
        }

        // Determine missing items
        const missingInternalEvents = sub.events.filter(e => subScores[e.name] === undefined);
        const isSeeMissing = subScores['SEE'] === undefined;

        // Calculate Max Total Marks for this subject
        let maxEventSum = 0;
        sub.events.forEach(e => maxEventSum += e.maxScore);
        const maxInternal = maxEventSum / 2;
        const maxTotal = maxInternal + 60; // 60 is SEE max

        const requiredTotalMarks = (targetPercentage / 100) * maxTotal;

        // Current contribution
        const currentInternalContribution = currentEventSum / 2;
        const currentTotal = currentInternalContribution + seeScore;

        let deficit = requiredTotalMarks - currentTotal;

        if (deficit <= 0) {
            results[sub.id] = "Target Achieved";
            return;
        }

        // We need to cover 'deficit' using MissingInternal/2 + MissingSEE
        let potentialInternal = 0;
        missingInternalEvents.forEach(e => potentialInternal += e.maxScore);
        const potentialInternalContribution = potentialInternal / 2;

        let potentialSee = isSeeMissing ? 60 : 0;

        const maxPossibleGain = potentialInternalContribution + potentialSee;

        if (maxPossibleGain < deficit) {
            results[sub.id] = "Impossible";
            return;
        }

        // p = deficit / (potentialInternal/2 + potentialSee)
        const p = deficit / (potentialInternalContribution + potentialSee);

        const neededScores: string[] = [];

        missingInternalEvents.forEach(e => {
            const needed = Math.ceil(e.maxScore * p);
            neededScores.push(`${e.name}: ${needed}/${e.maxScore}`);
        });

        if (isSeeMissing) {
            const needed = Math.ceil(60 * p);
            neededScores.push(`SEE: ${needed}/60`);
        }

        results[sub.id] = neededScores.join(", ");
    });

    return results;
};
