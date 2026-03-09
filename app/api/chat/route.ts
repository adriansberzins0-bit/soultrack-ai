import OpenAI from "openai"
 
export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY
 
    if (!apiKey) {
      return Response.json(
        {
          ok: false,
          message: {
            role: "assistant",
            content: "Missing GROQ_API_KEY in environment variables.",
          },
        },
        { status: 500 }
      )
    }
 
    const client = new OpenAI({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1",
    })
 
    const { messages } = await req.json()
 
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
    })
 
    return Response.json({
      ok: true,
      message: completion.choices[0].message,
    })
  } catch (error: any) {
    console.error("GROQ ERROR:", error)
 
    return Response.json(
      {
        ok: false,
        message: {
          role: "assistant",
          content: "AI error. Check API key or route setup.",
        },
      },
      { status: 500 }
    )
  }
}