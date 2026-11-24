import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'contributor']).default('user'),
})

export const locationSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
  categoryId: z.string().uuid('Please select a valid category'),
  latitude: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  longitude: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
  wheelchair_access: z.boolean().default(false),
  ramp_available: z.boolean().default(false),
  elevator_available: z.boolean().default(false),
  accessible_restroom: z.boolean().default(false),
  accessible_parking: z.boolean().default(false),
  stair_free_entry: z.boolean().default(false),
  door_accessible: z.boolean().default(false),
})

export const barrierReportSchema = z.object({
  category: z.enum([
    'broken_footpath',
    'missing_ramp',
    'blocked_sidewalk',
    'broken_elevator',
    'unsafe_crossing',
  ]),
  description: z.string().min(10, 'Please describe the barrier in at least 10 characters'),
  latitude: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  longitude: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
})

export const feedbackSchema = z.object({
  locationId: z.string().uuid('Invalid location ID'),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000, 'Comment too long').optional(),
})

export const routeQuerySchema = z.object({
  startLat: z.number().min(-90).max(90),
  startLng: z.number().min(-180).max(180),
  destLat: z.number().min(-90).max(90),
  destLng: z.number().min(-180).max(180),
  avoidStairs: z.boolean().optional().default(true),
  maxIncline: z.number().optional().default(8),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type LocationInput = z.infer<typeof locationSchema>
export type BarrierReportInput = z.infer<typeof barrierReportSchema>
export type FeedbackInput = z.infer<typeof feedbackSchema>
export type RouteQueryInput = z.infer<typeof routeQuerySchema>
