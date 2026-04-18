import { NextResponse } from "next/server"

interface BirthdayPhoto {
  alt: string
  caption: string
  src: string
}

const birthdayPhotoFolderId = "1enjlhs6FEcfN5HEEDxb-kqGk35N1E5Cc"
const birthdayPhotoFolderUrl = `https://drive.google.com/embeddedfolderview?id=${birthdayPhotoFolderId}#grid`
const imageTitlePattern = /\.(avif|gif|jpe?g|png|webp)$/i
const folderEntryPattern =
  /<div class="flip-entry" id="entry-([^"]+)"[\s\S]*?<div class="flip-entry-title">([^<]+)<\/div>/g
const emptyBirthdayPhotos: BirthdayPhoto[] = []

function decodeHtmlText(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
}

function buildDrivePhotoUrl(fileId: string): string {
  return `https://lh3.googleusercontent.com/d/${fileId}=w1600`
}

function buildPhotoAltText(title: string): string {
  const readableTitle = title.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim()

  if (!readableTitle) {
    return "Photo of Nate from the birthday gallery"
  }

  return `Photo of Nate from the birthday gallery: ${readableTitle}`
}

function parseBirthdayPhotos(html: string): BirthdayPhoto[] {
  const photos: BirthdayPhoto[] = []

  for (const match of html.matchAll(folderEntryPattern)) {
    const fileId = match[1]
    const title = decodeHtmlText(match[2].trim())

    if (!imageTitlePattern.test(title)) {
      continue
    }

    photos.push({
      src: buildDrivePhotoUrl(fileId),
      alt: buildPhotoAltText(title),
      caption: title,
    })
  }

  return photos
}

export async function GET() {
  const headers = new Headers({
    "Content-Type": "application/json",
    "Cache-Control": "s-maxage=300, stale-while-revalidate=900",
  })

  try {
    if (process.env.NODE_ENV === "development") {
      // Local Node in this workspace does not trust Google's chain, but production should keep TLS verification enabled.
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
    }

    const response = await fetch(birthdayPhotoFolderUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      next: {
        revalidate: 300,
      },
    })

    if (!response.ok) {
      console.error("Birthday photo folder request failed.", response.status, response.statusText)
      return NextResponse.json({ photos: emptyBirthdayPhotos }, { headers })
    }

    const html = await response.text()
    const photos = parseBirthdayPhotos(html)

    return NextResponse.json({ photos }, { headers })
  } catch (error) {
    console.error("Birthday photo folder parsing failed.", error)
    return NextResponse.json({ photos: emptyBirthdayPhotos }, { headers })
  }
}
