import { NextRequest } from 'next/server'

export async function GET() {
  // Return a proper SSE stream that sends no events and closes immediately
  const stream = new ReadableStream({
    start(controller) {
      controller.close()
    }
  })

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}