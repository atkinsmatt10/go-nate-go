import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://gonatego.com", changeFrequency: "weekly", priority: 1 },
    { url: "https://gonatego.com/donate", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://gonatego.com/birthday", changeFrequency: "yearly", priority: 0.3 },
  ]
}
