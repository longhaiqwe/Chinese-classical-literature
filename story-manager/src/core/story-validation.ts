import type { StoryChoice, StoryDocument, StoryScene, StoryValidationResult } from './types.js'

function validateChoice(choice: StoryChoice, sceneIndex: number, choiceIndex: number, errors: string[]) {
  const label = `Scene ${sceneIndex + 1} choice ${choiceIndex + 1}`
  if (!choice.text) {
    errors.push(`${label} is missing text`)
  }
  if (!choice.feedback) {
    errors.push(`${label} is missing feedback`)
  }
}

function validateScene(scene: StoryScene, sceneIndex: number, errors: string[]) {
  const label = `Scene ${sceneIndex + 1}`
  if (!scene.id) {
    errors.push(`${label} is missing id`)
  }
  if (!scene.title) {
    errors.push(`${label} is missing title`)
  }
  if (!scene.narrative) {
    errors.push(`${label} is missing narrative`)
  }
  if (scene.choices.length === 0) {
    errors.push(`${label} has no choices`)
  }

  scene.choices.forEach((choice, choiceIndex) => validateChoice(choice, sceneIndex, choiceIndex, errors))
}

export function validateStoryDocument(story: StoryDocument): StoryValidationResult {
  const errors: string[] = []

  if (!story.id) {
    errors.push('Missing story id')
  }
  if (!story.category_id) {
    errors.push('Missing category_id')
  }
  if (!story.title) {
    errors.push('Missing story title')
  }
  if (!story.ending_title) {
    errors.push('Missing ending_title')
  }
  if (!story.ending_description) {
    errors.push('Missing ending_description')
  }
  if (story.scenes.length === 0) {
    errors.push('Story must contain at least one scene')
  }

  story.scenes.forEach((scene, sceneIndex) => validateScene(scene, sceneIndex, errors))

  return {
    ok: errors.length === 0,
    errors,
    warnings: [],
  }
}
