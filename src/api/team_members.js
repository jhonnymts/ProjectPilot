import { supabase } from './supabaseClient'

export async function getTeamMembers(projectId) {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function createTeamMember(payload) {
  const { data, error } = await supabase
    .from('team_members')
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTeamMember(id, payload) {
  const { data, error } = await supabase
    .from('team_members')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTeamMember(id) {
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', id)

  if (error) throw error
}
