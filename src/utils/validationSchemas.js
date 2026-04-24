import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email requis')
    .email('Email invalide'),
  password: z
    .string()
    .min(1, 'Mot de passe requis')
    .min(6, 'Minimum 6 caractères'),
})

export const signupSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Nom requis')
    .min(2, 'Nom trop court')
    .max(50, 'Nom trop long'),
  email: z
    .string()
    .min(1, 'Email requis')
    .email('Email invalide'),
  password: z
    .string()
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Doit contenir une majuscule')
    .regex(/[0-9]/, 'Doit contenir un chiffre'),
  confirmPassword: z.string().min(1, 'Confirmation requise'),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Vous devez accepter les conditions',
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email requis')
    .email('Email invalide'),
})

export const updatePasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Doit contenir une majuscule')
    .regex(/[0-9]/, 'Doit contenir un chiffre'),
  confirmPassword: z.string().min(1, 'Confirmation requise'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

export const shippingAddressSchema = z.object({
  name: z
    .string()
    .min(1, 'Nom requis')
    .min(2, 'Nom trop court')
    .max(100, 'Nom trop long'),
  email: z
    .string()
    .min(1, 'Email requis')
    .email('Email invalide'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(\+|0)[1-9]\d{8,}$/.test(val.replace(/\s/g, '')),
      'Numéro de téléphone invalide'
    ),
  addressLine1: z
    .string()
    .min(1, 'Adresse requise')
    .max(200, 'Adresse trop longue'),
  addressLine2: z.string().max(200).optional(),
  city: z
    .string()
    .min(1, 'Ville requise')
    .max(100, 'Ville trop longue'),
  postalCode: z
    .string()
    .min(1, 'Code postal requis')
    .regex(/^[0-9]{4,10}$/, 'Code postal invalide'),
  country: z.string().min(1, 'Pays requis').default('France'),
  notes: z.string().max(500).optional(),
})