import {React, useEffect, useState} from 'react'
import { useForm, Controller, useFieldArray } from "react-hook-form";
import './Survey.css'
import {GET_SURVEY, SUBMIT_SURVEY} from './common/Queries'
import fontKarla from '../resources/karla-v14-latin-regular.woff2'
import fontWorkSans from '../resources/WorkSans-VariableFont_wght.ttf'
import { Alert, AlertTitle, Rating } from '@material-ui/lab';
import {MenuItem, Paper, Select, Typography, FormControl, Grid, makeStyles, TextField, Button, Collapse, ThemeProvider, createMuiTheme} from '@material-ui/core'
import CancelIcon from '@material-ui/icons/Cancel';
import SearchIcon from '@material-ui/icons/Search';

function Survey() {
    //STATES
    const [confirmSuccess, setConfirmSuccess] = useState(false) 
    const [confirmError, setConfirmError] = useState(false) 
    const [surveyData, setSurveyData] = useState([])
    const [reload, setReload ] = useState(0)

    //VARIABLES
    const surveyUrl = 'http://localhost:9000/graphql'
    
    const reasons = [
        'Casual position holders', 
        'Health Assistants in Nursing (Trainees)', 
        'Honorary position holders',
        'Long term illness or injury',
        'Long term worker\'s compensation',
        'Maternity leave',
        'New Starters',
        'Nurse bank & PSA bank',
        'VMOs who are contracted for 0.2EFT or less',
        'Other'
    ]

    //STYLES
    const useStyles = makeStyles(theme => ({
        select: {
            height: 35,
            minWidth: '100%',
            maxWidth: 1000
        },
        fillWidth: {
            minWidth: '100%',
            maxWidth: 1000,
        },
        paper: {
            marginLeft: '15px',
            marginRight: '15px',
            width: '97.8%'
        },
        cancelButton: {
            color: 'red',
            backgroundColor: 'white',
            outlineWidth: 0,
            alignItems : 'right',
            display: 'flex',
            verticalAlign: 'center'
        },
        submitButton: {
            marginLeft: '15px',
            marginRight: '15px',
            width: '97.8%'
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
        h6:{
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
    const submitAction = (data) => {
        fetch(surveyUrl, {
            headers: {
                'Content-type': 'application/json',
                'Allow-Cross-Remote-Origin': '*'
            },
            method: 'POST',
            body: JSON.stringify({query: SUBMIT_SURVEY('F0D87428-5B4C-4241-ACDE-20B668FC7ED5', [])})
        })
        .then(res => res.json())
        .then(resData=> {
            console.log(resData)
        })
        .then(setConfirmSuccess(true))
    }


    //CONTROLS
    const { control, register, errors, handleSubmit, watch, setValue, getValues, reset } = useForm({
        defaultValues: {
            exemption: [{employeeID: "", employeeName: "", exemptionFor: "", effectiveDate: "", endDate: "", reason: "", employeeEmail: "", managerEmail: ""}]
        },
        // resolver: yupResolver(validationSchema),
    });

    const { fields, append, remove, insert } = useFieldArray(
        {
          control,
          name: "exemption"
        }
    );

    //INIT
    // console.log(JSON.stringify({query: GET_SURVEY('F0D87428-5B4C-4241-ACDE-20B668FC7ED5')}))
    //FETCH SURVEY DATA
    useEffect(() => {
        let isMounted = true
        fetch(surveyUrl, {
            headers: {
                'Content-type': 'application/json',
                'Allow-Cross-Remote-Origin': '*'
            },
            method: 'POST',
            body: JSON.stringify({query: GET_SURVEY('F0D87428-5B4C-4241-ACDE-20B668FC7ED5')})
        })
        .then(res => res.json())
        .then(data=> {
            console.log(data.data.survey.templateSurvey.templateQuestions)
            setSurveyData(data.data.survey.templateSurvey.templateQuestions)
        })
        return () => { isMounted = false }
    }, [reload])

    console.log(surveyData)

    return(
        <ThemeProvider theme={theme}>
        <div className="form form__font">
            
            <div className="form__list">
                <Paper className={classes.paper} elevation={3}>
                    <div className="form__item form__header__font">
                        <Typography variant="h6"> 
                            <b>Patient Experience Survey</b> 
                        </Typography>
                    </div>
                </Paper>
                
                <form onSubmit={handleSubmit(submitAction)}>
                    <Paper className={classes.paper} elevation={3}>
                    {
                        surveyData.map((row, index) => {
                            
                            return(
                                <>
                                    <div className="form__item thick">
                                        <Grid container spacing={0}>
                                            <Grid item xs={10}>
                                                <Typography className='form__item' variant="body2">  {index + 1}. {row.title} </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth >
                                                {
                                                    row.type.type === "dropdown" ?
                                                    <Controller
                                                        as={
                                                            <Select
                                                                variant="outlined"
                                                                className={classes.select}
                                                                size="small"
                                                            >
                                                                {
                                                                    row.dropdowns.map(pos => (
                                                                    <MenuItem value={pos.title}> {pos.title} </MenuItem>
                                                                    ))
                                                                }
                                                            </Select>
                                                        }
                                                        name={`surveyAnswer[${index}].${row.id}`}
                                                        control={control}
                                                        // defaultValue={`${item.exemptionFor}`}
                                                    /> :
                                                    undefined
                                                }
                                                {
                                                    row.type.type === "text" ?
                                                    <Controller
                                                        as={<TextField label={row.title} variant="outlined" size="small" multiline fillWidth/>}
                                                        name={`surveyAnswer[${index}].${row.id}`}
                                                        control={control}
                                                        // defaultValue={`${item.employeeID}`}
                                                    /> :
                                                    undefined
                                                }
                                                {
                                                    row.type.type === "rating" ?
                                                    <Controller
                                                        as={<Rating max={row.ratings.length} />}
                                                        name={`surveyAnswer[${index}].${row.id}`}
                                                        control={control}
                                                        // defaultValue={`${item.employeeID}`}
                                                    /> :
                                                    undefined 
                                                }
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </div>
                                    {/* <Typography variant="body2">{index + 1}. {row.title}</Typography> */}
                                </>
                            )
                        })
                    }
                    </Paper>
                    <div className="align__center">
                        <Button className={classes.submitButton} variant="contained" color="primary" type="Submit">Submit Survey</Button>
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
         </ThemeProvider>
    )
}

export default Survey