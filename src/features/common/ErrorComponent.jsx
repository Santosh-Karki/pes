import { Typography } from '@material-ui/core'

export const ErrorComponent = ({ error }) => {
  return (
    <Typography variant="h6">
      An error has occurred: {error.errorCode}
    </Typography>
  )
}