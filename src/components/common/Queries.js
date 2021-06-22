export const GET_SURVEY = (id) => `
{
  survey(id: "${id}") {
    id
    dateCreated
    status
    templateSurvey {
      id
      title
      type {
        id
        type
        status
      }
      status
      templateQuestions {
        id
        title
        type {
          id
          type
          status
        }
        status
        ordering
        ratings {
          id
          title
          type
          value
        }
        dropdowns {
          id
          title
          type
          ordering
        }
      }
    }
  }
}
`

export const SUBMIT_SURVEY = ({
  surveyId,
  inputs,
}) => (
  `
  mutation {
    submitSurvey(surveyId: ${surveyId}, inputs: ${inputs}) {
      id
      dateCreated
      status
      responses {
        id
        text
        type {
          id
          type
          status
        }
        rating {
          id
          title
          type
          value
        }
        dropdown {
          id
          title
          type
          ordering
        }
      }
    }
  }
  `
)



