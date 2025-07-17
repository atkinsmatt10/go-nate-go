import { NextResponse } from 'next/server'

// Manual override - update this number when you want to manually set the count
const MANUAL_COUNT_OVERRIDE = null // Set to a number to override, or null to use scraping

// Cache configuration
const CACHE_DURATION_MS = 5 * 60 * 1000 // 5 minutes
let cachedData: {
  count: number
  lastUpdated: string
  matchedPattern: string
  source: string
  timestamp: number
} | null = null

export async function GET() {
  // Return manual override if set
  if (MANUAL_COUNT_OVERRIDE !== null) {
    return NextResponse.json({
      count: MANUAL_COUNT_OVERRIDE,
      lastUpdated: new Date().toISOString(),
      source: 'manual_override'
    })
  }

  // Check cache first
  const now = Date.now()
  if (cachedData && (now - cachedData.timestamp) < CACHE_DURATION_MS) {
    return NextResponse.json({
      count: cachedData.count,
      lastUpdated: cachedData.lastUpdated,
      matchedPattern: cachedData.matchedPattern,
      source: `${cachedData.source}_cached`
    })
  }

  try {
    // Fetch the CustomInk fundraising page
    const response = await fetch('https://www.customink.com/fundraising/nate-the-great1', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch CustomInk page')
    }

    const html = await response.text()
    
    // Optimized patterns - most likely ones first
    const patterns = [
      // Most common patterns first for early termination
      /(\d+)\s*items?\s*sold/i,
      /sold:\s*(\d+)/i,
      /(\d+)\s*sold/i,
      
      // JSON data patterns
      /"quantity_sold"[^:]*:\s*(\d+)/i,
      /"sold"[^:]*:\s*(\d+)/i,
      /"orders_count"[^:]*:\s*(\d+)/i,
      
      // Less common patterns
      /(\d+)\s*purchased/i,
      /(\d+)\s*orders?/i,
      
      // HTML element patterns
      /"sold"[^>]*>(\d+)/i,
      /class="sold"[^>]*>(\d+)/i,
      /id="sold"[^>]*>(\d+)/i,
      
      // Generic patterns (slowest)
      /sold[^>]*>[\s\D]*(\d+)/i,
      /quantity[^>]*>[\s\D]*(\d+)/i,
    ]

    let soldCount = null
    let matchedPattern = 'none'
    
    // Try patterns with early termination
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i]
      const match = html.match(pattern)
      if (match && match[1] !== undefined) {
        soldCount = parseInt(match[1], 10)
        matchedPattern = `pattern_${i + 1}`
        break // Early termination - found the count!
      }
    }

    // Only check scripts if main patterns failed
    if (soldCount === null) {
      // More targeted script search
      const scriptMatches = html.match(/<script[^>]*>[\s\S]{0,5000}sold[\s\S]{0,100}<\/script>/gi)
      if (scriptMatches) {
        for (const scriptContent of scriptMatches) {
          const jsonMatches = [
            /"quantity_sold":\s*(\d+)/i,
            /"sold":\s*(\d+)/i,
            /"orders":\s*(\d+)/i,
            /sold[^:]*:\s*(\d+)/i,
          ]
          
          for (let i = 0; i < jsonMatches.length; i++) {
            const match = scriptContent.match(jsonMatches[i])
            if (match && match[1] !== undefined) {
              soldCount = parseInt(match[1], 10)
              matchedPattern = `script_pattern_${i + 1}`
              break
            }
          }
          if (soldCount !== null) break
        }
      }
    }

    // Only use fallback if we truly couldn't find any count
    if (soldCount === null) {
      soldCount = 0
      matchedPattern = 'fallback'
    }

    const result = {
      count: soldCount,
      lastUpdated: new Date().toISOString(),
      matchedPattern: matchedPattern,
      source: 'scraped'
    }

    // Cache the result
    cachedData = {
      ...result,
      timestamp: now
    }

    // Log for debugging (in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`Shirt count extraction: ${soldCount} (${matchedPattern}) - cached for 5min`)
    }

    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Error fetching shirt count:', error)
    
    // Try to return cached data even if fetch fails
    if (cachedData) {
      return NextResponse.json({
        count: cachedData.count,
        lastUpdated: cachedData.lastUpdated,
        error: 'Using cached data due to fetch error',
        source: 'cached_fallback'
      })
    }
    
    // Final fallback
    return NextResponse.json({ 
      count: 0,
      lastUpdated: new Date().toISOString(),
      error: 'Failed to fetch current count, showing fallback',
      source: 'error_fallback'
    })
  }
} 