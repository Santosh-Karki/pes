export const GET_SURVEY = (id) => `
{
  survey(id: "${id}") {
    id
    dateCreated
    status
    responses {
      id
      text
    }
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
        required
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

export const GET_SURVEY_GP = (ur, ep, typeId, ed) => `
{
  survey_gp(ur: "${ur}", ep: "${ep}", typeId: "${typeId}", ed: "${ed}") {
    id
    dateCreated
    status
    responses {
      id
      text
    }
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
        required
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

export const GET_WARD = (id) => 
`
query{
  wardResponse(surveyId: "${id}", title: "ward"){
    id
    text
  }
}
`

export const SUBMIT_SURVEY = ({
  surveyId,
  inputs,
}) => (
  `
  mutation recordSurveyResponses($surveyId: ID!, $inputs: [UserResponseInput!]!) {
    submitSurvey(surveyId: $surveyId, inputs: $inputs) {
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
        templateQuestion {
          id
          title               
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

export const AUTHENTICATE = (id) => (`
  mutation {
    authenticate(id: "${id}")
  }`
)

export const AUTHENTICATE_GP = (ur, ep, typeId, ed) => (`
  mutation {
    authenticate_gp(ur: "${ur}", ep: "${ep}", typeId: "${typeId}", ed: "${ed}")
  }`
)