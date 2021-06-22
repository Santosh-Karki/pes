import React from 'react'
import './Header.css'
import logo from '../../resources/logo.jpg'
import banner from '../../resources/header.jpeg'
import {Paper, makeStyles} from '@material-ui/core'

function Header() {
    const useStyles = makeStyles(theme => ({
        paper: {
            width: '100%'
        },
    }))

    const classes = useStyles()

    return(
        <div className="header">
            {/* <Paper className={classes.paper} elevation={3}> */}
                <div className={classes.paper} >
                    <img src={banner} alt="Austin logo" width="100%" height="100%"/>
                </div>
            {/* </Paper> */}
        </div>
    )
}

export default Header
