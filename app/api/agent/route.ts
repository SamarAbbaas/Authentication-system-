import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openaiApiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY || '';
const openrouterApiKey = process.env.OPENROUTER_API_KEY || '';
const appName = process.env.NEXT_PUBLIC_APP_NAME || 'DevPortal';

const openai = openaiApiKey
  ? new OpenAI({
      apiKey: openaiApiKey,
      baseURL: openrouterApiKey ? 'https://openrouter.ai/api/v1' : undefined,
    })
  : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';

    if (!prompt) {
      return NextResponse.json(
        { error: 'Please enter a prompt for the assistant.' },
        { status: 400 }
      );
    }

    if (!openai) {
      return NextResponse.json({
        reply: `The assistant is not configured yet for ${appName}. Add OPENAI_API_KEY or OPENROUTER_API_KEY to your environment to enable live responses.`,
      });
    }

    const model = openrouterApiKey ? 'openai/gpt-4o-mini' : 'gpt-4o-mini';

    const profileContext = `
You are an AI assistant helping evaluate and describe SAMAR ABBAS.
Use this profile information when answering questions about him.

Name: SAMAR ABBAS
Role: Frontend / Software Engineer
Location: Gujrat, Pakistan
Phone: +92 347 4254046
Email: samarabbas4742@gmail.com
GitHub: https://github.com/samarabbaas
LinkedIn: https://linkedin.com/in/samarabbaas

Profile:
Motivated second-year Software Engineering student at the University of Gujrat with a strong frontend foundation  . Proficient in React, Next.js, TypeScript, Tailwind CSS, and Supabase, with hands-on experience through self-initiated projects. Eager to apply academic knowledge in a real-world setting and grow as a developer through an internship opportunity.

Technical Skills:
- Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3
- Frontend: React, Next.js, Tailwind CSS, Responsive Design
- Backend/DB: Supabase, REST APIs, PostgreSQL (Fundamentals)
- Tools: Git, GitHub, Figma, VS Code
- Soft Skills: Problem Solving, Communication, Team Collaboration

Experience:
Actively seeking internship opportunities in Frontend or Full-Stack roles. Comfortable taking ownership of UI components, integrating REST APIs, and working within agile team workflows. Available immediately for remote or on-site internships.

Projects:
1. Electric POS - Point-of-sale web application for managing products, sales, and billing, built with React and Next.js, focusing on clean and performant UI.
2. Image Search Engine - Browser-based image search app integrating a third-party image API, built with JavaScript, HTML5, and CSS3, featuring debounced search and responsive layout.

Education:
BS Software Engineering, University of Gujrat (2023-2027 expected)
 
Relevant coursework: Data Structures, Web Development, Database Systems, Software Engineering

Additional:
- Certifications: HTML, CSS & JavaScript (Coursera); Meta Frontend Developer (in progress)
- Languages: Urdu (Native), English (Professional) ,punjabi,Arabic ,french 
- Active GitHub contributor with public repositories

Instructions:
- Keep replies  more concise, shortly ,practical, and friendly and reply is niethor greater than 1 line .
- If asked about his background, skills, projects, education, or internship fit, answer using this information.
- If a question is unrelated, politely redirect to his profile and also not tell my cgpa  and apoligized in a profeesional way .
`;

    const response = await openai.chat.completions.create({
      model,
      temperature: 0.7,
      max_tokens: 500,
      messages: [
        {
          role: 'system',
          content: profileContext,
        },
        { role: 'user', content: prompt },
      ],
    });

    const reply = response.choices[0]?.message?.content?.trim() || 'No response was generated.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Agent route error:', error);
    return NextResponse.json(
      { error: 'The assistant could not generate a response right now.' },
      { status: 500 }
    );
  }
}
