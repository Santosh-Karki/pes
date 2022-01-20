import { React, useEffect, useState } from "react";
import {
  MsalAuthenticationTemplate,
  useAccount,
  useMsal,
} from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../features/auth/authConfig";
import { ErrorComponent } from "../features/common/ErrorComponent";
import { Loading } from "../features/common/Loading";
import {
  MenuItem,
  Paper,
  Select,
  Typography,
  FormControl,
  Grid,
  makeStyles,
  TextField,
  Button,
  Collapse,
  ThemeProvider,
  createMuiTheme,
  Card,
  Slider,
  Checkbox,
} from "@material-ui/core";
import { DataGrid } from "@mui/x-data-grid";

function Admin() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState({});
  const [rows, setRows] = useState([]);

  const authRequest = {
    ...loginRequest,
  };
  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || {});
  const tokenRefreshInterval = 3300000;

  useEffect(() => {
    if (account && inProgress === "none") {
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account: account,
        })
        .then((response) => {
          // console.log(response)
          setUser(response);
          setToken(response?.idToken);
        });
    }
    //Logic to renew token every 55 min. Expiration of token is 60 min
    const interval = setInterval(() => {
      console.log("token refresh time", new Date());
      if (account && inProgress === "none") {
        instance
          .acquireTokenSilent({
            ...loginRequest,
            account: account,
          })
          .then((response) => {
            console.log(response);
            setToken(response?.idToken);
            setUser(response);
          });
      }
    }, tokenRefreshInterval);
    return () => clearInterval(interval);
  }, [account, inProgress, instance]);

  useEffect(() => {
    setRows([
      {
        id: "1",
        submittedDate: "01/02/2022 01:10:00",
        comment: "Hello Comments",
        hidden: false,
      },
      {
        id: "2",
        submittedDate: "01/02/2022 01:10:00",
        comment: "Hidden Comments",
        hidden: true,
      },
      {
        id: "3",
        submittedDate: "01/02/2022 01:10:00",
        comment: "Hello Comments",
        hidden: false,
      },
      {
        id: "4",
        submittedDate: "01/02/2022 01:10:00",
        comment: "Hello Comments",
        hidden: false,
      },
      {
        id: "5",
        submittedDate: "01/02/2022 01:10:00",
        comment: "Hello Comments",
        hidden: false,
      },
      {
        id: "6",
        submittedDate: "01/02/2022 01:10:00",
        comment: "Hello Comments",
        hidden: false,
      },
      {
        id: "7",
        submittedDate: "01/02/2022 01:10:00",
        comment: "Hello Comments",
        hidden: false,
      },
      {
        id: "8",
        submittedDate: "01/02/2022 01:10:00",
        comment: "Hello Comments",
        hidden: false,
      },
      {
        id: "9",
        submittedDate: "01/02/2022 01:10:00",
        comment: "Hello Comments",
        hidden: false,
      },
      {
        id: "10",
        submittedDate: "01/02/2022 01:10:00",
        comment: "Hello Comments",
        hidden: false,
      },
      {
        id: "11",
        submittedDate: "01/02/2022 01:10:00",
        comment: "Hello Comments",
        hidden: false,
      },
      {
        id: "12",
        submittedDate: "01/02/2022 01:10:00",
        comment: "Hello Comments",
        hidden: false,
      },
      {
        id: "13",
        submittedDate: "01/02/2022 01:10:00",
        comment: "Hello Comments",
        hidden: false,
      },
      {
        id: "14",
        submittedDate: "01/02/2022 01:10:00",
        comment: "Hello Comments",
        hidden: false,
      },
      {
        id: "15",
        submittedDate: "01/02/2022 01:10:00",
        comment: "Hello Comments",
        hidden: false,
      },
      {
        id: "16",
        submittedDate: "01/02/2022 01:10:00",
        comment: "Hello Comments",
        hidden: false,
      },
    ]);
  }, []);

  //STYLES
  const useStyles = makeStyles((theme) => ({
    select: {
      height: 35,
      // marginBottom: '100px',
      // minWidth: '100%',
      // maxWidth: 1000,
      // display: 'block',
      position: "unset",
    },
    fillWidth: {
      minWidth: "100%",
      maxWidth: 1000,
    },
    paper: {
      alignItems: "center",
      marginLeft: "20%",
      marginRight: "20%",
      // width: '97.8%',
    },
    mobilePaper: {
      alignItems: "center",
      marginLeft: "10px",
      marginRight: "10px",
      width: "100%",
    },
    cancelButton: {
      color: "red",
      backgroundColor: "white",
      outlineWidth: 0,
      alignItems: "right",
      // display: 'flex',
      verticalAlign: "center",
    },
    submitButton: {
      marginLeft: "35px",
      marginRight: "35px",
      width: "97.8%",
    },
    mobileSubmitButton: {
      marginLeft: "10px",
      marginRight: "10px",
      width: "100%",
    },
    ratingCard: {
      margin: "15px",
      textAlign: "center",
    },
    formMain: {
      height: "89.8vh",
      marginLeft: "20vw",
      marginRight: "24.5vw",
      display: "flex",
      backgroundColor: "#dfdfdf",
      // overflow-y: auto;
      // overflow-x: hidden;
      minWidth: "fitContent",
    },
    formItem: {
      marginLeft: "20px",
      marginRight: "20px",
      marginTop: "10px",
      marginBottom: "10px",
    },
    formList: {
      marginTop: "2px",
      width: "95.5%",
      textAlign: "left",
      // display: 'flex'
    },
  }));

  const classes = useStyles();

  const getHidden = (params) => {
    const checked = params.row.hidden === "1";
    return checked;
  };

  const columns = [
    {
      field: "submittedDate",
      headerName: "Submitted Date",
      type: "datetime",
      minWidth: 150,
    },
    { field: "comment", headerName: "Comment", width: 900 },
    {
      field: "hidden",
      headerName: "Hidden?",
      editable: true,
      type: "boolean",
      // renderCell:() => (<Checkbox checked={{valueGetter: getHidden}}/>), valueGetter: getHidden
    },
  ];

  const handleSubmit = () => {
    //CALL GQL QUERY TO SUBMIT ROWS TO BACKEND
  };

  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Redirect}
      authenticationRequest={authRequest}
      errorComponent={ErrorComponent}
      loadingComponent={Loading}
    >
      <Paper className={classes.paper} elevation={3}>
        <div className={classes.formItem}>
          <Typography variant="h6" style={{ textAlign: "left" }}>
            <b>Admin Page</b>
          </Typography>
        </div>
      </Paper>

      <Paper
        className={classes.paper}
        style={{ paddingTop: "10px", paddingBottom: "10px" }}
        elevation={3}
      >
        <div className={classes.formItem}>
          <Typography variant="body2" style={{ textAlign: "left" }}>
            Hide or show comments:
          </Typography>
          <div style={{ height: 850, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              // pageSize={5}
              rowsPerPageOptions={[50, 100, 150, 200, 1000]}
              disableSelectionOnClick
            />
          </div>
          <div style={{ textAlign: "right" }}>
            <Button
              style={{ marginTop: "10px", marginRight: "30px" }}
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      </Paper>
    </MsalAuthenticationTemplate>
  );
}

export default Admin;
