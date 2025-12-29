"use client"

import { Twitter, Facebook, Linkedin, Link2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ShareButtonsProps {
  title: string
  url: string
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Share:</span>
      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
          <Twitter className="w-4 h-4" />
          <span className="sr-only">Share on Twitter</span>
        </a>
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
          <Facebook className="w-4 h-4" />
          <span className="sr-only">Share on Facebook</span>
        </a>
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
        <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
          <Linkedin className="w-4 h-4" />
          <span className="sr-only">Share on LinkedIn</span>
        </a>
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyLink}>
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
        <span className="sr-only">Copy link</span>
      </Button>
    </div>
  )
}
