# Sticker Studio — Digital Sticker Packs Shop

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Homepage with a cute hero banner, tagline, and featured sticker packs
- Sticker pack product gallery (grid layout) with pack names, prices, and preview thumbnails
- Individual product pages with full preview images, description, and buy button
- Stripe-powered checkout for instant digital download delivery after purchase
- About the brand section (story, values, cute branding)
- Contact page with a simple message form
- Navigation with links to all major sections
- Footer with brand info and links

### Modify
N/A

### Remove
N/A

## Implementation Plan

### Backend
- Sticker pack catalog: `getProducts`, `getProduct(id)`
- Order/download management: `createOrder`, `getDownloadLink(orderId)`
- Contact form submission: `submitContact(name, email, message)`
- Stripe integration for payment processing
- Blob storage for sticker pack ZIP files (digital downloads)

### Frontend
- Pages: Home, Gallery, Product Detail, About, Contact, Download Confirmation
- React Router for navigation between pages
- Pastel color palette, cute typography, minimal aesthetic
- Responsive design for desktop and mobile
- Product gallery with filter/sort
- Checkout flow: product -> Stripe payment -> download link
- Sample sticker pack data with preview images
