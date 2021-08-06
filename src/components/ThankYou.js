import React from 'react'
import {Typography} from '@material-ui/core'

function ThankYou({typeId}) {
    return (
        <div>
            <Typography style={{margin: '15px'}} variant='h6' align='left'>
            Thank you for completing our {typeId == 2 ? `Discharge summary Survey` : `Patient Experience Survey`}  <br/>
            <br/>
            Your responses will be used for quality improvement purposes. <br/>
            <br/>
            With thanks <br/>
            <br/>
            {typeId == 1 ? `The Patient Experience Unit` : `Austin Health`}

            </Typography>
        </div>
    )
}

export default ThankYou