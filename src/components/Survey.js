import { React, useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types'
import './Survey.css'
import ThankYou from './ThankYou'
import { GET_SURVEY, SUBMIT_SURVEY, AUTHENTICATE, AUTHENTICATE_GP, GET_WARD, GET_SURVEY_GP } from './common/Queries'
import fontKarla from '../resources/karla-v14-latin-regular.woff2'
import fontWorkSans from '../resources/WorkSans-VariableFont_wght.ttf'
import { Alert, AlertTitle, Rating } from '@material-ui/lab';
import { MenuItem, Paper, Select, Typography, FormControl, Grid, makeStyles, TextField, Button, Collapse, ThemeProvider, createMuiTheme, Card, Slider } from '@material-ui/core'
import useToken from './common/useToken';

function Survey() {
    const { token, setToken } = useToken();
    const location = useLocation();

    //STATES
    const [confirmSuccess, setConfirmSuccess] = useState(false)
    const [confirmError, setConfirmError] = useState(false)
    const [surveyData, setSurveyData] = useState([])
    const [surveyName, setSurveyName] = useState('')
    const [surveySubtitle, setSurveySubtitle] = useState('')
    const [ward, setWard] = useState('')
    const [loc, setLoc] = useState('')
    const [loadError, setLoadError] = useState(false)
    const [reload, setReload] = useState(0)
    const [surveyId, setSurveyId] = useState(new URLSearchParams(location.search).get('surveyId'))
    const [ur, setUr] = useState(new URLSearchParams(location.search).get('ur'))
    const [fin, setFin] = useState(new URLSearchParams(location.search).get('fin'))
    const [typeId, setTypeId] = useState(new URLSearchParams(location.search).get('typeId'))
    const [ed, setEd] = useState(new URLSearchParams(location.search).get('ed'))

    //VARIABLES
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const surveyUrl = 'https://ah-pes-backend.azurewebsites.net/graphql'
    // const surveyUrl = 'http://localhost:9000/graphql'
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
        answers?.dropdown?.map((ans, index) => {
            let temp = {}
            temp.templateQuestionId = index
            temp.typeId = 2
            temp.ratingId = 0
            temp.dropdownId = ans?.id
            temp.text = null
            inputs.push(temp)
        })
        answers?.text?.map((ans, index) => {
            let temp = {}
            temp.templateQuestionId = index
            temp.typeId = 4
            temp.ratingId = 0
            temp.dropdownId = 0
            temp.text = ans
            inputs.push(temp)
        })
        answers?.rating?.map((ans, index) => {
            const ansValue = ans
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

    const findRatingByValue = (ratings, val) => {
        const result = ratings.map(el => {
            if(el.value == val){
                return el.title
            }
        })
        console.log(result)
        return result
    }

    //CONTROLS
    const { control, register, errors, handleSubmit, watch, setValue, getValues, reset } = useForm({
        mode: "onChange",
        defaultValues: {
            surveyResponse: { surveyId: "", input: [] }
        },
    });

    const watchForm = watch()

    const authenticate = () => {
        console.log('auth pes')
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
                // console.log(accessToken)
                setToken(accessToken)
                return accessToken
            })
    }

    const authenticate_gp = () => {
        console.log('gp')
        console.log(AUTHENTICATE_GP(ur, fin, typeId, ed))
        return fetch(surveyUrl, {
            headers: {
                'Content-type': 'application/json',
                'Allow-Cross-Remote-Origin': '*'
            },
            method: 'POST',
            body: JSON.stringify({ query: AUTHENTICATE_GP(ur, fin, typeId, ed) })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data?.errors?.length > 0) throw new Error(data?.errors[0].message)

                const accessToken = data?.data?.authenticate_gp
                console.log(accessToken)
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
                query: (typeId == 2 ? GET_SURVEY_GP({ur, fin, typeId, ed}) : GET_SURVEY(surveyId) )
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data?.errors?.length > 0) throw new Error(data?.errors[0].message)
                if (typeId == 2) {
                    setSurveyId(data?.data?.survey_gp?.id)
                    setSurveyData(data?.data?.survey_gp?.templateSurvey.templateQuestions)
                } else {
                    setSurveyData(data?.data?.survey?.templateSurvey.templateQuestions)
                }
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
            // surveyId ? authenticate() : authenticate_gp()
            if(!typeId) {
                authenticate()
                .then(accessToken => {
                    console.log(`token: ${accessToken}`)
                    loadSurveyQuestion(accessToken)
                    if (surveyId) {
                        loadSurveyWard(accessToken)
                    }
                })
                .catch(err => {
                    setLoadError(true)
                    console.log(err)
                })
            } else if(typeId == 2) {
                authenticate_gp()
                .then(accessToken => {
                    console.log(`token: ${accessToken}`)
                    loadSurveyQuestion(accessToken)
                    if (surveyId) {
                        loadSurveyWard(accessToken)
                    }
                })
                .catch(err => {
                    setLoadError(true)
                    console.log(err)
                })
            }
            
        }
        return () => { isMounted = false }
    }, [])

    //SURVEY TYPE SPECIFICS
    useEffect(() => {
        switch (typeId) {
            case '1':
                setSurveyName('Patient Experience Survey')
                setSurveySubtitle(`Thinking about the recent inpatient admission in ${ward?.trimEnd()}, please complete this survey regarding your experience`)
                break;
            case '2':
                setSurveyName('GP Discharge Summary Feedback')
                setSurveySubtitle(`This survey is designed for GPs to provide feedback on the quality and timeliness of discharge summaries.`)
                break;
        
            default:
                setSurveyName('Patient Experience Survey')
                setSurveySubtitle(`Thinking about the recent inpatient admission in ${ward?.trimEnd()}, please complete this survey regarding your experience`)
                break;
        }
    }, [typeId, ward])

    // console.log(watchForm.surveyResponse.rating? watchForm.surveyResponse.rating[8] : '')
    console.log(`surveyName: ${surveyName}`)

    return (
        <ThemeProvider theme={theme}>
            {surveyData === undefined || surveyData === [] || loadError ?
                <Typography variant='h5'> Survey does not exist or already completed</Typography> :
                <div className={isTabletOrMobile ? "mobile__form form__font" : "form form__font"}>

                    <div className={classes.formList}>
                        <Paper className={isTabletOrMobile? classes.mobilePaper : classes.paper} elevation={3}>
                            <div className={classes.formItem}>
                                <Typography variant="h6">
                                    <b>{surveyName}</b>
                                </Typography>
                            </div>
                        </Paper>

                        <form onSubmit={handleSubmit(submitAction)}>
                            <Paper className={isTabletOrMobile? classes.mobilePaper : classes.paper} style={{ paddingTop: '10px', paddingBottom: '25px' }} elevation={3}>
                                { confirmSuccess === false ? 
                                    <>
                                        <Typography style={{ marginLeft: '15px' }} variant="body2"><i>By completing this survey you are consenting to Austin Health using the information you provide for quality improvement purposes </i></Typography>
                                        <Typography className={classes.formItem} style={{ marginLeft: '15px' }} variant="body2">  {surveySubtitle} </Typography>
                                        {
                                            surveyData.map((row, index) => {
                                                if (row.status === "active"){
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
                                                                                        <Typography variant="body2"> {row.ratings?.[0]?.title} </Typography>
                                                                                    </Grid>
                                                                                    <Grid item>
                                                                                        <Typography variant="body2"> {row.ratings?.[row.ratings.length - 1]?.title} </Typography>
                                                                                    </Grid>
                                                                                </Grid>
                                                                                {/* (1: Not at all likely, 2: Unlikely, 3: Neutral, 4: Likely, 5: Extremely likely) */}
                                                                                {/* <Typography variant='body2'> {`(1: Very dissatisfied, 2: Dissatisfied, 3: Neutral, 4: Satisfied, 5: Very Satisfied)`} </Typography> */}
                                                                                    <Controller
                                                                                        name={`surveyResponse.rating.${row.id}`}
                                                                                        control={control}
                                                                                        onChange={([, value]) => value}
                                                                                        // as={
                                                                                            // <Grid container direction="row" justify="space-between" alignItems="center">
                                                                                            //     <Grid item xs={1}>
                                                                                                    // <Rating
                                                                                                    //     value={row.ratings.title}
                                                                                                    //     max={row.ratings.length}
                                                                                                    //     // IconContainerComponent={IconContainer}
                                                                                                    // />
                                                                                                // </Grid>
                                                                                                // {/* <Grid item xs={9}>
                                                                                                //     <Typography variant='body2'>{watchForm.surveyResponse.rating ? findRatingByValue(row.ratings, watchForm.surveyResponse.rating[row.id]) : ''}
                                                                                                //     </Typography>
                                                                                                // </Grid> */}
                                                                                            // </Grid>
                                                                                        // }
                                                                                        render={(props) => {
                                                                                            let marks = []
                                                                                            row.ratings.map((el) => {
                                                                                                marks.push({value: el.value, label: el.value }) 
                                                                                            })
                                                                                            return (
                                                                                                <Slider
                                                                                                    {...props}
                                                                                                    onChange={(_, value) => {
                                                                                                    props.onChange(value);
                                                                                                    }}
                                                                                                    valueLabelDisplay="auto"
                                                                                                    max={row.ratings?.[row.ratings.length - 1]?.value}
                                                                                                    marks={marks}
                                                                                                    defaultValue={typeId === 1 || !typeId ? 7 : 0}
                                                                                                //   step={1}
                                                                                                />
                                                                                            )
                                                                                        }}
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
                                    <ThankYou typeId={typeId}/>
                                }
                            </Paper>
                            <div className="align__center">
                                <Collapse in={!confirmSuccess}>
                                    <Button className={isTabletOrMobile ? classes.mobileSubmitButton : classes.submitButton} variant="contained" color="primary" type="Submit">Submit Survey</Button>
                                </Collapse>
                            </div>
                        </form>
                        {/* <Collapse in={confirmSuccess}>
                            <Alert severity="success">
                                <AlertTitle>Success</AlertTitle>
                                Survey Submitted
                            </Alert>
                        </Collapse> */}

                        <Collapse in={confirmError}>
                            <Alert style={{width:'100%'}} severity="error">
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