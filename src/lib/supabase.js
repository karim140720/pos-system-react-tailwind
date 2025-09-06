import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database helper functions
export const db = {
  // Customers
  customers: {
    async getAll() {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },

    async getById(id) {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },

    async create(customer) {
      const { data, error } = await supabase
        .from('customers')
        .insert([customer])
        .select()
        .single()
      if (error) throw error
      return data
    },

    async update(id, updates) {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },

    async delete(id) {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)
      if (error) throw error
    }
  },

  // Products
  products: {
    async getAll() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },

    async getById(id) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },

    async create(product) {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single()
      if (error) throw error
      return data
    },

    async update(id, updates) {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },

    async delete(id) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      if (error) throw error
    },

    async getLowStock() {
      const { data, error } = await supabase
        .rpc('get_low_stock_products')
      if (error) throw error
      return data
    }
  },

  // Orders
  orders: {
    async getAll() {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_name,
            quantity,
            price,
            total
          )
        `)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },

    async getById(id) {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_name,
            quantity,
            price,
            total
          )
        `)
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },

    async create(orderData) {
      const { order, orderItems } = orderData
      
      // Create order
      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert([order])
        .select()
        .single()
      
      if (orderError) throw orderError

      // Create order items
      if (orderItems && orderItems.length > 0) {
        const itemsWithOrderId = orderItems.map(item => ({
          ...item,
          order_id: orderResult.id
        }))

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(itemsWithOrderId)

        if (itemsError) throw itemsError
      }

      return orderResult
    },

    async update(id, updates) {
      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },

    async delete(id) {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id)
      if (error) throw error
    }
  },

  // Expenses
  expenses: {
    async getAll() {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },

    async getById(id) {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },

    async create(expense) {
      const { data, error } = await supabase
        .from('expenses')
        .insert([expense])
        .select()
        .single()
      if (error) throw error
      return data
    },

    async update(id, updates) {
      const { data, error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },

    async delete(id) {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
      if (error) throw error
    }
  },

  // Cashbox
  cashbox: {
    async getDailySummary(date = new Date().toISOString().split('T')[0]) {
      const { data, error } = await supabase
        .rpc('get_daily_sales_summary', { target_date: date })
      if (error) throw error
      return data[0] || { total_sales: 0, total_orders: 0, total_customers: 0 }
    },

    async getTransactions(date = new Date().toISOString().split('T')[0]) {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      const { data, error } = await supabase
        .from('cashbox_transactions')
        .select('*')
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString())
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },

    async addTransaction(transaction) {
      const { data, error } = await supabase
        .from('cashbox_transactions')
        .insert([transaction])
        .select()
        .single()
      if (error) throw error
      return data
    }
  }
}

// Auth helper functions
export const auth = {
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    if (error) throw error
    return data
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}
