import { supabase } from './supabaseClient'

export async function getNotes(projectId) {
  const { data, error } = await supabase
    .from('project_notes')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createNote(payload) {
  const { data, error } = await supabase
    .from('project_notes')
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateNote(id, payload) {
  const { data, error } = await supabase
    .from('project_notes')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteNote(id) {
  const { error } = await supabase
    .from('project_notes')
    .delete()
    .eq('id', id)

  if (error) throw error
}
