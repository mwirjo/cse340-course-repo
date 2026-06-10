import { addVolunteer, removeVolunteer } from '../models/volunteers.js'

export async function volunteerForProject(req, res) {
  const projectId = req.params.id
  const userId = req.session.user.user_id
  await addVolunteer(userId, projectId)
  req.flash('success', 'You have signed up to volunteer!')
  res.redirect(`/project/${projectId}`)
}

export async function unvolunteerFromProject(req, res) {
  const projectId = req.params.id
  const userId = req.session.user.user_id
  await removeVolunteer(userId, projectId)
  req.flash('success', 'You have been removed as a volunteer.')
  res.redirect(`/project/${projectId}`)
}