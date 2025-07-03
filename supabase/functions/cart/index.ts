import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CartItem {
  id: string
  cart_id: string
  product_variant_id: string
  quantity: number
  variant?: {
    id: string
    title: string
    sku: string
    price: number
    product: {
      id: string
      title: string
      images: any[]
    }
  }
}

interface Cart {
  id: string
  customer_id?: string
  session_id?: string
  currency_code: string
  metadata: any
  items: CartItem[]
  subtotal: number
  total: number
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const cartId = pathParts[pathParts.length - 1]
    const action = pathParts[pathParts.length - 2]

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')
    let user = null
    if (authHeader) {
      const { data: { user: authUser } } = await supabase.auth.getUser(
        authHeader.replace('Bearer ', '')
      )
      user = authUser
    }

    switch (req.method) {
      case 'GET':
        // Get cart by ID or create new cart
        let cart: Cart | null = null

        if (cartId && cartId !== 'cart') {
          // Get existing cart
          const { data: existingCart, error: cartError } = await supabase
            .from('carts')
            .select(`
              *,
              items:cart_line_items(
                *,
                variant:product_variants(
                  *,
                  product:products(id, title, images)
                )
              )
            `)
            .eq('id', cartId)
            .single()

          if (cartError && cartError.code !== 'PGRST116') throw cartError
          cart = existingCart
        }

        if (!cart) {
          // Create new cart
          const { data: newCart, error: createError } = await supabase
            .from('carts')
            .insert({
              customer_id: user?.id,
              session_id: user ? null : crypto.randomUUID(),
              currency_code: 'CZK'
            })
            .select(`
              *,
              items:cart_line_items(
                *,
                variant:product_variants(
                  *,
                  product:products(id, title, images)
                )
              )
            `)
            .single()

          if (createError) throw createError
          cart = newCart
        }

        // Calculate totals
        const subtotal = cart.items.reduce((sum, item) => {
          return sum + (item.variant?.price || 0) * item.quantity
        }, 0)

        const cartWithTotals = {
          ...cart,
          subtotal,
          total: subtotal // Add tax/shipping calculation here if needed
        }

        return new Response(JSON.stringify({ cart: cartWithTotals }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'POST':
        // Add item to cart
        const { variant_id, quantity = 1 } = await req.json()

        if (!variant_id) {
          return new Response('variant_id is required', { 
            status: 400, 
            headers: corsHeaders 
          })
        }

        // Get or create cart
        let targetCart: any = null
        if (cartId && cartId !== 'cart') {
          const { data: existingCart } = await supabase
            .from('carts')
            .select('*')
            .eq('id', cartId)
            .single()
          targetCart = existingCart
        }

        if (!targetCart) {
          const { data: newCart, error: createError } = await supabase
            .from('carts')
            .insert({
              customer_id: user?.id,
              session_id: user ? null : crypto.randomUUID(),
              currency_code: 'CZK'
            })
            .select()
            .single()

          if (createError) throw createError
          targetCart = newCart
        }

        // Check if item already exists in cart
        const { data: existingItem } = await supabase
          .from('cart_line_items')
          .select('*')
          .eq('cart_id', targetCart.id)
          .eq('product_variant_id', variant_id)
          .single()

        if (existingItem) {
          // Update quantity
          const { data: updatedItem, error: updateError } = await supabase
            .from('cart_line_items')
            .update({ quantity: existingItem.quantity + quantity })
            .eq('id', existingItem.id)
            .select(`
              *,
              variant:product_variants(
                *,
                product:products(id, title, images)
              )
            `)
            .single()

          if (updateError) throw updateError

          return new Response(JSON.stringify({ item: updatedItem }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        } else {
          // Add new item
          const { data: newItem, error: insertError } = await supabase
            .from('cart_line_items')
            .insert({
              cart_id: targetCart.id,
              product_variant_id: variant_id,
              quantity
            })
            .select(`
              *,
              variant:product_variants(
                *,
                product:products(id, title, images)
              )
            `)
            .single()

          if (insertError) throw insertError

          return new Response(JSON.stringify({ 
            item: newItem,
            cart_id: targetCart.id 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

      case 'PUT':
        // Update item quantity
        const { item_id, quantity: newQuantity } = await req.json()

        if (!item_id || newQuantity === undefined) {
          return new Response('item_id and quantity are required', { 
            status: 400, 
            headers: corsHeaders 
          })
        }

        if (newQuantity <= 0) {
          // Remove item if quantity is 0 or negative
          const { error: deleteError } = await supabase
            .from('cart_line_items')
            .delete()
            .eq('id', item_id)

          if (deleteError) throw deleteError

          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        } else {
          // Update quantity
          const { data: updatedItem, error: updateError } = await supabase
            .from('cart_line_items')
            .update({ quantity: newQuantity })
            .eq('id', item_id)
            .select(`
              *,
              variant:product_variants(
                *,
                product:products(id, title, images)
              )
            `)
            .single()

          if (updateError) throw updateError

          return new Response(JSON.stringify({ item: updatedItem }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

      case 'DELETE':
        if (action === 'items') {
          // Remove specific item
          const { item_id } = await req.json()
          
          const { error: deleteError } = await supabase
            .from('cart_line_items')
            .delete()
            .eq('id', item_id)

          if (deleteError) throw deleteError

          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        } else {
          // Clear entire cart
          const { error: clearError } = await supabase
            .from('cart_line_items')
            .delete()
            .eq('cart_id', cartId)

          if (clearError) throw clearError

          return new Response(JSON.stringify({ success: true }), {
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
    console.error('Error in cart function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
