import { React, useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types'
import './Survey.css'
import ThankYou from './ThankYou'
import { GET_SURVEY, SUBMIT_SURVEY, AUTHENTICATE, GET_WARD } from './common/Queries'
import fontKarla from '../resources/karla-v14-latin-regular.woff2'
import fontWorkSans from '../resources/WorkSans-VariableFont_wght.ttf'
import { Alert, AlertTitle, Rating } from '@material-ui/lab';
import { MenuItem, Paper, Select, Typography, FormControl, Grid, makeStyles, TextField, Button, Collapse, ThemeProvider, createMuiTheme, Card } from '@material-ui/core'
import useToken from './common/useToken';

function Survey() {
    const { token, setToken } = useToken();
    const location = useLocation();

    //STATES
    const [confirmSuccess, setConfirmSuccess] = useState(false)
    const [confirmError, setConfirmError] = useState(false)
    const [surveyData, setSurveyData] = useState([])
    const [ward, setWard] = useState('')
    const [loc, setLoc] = useState('')
    const [loadError, setLoadError] = useState(false)
    const [reload, setReload] = useState(0)
    const [surveyId, setSurveyId] = useState(new URLSearchParams(location.search).get('surveyId'))

    //VARIABLES
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    // const surveyId = new URLSearchParams(location.search).get('surveyId')
    const surveyUrl = process.env.REACT_APP_BACKEND_URL
    // const surveyUrl = 'https://ah-dev-pes-backend.azurewebsites.net/graphql'
    let questNo = 0

    //STYLES
    const useStyles = makeStyles(theme => ({
        select: {
            height: 35,
            // marginBottom: '100px',
            // minWidth: '100%',
            // maxWidth: 1000,
            // display: 'block',
            position: 'unset'
        },
        fillWidth: {
            minWidth: '100%',
            maxWidth: 1000,
        },
        paper: {
            alignItems: 'center',
            marginLeft: '35px',
            marginRight: '35px',
            width: '97.8%',
        },
        mobilePaper: {
            alignItems: 'center',
            marginLeft: '10px',
            marginRight: '10px',
            width: '100%',
        },
        cancelButton: {
            color: 'red',
            backgroundColor: 'white',
            outlineWidth: 0,
            alignItems: 'right',
            // display: 'flex',
            verticalAlign: 'center'
        },
        submitButton: {
            marginLeft: '35px',
            marginRight: '35px',
            width: '97.8%'
        },
        mobileSubmitButton: {
            marginLeft: '10px',
            marginRight: '10px',
            width: '100%'
        },
        ratingCard: {
            margin: '15px',
            textAlign: 'center'
        },
        formMain: {
            height: '89.8vh',
            marginLeft: '20vw',
            marginRight: '24.5vw',
            display: 'flex',
            backgroundColor: '#dfdfdf',
            // overflow-y: auto;
            // overflow-x: hidden;
            minWidth: 'fitContent',
        },
        formItem: {
            marginLeft: '20px',
            marginRight: '20px',
            marginTop: '10px',
            marginBottom: '10px',
        },
        formList: {
            marginTop: '2px',
            width: '95.5%',
            textAlign: 'left',
            // display: 'flex'
        }
    }))

    const karla = {
        fontFamily: 'Karla',
        fontDisplay: 'swap',
        fontWeight: 400,
        src: `
            local('Karla'),
            local('Karla-Regular'),
            url(${fontKarla}) format('woff2')
        `,
        unicodeRange:
            'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
    };

    const workSans = {
        fontFamily: 'WorkSans',
        fontDisplay: 'swap',
        fontWeight: 400,
        src: `
            local('WorkSans'),
            local('WorkSans-Regular'),
            url(${fontWorkSans}) format('ttf')
        `,
        unicodeRange:
            'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
    };

    const theme = createMuiTheme({
        typography: {
            fontFamily: 'Karla',
        },
        h6: {
            fontFamily: 'WorkSans'
        }
    });

    const headerTheme = createMuiTheme({
        typography: {
            fontFamily: 'WorkSans',
        },
        overrides: {
            MuiCssBaseline: {
                '@global': {
                    '@font-face': [workSans],
                },
            },
        },
    });

    const classes = useStyles()

    //FUNCTIONS
    function IconContainer(props) {
        const { value, ...other } = props;
        return (

            isTabletOrMobile ?
                    <Grid item>
                        <Card style={{ paddingLeft: '10px', paddingRight: '10px', marginRight: '1px', marginLeft: '1px', textAlign: 'center', background: 'lightgrey' }} {...other}>
                            <Typography variant='h6'>{value - 1}</Typography>
                        </Card>
                    </Grid>
                :
                    <Grid item>
                        <Card style={{ paddingLeft: '10px', paddingRight: '10px', marginRight: '28px', marginLeft: '28px', textAlign: 'center', background: 'lightgrey' }} {...other}>
                            <Typography variant='h6'>{value - 1}</Typography>
                        </Card>
                    </Grid>
        )
    }

    IconContainer.propTypes = {
        value: PropTypes.number.isRequired,
    };

    const submitAction = (data) => {
        console.log(data)
        const answers = data.surveyResponse
        let inputs = []
        answers.dropdown.map((ans, index) => {
            let temp = {}
            temp.templateQuestionId = index
            temp.typeId = 2
            temp.ratingId = 0
            temp.dropdownId = ans?.id
            temp.text = null
            inputs.push(temp)
        })
        answers.text.map((ans, index) => {
            let temp = {}
            temp.templateQuestionId = index
            temp.typeId = 4
            temp.ratingId = 0
            temp.dropdownId = 0
            temp.text = ans
            inputs.push(temp)
        })
        answers.rating.map((ans, index) => {
            const ansValue = ans - 1
            let temp = {}
            temp.templateQuestionId = index
            temp.typeId = 3
            surveyData.map(el => {
                if (el.id == index) {
                    el.ratings.map(rate => {
                        if (rate.value == ansValue) {
                            console.log('here')
                            console.log(rate.id)
                            temp.ratingId = rate.id
                        }
                    })
                }
            })
            temp.dropdownId = 0
            temp.text = null
            inputs.push(temp)
        })

        console.log(inputs)

        const reqBody =
        {
            surveyId: surveyId,
            inputs: inputs
        }

        console.log(SUBMIT_SURVEY(reqBody))
        console.log(reqBody)

        fetch(surveyUrl, {
            headers: {
                'Content-type': 'application/json',
                'Allow-Cross-Remote-Origin': '*',
                'authentication': token
            },
            method: 'POST',
            body: JSON.stringify({ query: SUBMIT_SURVEY(reqBody), variables: JSON.stringify(reqBody) })
        })
            .then(res => res.json())
            .then(resData => {
                console.log(resData)
                if (resData?.data?.submitSurvey?.status === "completed") {
                    setConfirmSuccess(true)
                } else {
                    setConfirmError(true)
                }
            })
    }


    //CONTROLS
    const { control, register, errors, handleSubmit, watch, setValue, getValues, reset } = useForm({
        mode: "onChange",
        defaultValues: {
            surveyResponse: { surveyId: "", input: [] }
        },
    });

    const authenticate = () => {
        return fetch(surveyUrl, {
            headers: {
                'Content-type': 'application/json',
                'Allow-Cross-Remote-Origin': '*'
            },
            method: 'POST',
            body: JSON.stringify({ query: AUTHENTICATE(surveyId) })
        })
            .then(res => res.json())
            .then(data => {
                if (data?.errors?.length > 0) throw new Error(data?.errors[0].message)

                const accessToken = data?.data?.authenticate
                setToken(accessToken)
                return accessToken
            })
    }

    const loadSurveyQuestion = (accessToken) => {
        fetch(surveyUrl, {
            headers: {
                'Content-type': 'application/json',
                'Allow-Cross-Remote-Origin': '*',
                'authentication': accessToken
            },
            method: 'POST',
            body: JSON.stringify({
                query: GET_SURVEY(surveyId)
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data?.errors?.length > 0) throw new Error(data?.errors[0].message)
                console.log(data?.data?.survey)
                setSurveyData(data?.data?.survey?.templateSurvey.templateQuestions)
            })
    }

    const loadSurveyWard = (accessToken) => {
        fetch(surveyUrl, {
            headers: {
                'Content-type': 'application/json',
                'Allow-Cross-Remote-Origin': '*',
                'authentication': accessToken
            },
            method: 'POST',
            body: JSON.stringify({
                query: GET_WARD(surveyId)
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data?.errors?.length > 0) throw new Error(data?.errors[0].message)
                // console.log(data?.data)
                setWard(data?.data?.wardResponse?.text)
            })
    }

    //INIT
    //FETCH SURVEY DATA
    useEffect(() => {
        let isMounted = true
        if (isMounted) {
            authenticate()
                .then(accessToken => {
                    loadSurveyQuestion(accessToken)
                    loadSurveyWard(accessToken)
                })
                .catch(err => {
                    setLoadError(true)
                    console.log(err)
                })
        }
        return () => { isMounted = false }
    }, [])

    // console.log(token)

    return (
        <ThemeProvider theme={theme}>
            {surveyData === undefined || surveyData === [] || loadError ?
                <Typography variant='h5'> Survey does not exist or already completed</Typography> :
                <div className={isTabletOrMobile ? "mobile__form form__font" : "form form__font"}>

                    <div className={classes.formList}>
                        <Paper className={isTabletOrMobile? classes.mobilePaper : classes.paper} elevation={3}>
                            <div className={classes.formItem}>
                                <Typography variant="h6">
                                    <b>Patient Experience Survey</b>
                                </Typography>
                            </div>
                        </Paper>

                        <form onSubmit={handleSubmit(submitAction)}>
                            <Paper className={isTabletOrMobile? classes.mobilePaper : classes.paper} style={{ paddingTop: '10px', paddingBottom: '25px' }} elevation={3}>
                                { confirmSuccess === false ? 
                                    <>
                                        <Typography className={classes.formItem} style={{ marginLeft: '15px' }} variant="body2">  {`Thinking about the recent inpatient admission in ${ward}, please complete this survey regarding your experience`} </Typography>
                                        {
                                            surveyData.map((row) => {
                                                if (row.status !== "hidden"){
                                                    questNo++
                                                    return (
                                                        <>
                                                            <div className={classes.formItem} style={{ verticalAlign: 'middle' }}>
                                                                <Grid container spacing={0}>
                                                                    <Grid item xs={12}>
                                                                        <Typography className={classes.formItem} variant="body2">  {questNo}. {row.title} </Typography>
                                                                    </Grid>
                                                                    <Grid item xs={12}>
                                                                        <FormControl fullWidth >
                                                                            {
                                                                                row.type.type === "dropdown" ?
                                                                                    <Controller
                                                                                        as={
                                                                                            <Select
                                                                                                required= {row.required ? true : false}
                                                                                                variant="outlined"
                                                                                                className={classes.select}
                                                                                                size="small"
                                                                                            >
                                                                                                {
                                                                                                    row.dropdowns.map(pos => (
                                                                                                        <MenuItem value={pos}> {pos.title} </MenuItem>
                                                                                                    ))
                                                                                                }
                                                                                            </Select>
                                                                                        }
                                                                                        name={`surveyResponse.dropdown.${row.id}`}
                                                                                        control={control}
                                                                                    /> :
                                                                                    undefined
                                                                            }
                                                                            {
                                                                                row.type.type === "text" ?
                                                                                    <>
                                                                                        <Typography style={{textAlign: 'right'}} variant='body2'>Max 500 characters</Typography>
                                                                                        <Controller
                                                                                            as={<TextField
                                                                                                ref={
                                                                                                    register({
                                                                                                        required: row.required ? true : false
                                                                                                    })
                                                                                                }
                                                                                                required= {row.required ? true : false}
                                                                                                label={row.title}
                                                                                                variant="outlined"
                                                                                                size="small"
                                                                                                multiline fillWidth
                                                                                                inputProps={{
                                                                                                    maxLength: 500,
                                                                                                }}
                                                                                            />}
                                                                                            name={`surveyResponse.text.${row.id}`}
                                                                                            control={control}
                                                                                        /> 
                                                                                    </>    :
                                                                                    undefined
                                                                            }
                                                                            {
                                                                                row.type.type === "rating" ?
                                                                                <>
                                                                                <Grid container direction="row" justify="space-between" alignItems="center">
                                                                                    <Grid item>
                                                                                        <Typography variant="body2"> {row.ratings[0].title} </Typography>
                                                                                    </Grid>
                                                                                    <Grid item>
                                                                                        <Typography variant="body2"> {row.ratings[row.ratings.length - 1].title} </Typography>
                                                                                    </Grid>
                                                                                </Grid>
                                                                                
                                                                                    <Controller
                                                                                            name={`surveyResponse.rating.${row.id}`}
                                                                                            control={control}
                                                                                            as={
                                                                                                <Grid container direction="row" justify="space-between" alignItems="center">
                                                                                                    <Rating
                                                                                                        value={row.ratings.title}
                                                                                                        max={row.ratings.length}
                                                                                                        IconContainerComponent={IconContainer}
                                                                                                        fullWidth
                                                                                                    />
                                                                                                </Grid>
                                                                                            }
                                                                                    />
                                                                                
                                                                                </> :
                                                                                    undefined
                                                                            }
                                                                        </FormControl>
                                                                    </Grid>
                                                                </Grid>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                            })
                                        } 
                                    </>:
                                    <ThankYou/>
                                }
                            </Paper>
                            <div className="align__center">
                                <Button className={isTabletOrMobile ? classes.mobileSubmitButton : classes.submitButton} variant="contained" color="primary" type="Submit" disabled={confirmSuccess === true ? true : false}>Submit Survey</Button>
                            </div>
                        </form>
                        <Collapse in={confirmSuccess}>
                            <Alert severity="success">
                                <AlertTitle>Success</AlertTitle>
                                Survey Submitted
                            </Alert>
                        </Collapse>

                        <Collapse in={confirmError}>
                            <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                Could not submit survey!
                            </Alert>
                        </Collapse>
                    </div>

                </div>
            }

        </ThemeProvider>
    )
}

export default Survey