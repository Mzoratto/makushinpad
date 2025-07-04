/**
 * Secure Products API - Supabase Edge Function
 * Handles product operations with proper security and validation
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Environment validation
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required environment variables')
}

// CORS configuration - restrict in production
const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('NODE_ENV') === 'production' 
    ? 'https://makushinpadshop.netlify.app' 
    : '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * Input validation helpers
 */
function validatePagination(page: string | null, limit: string | null) {
  const pageNum = page ? parseInt(page) : 1
  const limitNum = limit ? parseInt(limit) : 10

  if (isNaN(pageNum) || pageNum < 1) {
    throw new Error('Invalid page number')
  }
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    throw new Error('Invalid limit (must be 1-100)')
  }

  return { page: pageNum, limit: limitNum }
}

function validateProductId(id: string | null) {
  if (!id || id.length < 1) {
    throw new Error('Invalid product ID')
  }
  return id
}

/**
 * Security middleware
 */
function checkAuthorization(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header')
  }
  return authHeader.split(' ')[1]
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Security check
    const token = checkAuthorization(req)
    
    // Parse URL
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/').filter(Boolean)
    const productId = pathParts[pathParts.length - 1]

    switch (req.method) {
      case 'GET':
        if (productId && productId !== 'products') {
          // Get single product
          const validId = validateProductId(productId)
          
          const { data: product, error: productError } = await supabase
            .from('products')
            .select(`
              *,
              variants:product_variants(*),
              options:product_options(
                *,
                values:product_option_values(*)
              )
            `)
            .eq('id', validId)
            .eq('status', 'published')
            .single()

          if (productError) {
            console.error('Database error:', productError)
            throw new Error('Product not found')
          }

          return new Response(JSON.stringify({ product }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        } else {
          // Get all products with pagination
          const { page, limit } = validatePagination(
            url.searchParams.get('page'),
            url.searchParams.get('limit')
          )

          const offset = (page - 1) * limit

          // Get products with count
          const { data: products, error: productsError, count } = await supabase
            .from('products')
            .select(`
              *,
              variants:product_variants(*),
              options:product_options(
                *,
                values:product_option_values(*)
              )
            `, { count: 'exact' })
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

          if (productsError) {
            console.error('Database error:', productsError)
            throw new Error('Failed to fetch products')
          }

          const totalPages = Math.ceil((count || 0) / limit)

          return new Response(JSON.stringify({
            products: products || [],
            pagination: {
              page,
              limit,
              total: count || 0,
              pages: totalPages
            }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

      default:
        return new Response('Method not allowed', { 
          status: 405,
          headers: corsHeaders 
        })
    }
  } catch (error) {
    console.error('API Error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    const statusCode = errorMessage.includes('not found') ? 404 :
                      errorMessage.includes('Invalid') ? 400 :
                      errorMessage.includes('authorization') ? 401 : 500

    return new Response(JSON.stringify({ 
      error: errorMessage,
      timestamp: new Date().toISOString()
    }), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
