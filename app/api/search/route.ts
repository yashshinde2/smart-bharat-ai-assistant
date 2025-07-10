import { NextResponse } from 'next/server'

const url = "https://api.deepseek.com/v1/chat/completions"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Please enter a message to search' },
        { status: 400 }
      )
    }

    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      )
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: query
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: data.error?.message || 'Failed to get response from AI',
          details: data
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
} 