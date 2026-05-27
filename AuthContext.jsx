import { supabase } from './supabaseClient'

export async function getRisks(projectId) {
  const { data, error } = await supabase
    .from('risks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createRisk(payload) {
  const { data, error } = await supabase
    .from('risks')
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateRisk(id, payload) {
  const { data, error } = await supabase
    .from('risks')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteRisk(id) {
  const { error } = await supabase
    .from('risks')
    .delete()
    .eq('id', id)

  if (error) throw error
}
