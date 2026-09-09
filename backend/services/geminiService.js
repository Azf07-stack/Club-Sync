const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateEventPlan = async (eventDetails) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert college event planner. Create a comprehensive event plan based on the following details.
    
    Club Name: ${eventDetails.clubName} (${eventDetails.clubType})
    Event Title/Theme: ${eventDetails.eventTitle}
    Event Type: ${eventDetails.eventType}
    Venue: ${eventDetails.venue}
    Date: ${eventDetails.date} (${eventDetails.startTime} to ${eventDetails.endTime})
    Budget: $${eventDetails.budget}
    Participants: ${eventDetails.participants} (${eventDetails.targetAudience}, Level: ${eventDetails.participantLevel})
    Objective: ${eventDetails.objective}
    Resources Available: ${eventDetails.resources}
    Additional Reqs: ${eventDetails.additionalRequirements}

    Constraints:
    - Keep budget realistic and do not exceed $${eventDetails.budget}.
    - Accommodate ${eventDetails.participants} people.
    - Generate practical college-level activities.
    - Create highly engaging announcements and poster content.

    INSTRUCTIONS:
    1. Structure the schedule logically with clear timeframes.
    2. Keep budget realistic and strict.
    3. The poster content must be ULTRA MINIMAL. No paragraphs, no long descriptions. Only generate the Event Title (headline), Club Name (subheadline), Date, Time, Venue, and a short Call to Action.
    4. Generate a 'design' object with a specific color palette (hex codes) and Google Font suggestions that perfectly match the vibe of a ${eventDetails.clubType} club event. Use high-contrast, modern minimal aesthetics.

    Return the response STRICTLY as a JSON object matching this exact structure, with no markdown formatting or backticks outside the JSON:
    {
      "event": { "title": "", "description": "", "purpose": "", "activities": [""], "expectedOutcomes": [""], "resources": [""] },
      "schedule": [ { "time": "", "activity": "", "duration": "", "description": "" } ],
      "budget": [ { "item": "", "estimatedCost": 0, "reason": "" } ],
      "tasks": [ { "task": "", "priority": "High/Medium/Low", "responsible": "", "completed": false } ],
      "volunteers": [ { "role": "", "numberOfVolunteers": 0, "responsibilities": "" } ],
      "announcements": { "whatsapp": "", "instagram": "", "formal": "", "email": "", "short": "" },
      "poster": { "headline": "", "subheadline": "", "date": "", "time": "", "venue": "", "description": "", "callToAction": "" }
    }
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });
    
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate event plan from AI");
  }
};

module.exports = { generateEventPlan };
