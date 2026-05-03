const ADJECTIVES = [
  "swift", "bright", "calm", "bold", "clever", "fierce", "gentle", "happy",
  "lucky", "mighty", "quiet", "shiny", "silver", "smooth", "sunny", "vivid",
];
const NOUNS = [
  "river", "mountain", "forest", "meadow", "ocean", "valley", "thunder",
  "comet", "phoenix", "harbor", "garden", "summit", "ember", "horizon",
];
const SUFFIXES = [
  "alpha", "beta", "delta", "echo", "flow", "node", "pulse", "spark",
  "wave", "zen", "loop", "core",
];

const pick = <T>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

export function generateWorkflowName(): string {
  return `${pick(ADJECTIVES)}-${pick(NOUNS)}-${pick(SUFFIXES)}`;
}
