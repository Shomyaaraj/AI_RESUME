const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

/**
 * @name generateInterviewReportService
 * @description Generates a structured interview report analyzing job description and candidate resume.
 */
async function generateInterviewReportService({ jobDescription, resume, selfDescription }) {
    const prompt = `
You are an expert technical interviewer, hiring manager, and career strategist.
Analyze the candidate's Resume and optional Self Description against the target Job Description provided below.

=== JOB DESCRIPTION ===
${jobDescription || "General Software Engineering Position"}

=== CANDIDATE RESUME ===
${resume || "No resume provided. Assume an entry to mid-level candidate looking for this role."}

=== CANDIDATE SELF DESCRIPTION ===
${selfDescription || "None provided"}

=== INSTRUCTIONS ===
Provide a comprehensive, high-quality interview preparation analysis in strict JSON format with the following keys:
1. "matchScore": An integer between 0 and 100 representing overall compatibility.
2. "technicalQuestions": An array of 4 to 6 technical interview questions tailored specifically to the tech stack & requirements in the job description and candidate background. Each element must be an object with:
   - "question": The exact question text.
   - "intention": What the interviewer is evaluating with this question.
   - "answer": A comprehensive, model answer using STAR or technical depth.
3. "behavioralQuestions": An array of 3 to 4 behavioral questions. Each element must be an object with:
   - "question": The question text.
   - "intention": Why the interviewer is asking this.
   - "answer": A top-tier response strategy.
4. "skillGaps": An array of 3 to 6 identified missing or weak skills. Each element must be an object with:
   - "skill": Name of the skill/technology/concept.
   - "severity": Exact string, one of ["low", "medium", "high"].
5. "preparationPlan": A step-by-step 7-day action plan. An array of 7 objects with:
   - "day": Number (1 to 7).
   - "focus": Short title of the day's objective.
   - "task": Practical action item and study topic.

Ensure your response is valid JSON matching this schema.
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        const rawText = response.text;
        const parsed = JSON.parse(rawText);
        return parsed;
    } catch (error) {
        console.error("Error generating AI content:", error);
        throw error;
    }
}

module.exports = {
    generateInterviewReportService
};