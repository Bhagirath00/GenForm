# General Survey & Research Poll

This template provides a comprehensive structure for gathering demographic data, scaling opinions, and collecting qualitative research insights.

## Field Descriptions

* **Age Group (`age_group`)**: Categorizes respondents into ranges (Under 18 to 55+) to analyze demographic trends.
* **Current Occupation (`occupation`)**: A text field to capture the professional background of the respondent.
* **Primary Location (`primary_location`)**: Identifies the city and country of the user.
* **Education Level (`education_level`)**: Optional field to track formal education history.
* **Primary Interest (`primary_interest`)**: Identifies the user's main area of focus (Technology, Healthcare, etc.).
* **Topic Importance (`topic_importance`)**: A 1-10 scale to measure how much the respondent values the survey subject.
* **Weekly Hours (`weekly_hours`)**: A numerical field measuring time spent on the topic.
* **Engagement Frequency (`usage_frequency`)**: Measures how often the user engages with the topic (Daily to Never).
* **Biggest Challenge (`biggest_challenge`)**: A textarea for qualitative insights into user pain points.
* **Suggested Improvements (`proposed_solution`)**: Optional feedback for potential changes.
* **Discovery Source (`discovery_source`)**: Tracks how users found the survey for marketing analysis.
* **Additional Thoughts (`additional_thoughts`)**: Open-ended feedback section.

## Validation & Types
- **Schema**: Validation logic is handled in `schema.ts` using Zod.
- **TypeScript**: Data structures are defined in `types.ts`.  