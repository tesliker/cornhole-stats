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
    import('./playerData/allPlayers.json')
      .then(data => {
        if (data.status === 'OK') {
          this.setState({ playerData: data.data });
        }
      })
      .catch(err => console.log(err));
  }

  comparePPR(a,b) {
    if ( a.playerPerformanceStats.totalPtsTotal > b.playerPerformanceStats.totalPtsTotal ){
      return -1;
    }
    if ( a.playerPerformanceStats.totalPtsTotal < b.playerPerformanceStats.totalPtsTotal ){
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

  compareCPI(a, b) {
    if (a.playerCPIStats.playerCPI > b.playerCPIStats.playerCPI) {
      return -1;
    }
    if (a.playerCPIStats.playerCPI < b.playerCPIStats.playerCPI) {
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
      return '(' + data.playerPerformanceStats.totalPtsTotal + ' Total Points)';
    }
    if (this.state.radioVal === 'wins') {
      return '(' + data.playerWinLossStats.winPct + '% Win)';
    }
    if (this.state.radioVal === 'diff') {
      return '(' + data.playerPerformanceStats.diffPerRnd + ' Diff)';
    }
    if (this.state.radioVal === 'cpi') {
      return '(' + data.playerCPIStats.playerCPI + ' CPI)';
    }
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

    if (this.state.radioVal === 'cpi') {
      obj.sort(this.compareCPI);
    }

    const playerMarkup = this.state.playerData.map((data, i) =>
      <Accordion>
        <AccordionSummary
        expandIcon={<ExpandMoreIcon/>}
        aria-controls="panel1a-content"
        id="panel1a-header"
          >
          <Typography>{i + 1}. {data.playerPerformanceStats.playerFirstName} {data.playerPerformanceStats.playerLastName} <span>{this.subHeading(data)}</span></Typography>
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
              {data.playerPerformanceStats.totalPts}
            </Typography>
          </div>
          <div className={'stat'}>
            <Typography>
              Opponent Pts
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.playerPerformanceStats.opponentPts}
            </Typography>
          </div>
          <div className={'stat'}>
            <Typography>
              DPR
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.playerPerformanceStats.DPR}
            </Typography>
          </div>
          <div className={'stat'}>
            <Typography>
              Four Bag %
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.playerPerformanceStats.fourBaggerPct}
            </Typography>
          </div>
          <div className={'stat'}>
            <Typography>
              Bags In %
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.playerPerformanceStats.BagsInPct}
            </Typography>
          </div>
          <div className={'stat'}>
            <Typography>
              Bags On %
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.playerPerformanceStats.BagsOnPct}
            </Typography>
          </div>
          <div className={'stat'}>
            <Typography>
              Bags Off %
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.playerPerformanceStats.BagsOffPct}
            </Typography>
          </div>
          <div className={'stat'}>
            <Typography>
              Total Points
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.playerPerformanceStats.totalPtsTotal}
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
                ACL Open Rankings
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
              <FormControlLabel value="wins" control={<Radio />} label="Win %" />
              <FormControlLabel value="diff" control={<Radio />} label="Diff" />
              <FormControlLabel value="cpi" control={<Radio />} label="CPI" />
            </RadioGroup>
          </FormControl>

          {playerMarkup}
        </Box>
      </div>
    )
  }
}

const players = [
  137573,
  104149,
  138098,
  3720,
  190906,
  137463,
  148321,
  27790,
  69521,
  138343,
  22575,
  144327,
  8458,
  100149,
  142607,
  29018,
  170111,
  183669,
  55544,
  139308,
  56043,
  67020,
  107712,
  136777,
  14445,
  101133,
  8244,
  15033,
  104029,
  27412,
  130717,
  158695,
  27979,
  9268,
  119637,
  124423,
  54009,
  116226,
  112949,
  105998,
  9609,
  170620,
  112559,
  8975,
  27393,
  44721,
  155164,
  129590,
  3693,
  8883,
  10771,
  102686,
  176669,
  52612,
  13750,
  2097,
  146469,
  118444,
  10627,
  43379,
  5309,
  10206,
  145126,
  51130,
  176952,
  101173,
  62473,
  21919,
  139120,
  100981,
  100445,
  129066,
  144285,
  114539,
  12661,
  27526,
  135954,
  124233,
  31754,
  23455,
  130027,
  155342,
  3185,
  101458,
  137542,
  20037,
  24908,
  5807,
  136431,
  60923,
  161535,
  29541,
  27181,
  69683,
  221280,
  8870,
  167540,
  61675,
  128817,
  128817,
  122670,
  154384,
  169600,
  122250,
  141819,
  165597,
  29056,
  40710,
  29142,
  104524,
  101205,
  139043,
  100783,
  13876,
  105465,
  22655,
  114724,
  125495,
  139276,
  49634,
  171985,
  101841,
  130253,
  177200,
  156224,
  158034,
  127908,
  114046,
  130983,
  168425,
  181775,
  2436,
  161653,
  123379,
  109982,
  116447,
  9101,
  52816,
  151694,
  106001,
  19083,
  177928,
  162879,
  18719,
  103443,
  154954,
  116351,
  200854,
  103926,
  140325,
  36148,
  144654,
  119894,
  108799,
  29873,
  3157,
  212511,
  26695,
  132175,
  107266,
  137585,
  9732,
  10241,
  123090,
  109473,
  130065,
  24085,
  45840,
  132801,
  43947,
  22232,
  5368,
  101009,
  58566
];

export default App;