import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Product {
  id: string
  title: string
  description: string
  handle: string
  status: string
  images: any[]
  metadata: any
  created_at: string
  updated_at: string
  variants?: ProductVariant[]
  options?: ProductOption[]
}

interface ProductVariant {
  id: string
  product_id: string
  title: string
  sku: string
  price: number
  compare_at_price?: number
  inventory_quantity: number
  weight: number
  metadata: any
}

interface ProductOption {
  id: string
  product_id: string
  name: string
  position: number
  values: ProductOptionValue[]
}

interface ProductOptionValue {
  id: string
  option_id: string
  value: string
  position: number
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const productId = url.pathname.split('/').pop()

    switch (req.method) {
      case 'GET':
        if (productId && productId !== 'products') {
          // Get single product with variants and options
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
            .eq('id', productId)
            .eq('status', 'published')
            .single()

          if (productError) throw productError

          return new Response(JSON.stringify({ product }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        } else {
          // Get all products with pagination
          const page = parseInt(url.searchParams.get('page') || '1')
          const limit = parseInt(url.searchParams.get('limit') || '10')
          const offset = (page - 1) * limit

          const { data: products, error: productsError } = await supabase
            .from('products')
            .select(`
              *,
              variants:product_variants(*),
              options:product_options(
                *,
                values:product_option_values(*)
              )
            `)
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

          if (productsError) throw productsError

          // Get total count for pagination
          const { count, error: countError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'published')

          if (countError) throw countError

          return new Response(JSON.stringify({ 
            products,
            pagination: {
              page,
              limit,
              total: count,
              pages: Math.ceil((count || 0) / limit)
            }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

      case 'POST':
        // Create new product (admin only)
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
          return new Response('Unauthorized', { status: 401, headers: corsHeaders })
        }

        const productData = await req.json()
        
        // Validate required fields
        if (!productData.title || !productData.handle) {
          return new Response('Missing required fields: title, handle', { 
            status: 400, 
            headers: corsHeaders 
          })
        }

        // Create product
        const { data: newProduct, error: createError } = await supabase
          .from('products')
          .insert({
            title: productData.title,
            description: productData.description,
            handle: productData.handle,
            status: productData.status || 'draft',
            images: productData.images || [],
            metadata: productData.metadata || {}
          })
          .select()
          .single()

        if (createError) throw createError

        // Create variants if provided
        if (productData.variants?.length > 0) {
          const variants = productData.variants.map((variant: any) => ({
            product_id: newProduct.id,
            title: variant.title,
            sku: variant.sku,
            price: variant.price,
            compare_at_price: variant.compare_at_price,
            inventory_quantity: variant.inventory_quantity || 0,
            weight: variant.weight || 0,
            metadata: variant.metadata || {}
          }))

          const { error: variantsError } = await supabase
            .from('product_variants')
            .insert(variants)

          if (variantsError) throw variantsError
        }

        return new Response(JSON.stringify({ product: newProduct }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'PUT':
        // Update product (admin only)
        if (!productId || productId === 'products') {
          return new Response('Product ID required', { status: 400, headers: corsHeaders })
        }

        const updateData = await req.json()
        
        const { data: updatedProduct, error: updateError } = await supabase
          .from('products')
          .update({
            title: updateData.title,
            description: updateData.description,
            handle: updateData.handle,
            status: updateData.status,
            images: updateData.images,
            metadata: updateData.metadata
          })
          .eq('id', productId)
          .select()
          .single()

        if (updateError) throw updateError

        return new Response(JSON.stringify({ product: updatedProduct }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'DELETE':
        // Delete product (admin only)
        if (!productId || productId === 'products') {
          return new Response('Product ID required', { status: 400, headers: corsHeaders })
        }

        const { error: deleteError } = await supabase
          .from('products')
          .delete()
          .eq('id', productId)

        if (deleteError) throw deleteError

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
    console.error('Error in products function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
