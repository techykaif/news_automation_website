// /lib/data-source.ts

import * as sheets from "./google-sheets"

const provider = process.env.DATA_PROVIDER || "sheets"

// Future ready:
let service = sheets

// Later you can do:
// if (provider === "supabase") service = supabaseService
// if (provider === "firebase") service = firebaseService

export const getPublishedPosts = service.getPublishedPosts
export const getPostBySlug = service.getPostBySlug
export const getPostsByCategory = service.getPostsByCategory
export const getCategories = service.getCategories
export const getFeaturedPosts = service.getFeaturedPosts
export const getBreakingNews = service.getBreakingNews
export const searchPosts = service.searchPosts