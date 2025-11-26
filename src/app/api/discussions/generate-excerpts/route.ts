import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface GenerateExcerptsRequest {
    title: string;
    content: string;
}

export async function POST(request: NextRequest) {
    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your-openai-api-key-here') {
        return NextResponse.json(
            { error: 'OpenAI API key not configured' },
            { status: 500 }
        );
    }

    // Parse request body
    let body: GenerateExcerptsRequest;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: 'Invalid request body' },
            { status: 400 }
        );
    }

    // Validate required fields
    if (!body.title || !body.content) {
        return NextResponse.json(
            { error: 'Title and content are required' },
            { status: 400 }
        );
    }

    // Validate content length (minimum to generate meaningful excerpts)
    if (body.content.trim().length < 50) {
        return NextResponse.json(
            { error: 'Content is too short to generate excerpts' },
            { status: 400 }
        );
    }

    try {
        const openai = new OpenAI({
            apiKey: apiKey,
        });

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `You are a helpful assistant that creates brief, engaging summaries for discussion posts.
Generate 3 different excerpt options (50-150 characters each) that summarize the discussion.
Each excerpt should be:
- Concise and clear
- Engaging and enticing to read
- Different in style or focus from the others
- Suitable as a preview/summary of the discussion

Return ONLY a JSON array of 3 strings, nothing else. Example format:
["First excerpt option here", "Second excerpt option here", "Third excerpt option here"]`
                },
                {
                    role: 'user',
                    content: `Title: ${body.title}\n\nContent: ${body.content}`
                }
            ],
            temperature: 0.7,
            max_tokens: 300,
        });

        const responseContent = completion.choices[0]?.message?.content;
        if (!responseContent) {
            throw new Error('No response from OpenAI');
        }

        // Parse the JSON array from the response
        let excerpts: string[];
        try {
            // Strip markdown code fences if present
            let cleanedContent = responseContent.trim();
            if (cleanedContent.startsWith('```json')) {
                cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
            } else if (cleanedContent.startsWith('```')) {
                cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
            }

            excerpts = JSON.parse(cleanedContent);
        } catch {
            // If parsing fails, try to extract excerpts from the text
            console.error('Failed to parse OpenAI response as JSON:', responseContent);
            return NextResponse.json(
                { error: 'Failed to generate valid excerpts' },
                { status: 500 }
            );
        }

        // Validate we got 3 excerpts
        if (!Array.isArray(excerpts) || excerpts.length !== 3) {
            console.error('Invalid excerpts format:', excerpts);
            return NextResponse.json(
                { error: 'Invalid excerpt format from AI' },
                { status: 500 }
            );
        }

        // Validate excerpt lengths (50-150 characters)
        const validExcerpts = excerpts.filter(
            excerpt => typeof excerpt === 'string' &&
            excerpt.length >= 30 &&
            excerpt.length <= 200
        );

        if (validExcerpts.length !== 3) {
            console.error('Some excerpts out of length range:', excerpts);
            // Use what we have if we got at least 2 valid ones
            if (validExcerpts.length >= 2) {
                return NextResponse.json({ excerpts: validExcerpts });
            }
            return NextResponse.json(
                { error: 'Generated excerpts did not meet length requirements' },
                { status: 500 }
            );
        }

        return NextResponse.json({ excerpts: validExcerpts });

    } catch (error) {
        console.error('[Excerpts] OpenAI API error:', error);

        if (error instanceof Error) {
            // Handle specific OpenAI errors
            if (error.message.includes('API key')) {
                return NextResponse.json(
                    { error: 'Invalid OpenAI API key' },
                    { status: 500 }
                );
            }
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to generate excerpts' },
            { status: 500 }
        );
    }
}
