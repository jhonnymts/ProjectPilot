import { supabase } from './supabaseClient'

export async function getDeliverables(projectId) {
  const { data, error } = await supabase
    .from('deliverables')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createDeliverable(payload) {
  const { data, error } = await supabase
    .from('deliverables')
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateDeliverable(id, payload) {
  const { data, error } = await supabase
    .from('deliverables')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteDeliverable(id) {
  const { error } = await supabase
    .from('deliverables')
    .delete()
    .eq('id', id)

  if (error) throw error
}
