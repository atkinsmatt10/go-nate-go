import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // The alias currently resolves to team 16431 and survives annual event ID changes.
    const url = 'https://chop.donordrive.com/api/1.6/teams/nate-the-great'
    
    // Get If-None-Match header for efficient caching
    const ifNoneMatch = request.headers.get('if-none-match') || ''
    
    const response = await fetch(url, {
      headers: {
        'If-None-Match': ifNoneMatch,
      },
    })

    // If not modified, return 304
    if (response.status === 304) {
      return new NextResponse(null, { status: 304 })
    }

    if (!response.ok) {
      console.error('DonorDrive API error:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'Failed to fetch donation data' },
        { status: 502 }
      )
    }

    const data = await response.json()
    const team = Array.isArray(data) ? data[0] : data
    
    if (!team || typeof team.sumDonations !== 'number') {
      console.error('Unexpected API response format:', data)
      return NextResponse.json(
        { error: 'Invalid response format' },
        { status: 502 }
      )
    }

    const headers = new Headers({
      'Content-Type': 'application/json',
      // Cache for 15 seconds with stale-while-revalidate
      'Cache-Control': 's-maxage=15, stale-while-revalidate=60',
    })

    // Forward ETag if present
    const etag = response.headers.get('ETag')
    if (etag) {
      headers.set('ETag', etag)
    }

    return NextResponse.json(
      { 
        total: team.sumDonations,
        goal: team.fundraisingGoal || 30000,
        numDonations: team.numDonations || 0,
        teamName: team.name || 'Team Nate the Great',
        lastUpdated: new Date().toISOString()
      },
      { headers }
    )
    
  } catch (error) {
    console.error('Error fetching donation data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
