// ═══════════════════════════════════════════════════════════════
// SpineView — Auto-Detect API Route
//
// Server-side proxy to Anthropic Claude Vision API.
// Keeps the API key on the server. No patient data is logged.
//
// Route: POST /api/xray-detect
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { systemPrompt, imageBase64, mediaType, viewType, imageDimensions } = body;

    if (!imageBase64 || !systemPrompt || !mediaType) {
      return NextResponse.json(
        { error: 'Missing required fields: imageBase64, systemPrompt, mediaType' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Call Claude Vision API
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: imageBase64,
                },
              },
              {
                type: 'text',
                text: `Analyse this ${viewType.replace(/_/g, ' ')} X-ray image (${imageDimensions.w}×${imageDimensions.h}px). Identify all anatomical landmarks and return their pixel coordinates as JSON. Remember: respond with ONLY the JSON object, no markdown formatting or backticks.`,
              },
            ],
          },
        ],
      }),
    });

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      console.error('Anthropic API error:', anthropicResponse.status, errorText);
      return NextResponse.json(
        { error: `Claude API error: ${anthropicResponse.status}` },
        { status: 502 }
      );
    }

    const anthropicData = await anthropicResponse.json();

    // Extract the text response
    const textContent = anthropicData.content?.find(
      (block: any) => block.type === 'text'
    );

    if (!textContent?.text) {
      return NextResponse.json(
        { error: 'No text response from Claude' },
        { status: 502 }
      );
    }

    // Parse the JSON response — strip any markdown fences if present
    let cleanText = textContent.text.trim();
    cleanText = cleanText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', cleanText);
      return NextResponse.json(
        { error: 'Failed to parse landmark coordinates from AI response' },
        { status: 502 }
      );
    }

    // Validate structure
    if (!parsed.landmarks || typeof parsed.landmarks !== 'object') {
      return NextResponse.json(
        { error: 'AI response missing landmarks object' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      landmarks: parsed.landmarks,
      confidence: parsed.confidence ?? 0.5,
      warnings: parsed.warnings ?? [],
    });
  } catch (error) {
    console.error('Auto-detect error:', error);
    return NextResponse.json(
      { error: 'Internal server error during auto-detection' },
      { status: 500 }
    );
  }
}
