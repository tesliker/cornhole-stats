import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Radio from '@mui/material/Radio';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';



class App extends Component {
  state = { playerData: [], radioVal: 'ppr', selectVal: 8};

  componentDidMount() {
    for (let i = 0; i < players.length; i++) {
      fetch('https://acl-api-server.azurewebsites.net/api/v1/acl-standings/player-id/' + players[i]  + '?bucket_id=' + this.state.selectVal)
        .then(results => results.json())
        .then(data => {
          if (data.status === 'OK') {
            if (data.playerACLStandingsList[0].playerFirstName) {
              this.setState(prevState => ({
                playerData: [...prevState.playerData, data]
              }))
            }
          }
        }).catch(err => console.log(err))
    }
  }

  comparePPR(a,b) {
    if ( a.playerACLStandingsList[0].playerOverAllTotal > b.playerACLStandingsList[0].playerOverAllTotal ){
      return -1;
    }
    if ( a.playerACLStandingsList[0].playerOverAllTotal < b.playerACLStandingsList[0].playerOverAllTotal ){
      return 1;
    }
    return 0;
  }

  compareWin(a,b) {
    if ( a.playerWinLossStats.winPct > b.playerWinLossStats.winPct ){
      return -1;
    }
    if ( a.playerWinLossStats.winPct < b.playerWinLossStats.winPct ){
      return 1;
    }
    return 0;
  }

  compareDiff(a,b) {
    if ( a.playerPerformanceStats.diffPerRnd > b.playerPerformanceStats.diffPerRnd ){
      return -1;
    }
    if ( a.playerPerformanceStats.diffPerRnd < b.playerPerformanceStats.diffPerRnd ){
      return 1;
    }
    return 0;
  }

  handleRadioChange = (event) => {
    this.setState({radioVal: event.target.value})
  }

  handleSelectChange = (event) => {
    this.setState({selectVal: event.target.value})
  }

  subHeading(data) {
    if (this.state.radioVal === 'ppr') {
      return '(' + data.playerACLStandingsList[0].playerOverAllTotal + ' Total Points)';
    }
    //
    // if (this.state.radioVal === 'wins') {
    //   return '(' + data.playerWinLossStats.winPct + '% Win)';
    // }
    //
    // if (this.state.radioVal === 'diff') {
    //   return '(' + data.playerPerformanceStats.diffPerRnd + ' Diff)';
    // }
  }

  render() {

    if (this.state.playerData.length < 0) {
      return;
    }

    var obj = this.state.playerData;
    if (this.state.radioVal === 'ppr') {
      obj.sort(this.comparePPR);
    }

    if (this.state.radioVal === 'wins') {
      obj.sort(this.compareWin);
    }

    if (this.state.radioVal === 'diff') {
      obj.sort(this.compareDiff);
    }
/*    let playerMarkup = [];
    for (let i = 0; i < this.state.playerData.length; i++) {

    }*/
    const playerMarkup = this.state.playerData.map((data, i) =>
      <Accordion>
        <AccordionSummary
        expandIcon={<ExpandMoreIcon/>}
        aria-controls="panel1a-content"
        id="panel1a-header"
          >
          <Typography>{i + 1}. {data.playerACLStandingsList[0].playerFirstName} {data.playerACLStandingsList[0].playerLastName} <span>{this.subHeading(data)}</span></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h4" gutterBottom>
            Player ACL Points Breakdown
          </Typography>
          <div className={'stat'}>
            <Typography>
              Local Pts
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.playerACLStandingsList[0].localTotalPoints}
            </Typography>
          </div>
          <div className={'stat'}>
            <Typography>
              Regional Pts
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.playerACLStandingsList[0].regionalTotalPoints}
            </Typography>
          </div>
          <div className={'stat'}>
            <Typography>
              Conference Pts
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.playerACLStandingsList[0].conferenceTotalPoints}
            </Typography>
          </div>
          <div className={'stat'}>
            <Typography>
              Open Pts
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.playerACLStandingsList[0].openTotalPoints}
            </Typography>
          </div>
          <div className={'stat'}>
            <Typography>
              Member Bonus
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.playerACLStandingsList[0].playerMembershipBonus}
            </Typography>
          </div>
          <div className={'stat'}>
            <Typography>
              Conference Bonus
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.playerACLStandingsList[0].conferenceBonusPoints}
            </Typography>
          </div>
          <div className={'stat'}>
            <Typography>
              Total Points
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.playerACLStandingsList[0].playerOverAllTotal}
            </Typography>
          </div>

        </AccordionDetails>
      </Accordion>
    );
    return (
      <div className="App">

        <Box sx={{flexGrow: 1}}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{mr: 2}}
              >
                <MenuIcon/>
              </IconButton>
              <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                ACL Cornhole stats
              </Typography>
            </Toolbar>
          </AppBar>

          <FormControl className={'SortPPR'}>
            <Select
              labelId="year-label"
              id="year"
              value={this.state.selectVal}
              label="Year"
              onChange={this.handleSelectChange}
            >
              <MenuItem value={8}>2023</MenuItem>
              <MenuItem value={7}>2022</MenuItem>
              <MenuItem value={6}>2021</MenuItem>
              <MenuItem value={5}>2020</MenuItem>
              <MenuItem value={4}>2019</MenuItem>
            </Select>
            <RadioGroup
              row
              defaultValue="ppr"
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={this.state.radioVal}
              onChange={this.handleRadioChange}
            >
              <FormControlLabel value="ppr" control={<Radio />} label="Point total" />
            </RadioGroup>
          </FormControl>

          {playerMarkup}
        </Box>
      </div>
    )
  }
}

