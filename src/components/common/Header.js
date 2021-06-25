import React from 'react'
import {useMediaQuery} from 'react-responsive'
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
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

    return(
        isTabletOrMobile ?
        <div className="mobile__header">
                <div className={classes.paper} >
                    <img src={banner} alt="Austin logo" width="100%" height="100%"/>
                </div>
        </div> :
        <div className="header">
                <div className={classes.paper} >
                    <img src={banner} alt="Austin logo" width="100%" height="100%"/>
                </div>
        </div>
    )
}

export default Header
