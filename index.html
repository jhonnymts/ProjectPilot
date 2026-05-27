// NOTE: filename kept as gemini.js per project convention — this calls Groq API

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.1-8b-instant'

async function callGroq(systemPrompt, userPrompt) {
  const key = import.meta.env.VITE_GROQ_KEY
  if (!key) throw new Error('VITE_GROQ_KEY is not set')

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Groq API error: ${res.status}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

// --- AI Feature Functions ---

export async function suggestTaskBreakdown(projectName, projectDescription) {
  const system = `You are an expert project manager with 25 years of experience. 
Respond with a JSON array of task objects. Each task has: title (string), description (string), type (task|story|feature|milestone), priority (low|medium|high|critical), estimated_hours (number). 
Return ONLY valid JSON, no markdown, no explanation.`

  const user = `Break down this project into actionable tasks:
Project: ${projectName}
Description: ${projectDescription}
Generate 6-10 tasks covering the full project lifecycle.`

  const raw = await callGroq(system, user)
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export async function flagRisks(projectName, projectData) {
  const system = `You are an expert risk manager. 
Respond with a JSON array of risk objects. Each has: title (string), description (string), probability (low|medium|high), impact (low|medium|high), mitigation_plan (string).
Return ONLY valid JSON, no markdown, no explanation.`

  const user = `Identify key risks for this project:
Project: ${projectName}
Details: ${JSON.stringify(projectData)}
Generate 3-5 realistic risks.`

  const raw = await callGroq(system, user)
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export async function writeStatusSummary(projectName, projectData) {
  const system = `You are a senior project manager writing a concise status update for stakeholders. 
Write in professional but clear language. 3-4 short paragraphs max. No bullet points.`

  const user = `Write a status update for:
Project: ${projectName}
Data: ${JSON.stringify(projectData)}`

  return await callGroq(system, user)
}

export async function recommendSprintScope(projectName, backlogTasks, velocity) {
  const system = `You are an agile coach. 
Respond with a JSON object with: recommended_tasks (array of task titles to include), rationale (string), suggested_goal (string).
Return ONLY valid JSON, no markdown.`

  const user = `Recommend sprint scope for:
Project: ${projectName}
Team velocity: ${velocity} story points
Backlog: ${JSON.stringify(backlogTasks)}`

  const raw = await callGroq(system, user)
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}
