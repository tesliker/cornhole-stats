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
      fetch('https://acl-api-server.azurewebsites.net/api/v1/yearly-player-stats/' + players[i]  + '?bucketID=' + this.state.selectVal)
        .then(results => results.json())
        .then(data => {
          if (data.data.playerPerformanceStats.ptsPerRnd) {
            this.setState(prevState => ({
              playerData: [...prevState.playerData, data.data]
            }))
          }
        }).catch(err => console.log(err))
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectVal !== this.state.selectVal) {
      this.setState(prevState => ({
        playerData: []
      }))
      for (let i = 0; i < players.length; i++) {
        fetch('https://acl-api-server.azurewebsites.net/api/v1/yearly-player-stats/' + players[i]  + '?bucketID=' + this.state.selectVal)
          .then(results => results.json())
          .then(data => {
            this.setState(prevState => ({
              playerData: [...prevState.playerData, data.data]
            }))
          }).catch(err => console.log(err))
      }
    }
  }

  comparePPR(a,b) {
    if ( a.playerPerformanceStats.ptsPerRnd > b.playerPerformanceStats.ptsPerRnd ){
      return -1;
    }
    if ( a.playerPerformanceStats.ptsPerRnd < b.playerPerformanceStats.ptsPerRnd ){
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
      return '(' + data.playerPerformanceStats.ptsPerRnd + ' PPR)';
    }

    if (this.state.radioVal === 'wins') {
      return '(' + data.playerWinLossStats.winPct + '% Win)';
    }

    if (this.state.radioVal === 'diff') {
      return '(' + data.playerPerformanceStats.diffPerRnd + ' Diff)';
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
/*    let playerMarkup = [];
    for (let i = 0; i < this.state.playerData.length; i++) {

    }*/
    const playerMarkup = this.state.playerData.map((data) =>
      <Accordion>
        <AccordionSummary
        expandIcon={<ExpandMoreIcon/>}
        aria-controls="panel1a-content"
        id="panel1a-header"
          >
          <Typography>{data.playerPerformanceStats.playerFirstName} {data.playerPerformanceStats.playerLastName} <span>{this.subHeading(data)}</span></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h4" gutterBottom>
            PERFORMANCE STATS
          </Typography>
          <div className={'stat'}>
            <Typography>
              PPR
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.playerPerformanceStats.ptsPerRnd}
            </Typography>
          </div>
          <div className={'stat'}>
            <Typography>
              OPPR
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.playerPerformanceStats.opponentPtsPerRnd}
            </Typography>
          </div>
          <div className={'stat'}>
            <Typography>
              Pt. Diff.
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.playerPerformanceStats.diffPerRnd}
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
              4 Bagger %
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.playerPerformanceStats.fourBaggerPct}
            </Typography>
          </div>

          <Typography variant="h4" gutterBottom>
            WIN / LOSS STATS
          </Typography>

          <div className={'stat'}>
            <Typography>
              Total Wins
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.playerWinLossStats.totalWins}
            </Typography>
          </div>
          <div className={'stat'}>
            <Typography>
              Total Losses
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.playerWinLossStats.totalLosses}
            </Typography>
          </div>
          <div className={'stat'}>
            <Typography>
              Total Games
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.playerWinLossStats.totalGames}
            </Typography>
          </div>
          <div className={'stat'}>
            <Typography>
              Win %
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.playerWinLossStats.winPct}
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
            </Select>
            <RadioGroup
              row
              defaultValue="ppr"
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={this.state.radioVal}
              onChange={this.handleRadioChange}
            >
              <FormControlLabel value="ppr" control={<Radio />} label="PPR" />
              <FormControlLabel value="wins" control={<Radio />} label="Win %" />
              <FormControlLabel value="diff" control={<Radio />} label="Diff" />
            </RadioGroup>
          </FormControl>

          {playerMarkup}
        </Box>
      </div>
    )
  }
}

const players = [
  '70632',
  '118664',
  '142869',
  '66099',
  '144225',
  '46251',
  '108127',
  '117254',
  '144776',
  '130843',
  '120964',
  '60597',
  '30964',
  '142119',
  '145970',
  '5519',
  '145602',
  '130317',
  '104679',
  '142118',
  '165630',
  '161741',
  '135333',
  '171043',
  '171407',
  '162970',
  '166212',
  '170187'
];

export default App;
