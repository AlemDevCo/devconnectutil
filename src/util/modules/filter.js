// Dependencies
import BadWordsFilter from "bad-words";

// Variables
const ProfanityFilter = new BadWordsFilter

// Add Words
ProfanityFilter.addWords("osama", "hitler")

// Remove Words
ProfanityFilter.removeWords("god", "damn")

// Export
export default ProfanityFilter
