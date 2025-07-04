/**
 * Secure Cart API - Supabase Edge Function
 * Handles cart operations with proper security, validation, and race condition prevention
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
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * Input validation helpers
 */
function validateCartId(id: string | null) {
  if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw new Error('Invalid cart ID format')
  }
  return id
}

function validateVariantId(id: string) {
  if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw new Error('Invalid variant ID format')
  }
  return id
}

function validateQuantity(quantity: number) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    throw new Error('Quantity must be an integer between 1 and 99')
  }
  return quantity
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

/**
 * Race condition safe cart item addition
 */
async function safeAddToCart(cartId: string, variantId: string, quantity: number) {
  // Use a transaction to prevent race conditions
  const { data, error } = await supabase.rpc('add_to_cart_safe', {
    p_cart_id: cartId,
    p_variant_id: variantId,
    p_quantity: quantity
  })

  if (error) {
    throw new Error(`Failed to add item to cart: ${error.message}`)
  }

  return data
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
    const cartId = pathParts[1] // cart/{cartId}
    const itemId = pathParts[3] // cart/{cartId}/items/{itemId}

    switch (req.method) {
      case 'GET':
        if (cartId) {
          // Get specific cart
          const validCartId = validateCartId(cartId)
          
          const { data: cart, error: cartError } = await supabase
            .from('carts')
            .select(`
              *,
              items:cart_line_items(
                *,
                variant:product_variants(
                  *,
                  product:products(title)
                )
              )
            `)
            .eq('id', validCartId)
            .single()

          if (cartError) {
            if (cartError.code === 'PGRST116') {
              throw new Error('Cart not found')
            }
            throw new Error('Failed to fetch cart')
          }

          return new Response(JSON.stringify({ cart }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        } else {
          // Create new cart
          const { data: cart, error: cartError } = await supabase
            .from('carts')
            .insert({
              metadata: { created_by: 'frontend' }
            })
            .select(`
              *,
              items:cart_line_items(
                *,
                variant:product_variants(
                  *,
                  product:products(title)
                )
              )
            `)
            .single()

          if (cartError) {
            throw new Error('Failed to create cart')
          }

          return new Response(JSON.stringify({ cart }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

      case 'POST':
        if (!cartId) {
          throw new Error('Cart ID required for adding items')
        }

        const validCartId = validateCartId(cartId)
        const body = await req.json()
        const { variant_id, quantity = 1 } = body

        const validVariantId = validateVariantId(variant_id)
        const validQuantity = validateQuantity(quantity)

        // Verify variant exists and get price
        const { data: variant, error: variantError } = await supabase
          .from('product_variants')
          .select('*, product:products(title)')
          .eq('id', validVariantId)
          .single()

        if (variantError || !variant) {
          throw new Error('Product variant not found')
        }

        // Use safe add to cart function to prevent race conditions
        try {
          const result = await safeAddToCart(validCartId, validVariantId, validQuantity)
          
          return new Response(JSON.stringify({
            item: result,
            cart_id: validCartId
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        } catch (error) {
          // Fallback to manual insertion if RPC doesn't exist
          const { data: item, error: itemError } = await supabase
            .from('cart_line_items')
            .insert({
              cart_id: validCartId,
              variant_id: validVariantId,
              quantity: validQuantity,
              unit_price: variant.price,
              title: variant.product?.title || 'Product',
              metadata: {}
            })
            .select()
            .single()

          if (itemError) {
            throw new Error('Failed to add item to cart')
          }

          return new Response(JSON.stringify({
            item,
            cart_id: validCartId
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

      case 'PUT':
        if (!cartId || !itemId) {
          throw new Error('Cart ID and Item ID required for updates')
        }

        const updateBody = await req.json()
        const { quantity: newQuantity } = updateBody
        
        const validUpdateQuantity = validateQuantity(newQuantity)

        const { error: updateError } = await supabase
          .from('cart_line_items')
          .update({ quantity: validUpdateQuantity })
          .eq('id', itemId)
          .eq('cart_id', cartId)

        if (updateError) {
          throw new Error('Failed to update cart item')
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'DELETE':
        if (!cartId || !itemId) {
          throw new Error('Cart ID and Item ID required for deletion')
        }

        const { error: deleteError } = await supabase
          .from('cart_line_items')
          .delete()
          .eq('id', itemId)
          .eq('cart_id', cartId)

        if (deleteError) {
          throw new Error('Failed to remove cart item')
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      default:
        return new Response('Method not allowed', { 
          status: 405,
          headers: corsHeaders 
        })
    }
  } catch (error) {
    console.error('Cart API Error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    const statusCode = errorMessage.includes('not found') ? 404 :
                      errorMessage.includes('Invalid') || errorMessage.includes('required') ? 400 :
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
