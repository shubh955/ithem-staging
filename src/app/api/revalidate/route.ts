import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidation-secret')
  if (secret !== process.env.WORDPRESS_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const tag = (body.type as string) ?? 'wordpress'
    revalidateTag(tag)
    return NextResponse.json({ revalidated: true, tag })
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
