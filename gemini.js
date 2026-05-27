import { supabase } from './supabaseClient'

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getProject(id) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createProject(payload) {
  const { data, error } = await supabase
    .from('projects')
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProject(id, payload) {
  const { data, error } = await supabase
    .from('projects')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProject(id) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getProjectStats(userId) {
  const { data, error } = await supabase
    .from('projects')
    .select('status, methodology, priority')
    .eq('user_id', userId)

  if (error) throw error

  const stats = {
    total: data.length,
    active: data.filter(p => p.status === 'active').length,
    completed: data.filter(p => p.status === 'completed').length,
    on_hold: data.filter(p => p.status === 'on_hold').length,
    agile: data.filter(p => p.methodology === 'agile').length,
    waterfall: data.filter(p => p.methodology === 'waterfall').length,
  }
  return stats
}
