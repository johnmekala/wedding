# Video Architecture — Hero Cinematic

Place your hero video file here:

```
/public/videos/hero-cinematic.mp4
```

The CinematicHero component will automatically detect and use this video.
If the video fails to load or doesn't exist, it gracefully falls back to the 
couple photograph (photos.awww).

## Video Recommendations
- Format: MP4 (H.264)
- Resolution: 1920×1080 or higher
- Duration: 15–60 seconds looping
- Bitrate: 8–15 Mbps for quality
- Audio: Muted (autoplay requires muted)

## Poster Image
The poster image displayed while the video loads is the couple photograph.
No additional poster file is needed.

## Mobile
On mobile, the `<video>` element will use `playsInline` to prevent fullscreen takeover.
If you want a separate mobile poster image, add:
`/public/videos/hero-poster-mobile.jpg`
and reference it in CinematicHero.tsx.
