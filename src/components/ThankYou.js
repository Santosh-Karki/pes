import React from 'react'
import {Typography} from '@material-ui/core'

function ThankYou() {

    return (
        <div>
            <Typography style={{margin: '15px'}} variant='h6' align='left'>
                Thank you for completing our Patient Experience Survey. <br/>
                <br/>
                Your responses will be used for quality improvement purposes. <br/>
                <br/>
                If you would like to provide further feedback, please email feedback@austin.org.au <br/>
                <br/>
                With thanks <br/>

                <br/>

                The Patient Experience Team <br/>

                Austin Health
            </Typography>
        </div>
    )
}

export default ThankYou