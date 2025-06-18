// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { NextResponse } from 'next/server';

// // Required for edge runtime (optional based on your usage)
// export const runtime = 'edge';

// export async function POST() {
//   try {
//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

//     const model = genAI.getGenerativeModel({
//       model: 'gemini-1.5-pro-latest',
//     });

//     const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;

//     const result = await model.generateContentStream({
//       contents: [{ role: 'user', parts: [{ text: prompt }] }],
//     });

//     const encoder = new TextEncoder();

//     const stream = new ReadableStream({
//       async start(controller) {
//         for await (const chunk of result.stream) {
//           if (chunk.text()) {
//             controller.enqueue(encoder.encode(chunk.text()));
//           }
//         }
//         controller.close();
//       },
//     });

//     return new NextResponse(stream, {
//       headers: {
//         'Content-Type': 'text/plain; charset=utf-8',
//         'Cache-Control': 'no-cache',
//       },
//     });
//   } catch (error: any) {
//     console.error('Gemini stream failed:', error);
//     return new NextResponse(
//       JSON.stringify({
//         success: false,
//         message: 'Failed to generate suggestions.',
//         error: error.message || 'Unknown error',
//       }),
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST() {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://yourdomain.com', // optional
        'X-Title': 'MystreyMessage', // optional
      },
      body: JSON.stringify({
        model: 'openai/gpt-4.1',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content:
              "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.",
          },
        ],
      }),
    });

    const data = await response.json();

    const reply = data.choices?.[0]?.message?.content ?? 'No response generated.';

    return new NextResponse(reply, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: 'Failed to generate suggestions.',
        error: error.message || 'Unknown error',
      }),
      { status: 500 }
    );
  }
}
