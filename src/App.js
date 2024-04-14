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
  state = { playerData: [], radioVal: 'singles'};

  componentDidMount() {
    fetch('https://mysqlvm.blob.core.windows.net/acl-standings/2023-2024/acl-overall-standings.json')
      .then(results => results.json())
      .then(data => {
        const playersWithSkillP = data.playerACLStandingsList.filter(player => player.playerSkillLevel === 'P');
        const playerData = [];
        playersWithSkillP.forEach(player => {
          fetch(`https://acl-api-server.azurewebsites.net/api/v1/acl-standings/player-id/${player.playerID}?bucket_id=8`)
            .then(results => results.json())
            .then(data => {
              const events = data.playerACLStandingsList[0].completeEventList.filter(event =>
                event.eventtype === 'N' &&
                event.locationname === "Palm Beach Convention Center" &&
                !event.leaguename.toLowerCase().includes('canada') &&
                !event.leaguename.toLowerCase().includes('elite'));
              const doublePoints = events.filter(event => event.matchtype === 'D').reduce((acc, curr) => acc + curr.totalEventpoints, 0);
              const singlesPoints = events.filter(event => event.matchtype === 'S').reduce((acc, curr) => acc + curr.totalEventpoints, 0);
              playerData.push({ ...player, doublePoints, singlesPoints });
            }).then(() => {
            if (playerData.length === playersWithSkillP.length) {
              this.rankPlayers(playerData, 'doublePoints');
              this.rankPlayers(playerData, 'singlesPoints');
              this.setState({ playerData });
            }
          }).catch(err => console.log(err));
        });
      }).catch(err => console.log(err));
  }






  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectVal !== this.state.selectVal) {
      this.setState({ playerData: [] });
      fetch('https://mysqlvm.blob.core.windows.net/acl-standings/2023-2024/acl-overall-standings.json')
        .then(results => results.json())
        .then(data => {
          const playersWithSkillP = data.playerACLStandingsList.filter(player => player.playerSkillLevel === 'P');
          const playerData = [];
          playersWithSkillP.forEach(player => {
            fetch(`https://acl-api-server.azurewebsites.net/api/v1/acl-standings/player-id/${player.playerID}?bucket_id=8`)
              .then(results => results.json())
              .then(data => {
                const events = data.playerACLStandingsList[0].completeEventList.filter(event =>
                  event.eventtype === 'N' &&
                  event.locationname === "Palm Beach Convention Center" &&
                  !event.leaguename.toLowerCase().includes('canada') &&
                  !event.leaguename.toLowerCase().includes('elite'));
                const doublePoints = events.filter(event => event.matchtype === 'D').reduce((acc, curr) => acc + curr.totalEventpoints, 0);
                const singlesPoints = events.filter(event => event.matchtype === 'S').reduce((acc, curr) => acc + curr.totalEventpoints, 0);
                playerData.push({ ...player, doublePoints, singlesPoints });
              }).then(() => {
              if (playerData.length === playersWithSkillP.length) {
                this.rankPlayers(playerData, 'doublePoints');
                this.rankPlayers(playerData, 'singlesPoints');
                this.setState({ playerData });
              }
            }).catch(err => console.log(err));
          });
        }).catch(err => console.log(err));
    }
  }



  rankPlayers(players, pointType) {
    players.sort((a, b) => b[pointType] - a[pointType]);

    let rank = 1;
    if (pointType === 'doublePoints') {  // Special handling for doubles
      for (let i = 0; i < players.length; i++) {
        if (i > 0 && players[i][pointType] === players[i - 1][pointType]) {
          players[i][`${pointType}Ranking`] = players[i - 1][`${pointType}Ranking`];
        } else {
          players[i][`${pointType}Ranking`] = Math.ceil((rank + 1) / 2); // "Halving" the rank conceptually
        }
        rank++;
      }
    } else {  // Standard ranking for singles
      for (let i = 0; i < players.length; i++) {
        if (i > 0 && players[i][pointType] === players[i - 1][pointType]) {
          players[i][`${pointType}Ranking`] = players[i - 1][`${pointType}Ranking`];
        } else {
          players[i][`${pointType}Ranking`] = rank;
        }
        rank++;
      }
    }
  }





  compareSingles(a,b) {
    if ( a.singlesPoints > b.singlesPoints ){
      return -1;
    }
    if ( a.singlesPoints < b.singlesPoints ){
      return 1;
    }
    return 0;
  }

  compareDoubles(a,b) {
    if ( a.doublePoints > b.doublePoints ){
      return -1;
    }
    if ( a.doublePoints < b.doublePoints ){
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
    if (this.state.radioVal === 'singles') {
      obj.sort(this.compareSingles);
    }

    if (this.state.radioVal === 'doubles') {
      obj.sort(this.compareDoubles);
    }

/*    let playerMarkup = [];
    for (let i = 0; i < this.state.playerData.length; i++) {

    }*/
    console.log(this.state.playerData);
    const playerMarkup = this.state.playerData.map((data, index) =>
      <Accordion>
        <AccordionSummary
        expandIcon={<ExpandMoreIcon/>}
        aria-controls="panel1a-content"
        id="panel1a-header"
          >
          <Typography>
            {this.state.radioVal === 'singles' ? data.singlesPointsRanking : data.doublePointsRanking}. <strong>{data.playerFirstName} {data.playerLastName}</strong>
            <span> Doubles: {data.doublePoints} | Singles: {data.singlesPoints}</span>
          </Typography>
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
            <RadioGroup
              row
              defaultValue="ppr"
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={this.state.radioVal}
              onChange={this.handleRadioChange}
            >
              <FormControlLabel value="singles" control={<Radio />} label="Singles" />
              <FormControlLabel value="doubles" control={<Radio />} label="Doubles" />
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
  '170187',
  '169437',
  '52156',
  '166323',
  '109978'
];

export default App;
