/** terminal.send's refusals of an agent prompt, each writing nothing: a permission menu, unsent composer text, or a composer it cannot read. */
export const AGENT_PROMPT_REFUSAL_ERROR_CODES: readonly string[] = [
  'agent_prompt_blocked',
  'agent_prompt_draft_present',
  'agent_prompt_draft_unverified'
]