const players = [
  "8932",
  "10634",
  "56620",
  "110871",
  "53793",
  "22427",
  "27791",
  "5394",
  "12961",
  "8860",
  "2097",
  "118664",
  "21919",
  "13318",
  "114046",
  "10757",
  "40906",
  "56462",
  "129590",
  "136646",
  "55544",
  "9609",
  "58566",
  "10755",
  "113248",
  "117368",
  "3792",
  "23834",
  "3713",
  "70632",
  "55065",
  "3693",
  "36108",
  "68720",
  "47601",
  "68759",
  "23963",
  "14886",
  "20225",
  "102484",
  "69111",
  "64634",
  "24908",
  "111664",
  "26346",
  "30447",
  "104029",
  "9837",
  "125131",
  "68899",
  "10627",
  "9768",
  "9354",
  "142242",
  "5861",
  "112615",
  "23194",
  "46805",
  "148230",
  "63723",
  "114539",
  "100295",
  "144711",
  "62093",
  "568",
  "130983",
  "5309",
  "10167",
  "39249",
  "6921",
  "43379",
  "9551",
  "101711",
  "5977",
  "114909",
  "3423",
  "4519",
  "14235",
  "68504",
  "14913",
  "7028",
  "135870",
  "25477",
  "52722",
  "104040",
  "102686",
  "5664",
  "61459",
  "121938",
  "8324",
  "5988",
  "58606",
  "55203",
  "70337",
  "110754",
  "1833",
  "106379",
  "8275",
  "65633",
  "113339",
  "27319",
  "65605",
  "46816",
  "9355",
  "68516",
  "5385",
  "19134",
  "115356",
  "62119",
  "118222",
  "44611",
  "70130",
  "137620",
  "133034",
  "22851",
  "143693",
  "146437",
  "69937",
  "113258",
  "170206",
  "46800",
  "19200",
  "7175",
  "113184",
  "124609",
  "46405",
  "113544",
  "67879",
  "10128",
  "2813",
  "104369",
  "7905",
  "30312",
  "9007",
  "23654",
  "112559",
  "121931",
  "101458",
  "13750",
  "22728",
  "7969",
  "10771",
  "20037",
  "106803",
  "54608",
  "50333",
  "102010",
  "38380",
  "5807",
  "52206",
  "2425",
  "41341",
  "29018",
  "114157",
  "1826",
  "60608",
  "20758",
  "133165",
  "9101",
  "103780",
  "116429",
  "105998",
  "24147",
  "4645",
  "54009",
  "106005",
  "29736",
  "66734",
  "100681",
  "47371",
  "36148",
  "28672",
  "47313",
  "3767",
  "30388",
  "111064",
  "110384",
  "130938",
  "68826",
  "36983",
  "132956",
  "135871",
  "26700",
  "7805",
  "25616",
  "127908",
  "118286",
  "116036",
  "111234",
  "114572",
  "16472",
  "2069",
  "101282",
  "3695",
  "8703",
  "3185",
  "18389",
  "20327",
  "65651",
  "9607",
  "126857",
  "45629",
  "2210",
  "27790",
  "6016",
  "60923",
  "38602",
  "8870",
  "5374",
  "57534",
  "66730",
  "29142",
  "40848",
  "110790",
  "32964",
  "20353",
  "12470",
  "12985",
  "29102",
  "13876",
  "105465",
  "129206",
  "21875",
  "8975",
  "25619",
  "44855",
  "140876",
  "16352",
  "49059",
  "105987",
  "21241",
  "100185",
  "2632",
  "5410",
  "55262",
  "10377",
  "123404",
  "44391",
  "121314",
  "25272",
  "131336",
  "132762",
  "47412",
  "126101",
  "474",
  "9709",
  "4161",
  "100572",
  "129478",
  "26695",
  "47301",
  "64643",
  "101284",
  "57487",
  "68184"
];

export default App;
