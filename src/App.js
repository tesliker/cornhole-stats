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
  state = { topPlayers: [], playerData: [], radioVal: 'ppr', selectVal: '2022-2023', playerRankings: {}};

  componentDidMount() {
    var self = this;
    fetch('https://mysqlvm.blob.core.windows.net/acl-standings/' + this.state.selectVal + '/acl-overall-standings.json')
      .then(results => results.json())
      .then(data => {
        const juniorsUrl = 'https://mysqlvm.blob.core.windows.net/acl-standings/' + this.state.selectVal + '/acl-juniors-standings.json';
        const proDoublesUrl = 'https://mysqlvm.blob.core.windows.net/acl-standings/' + this.state.selectVal + '/acl-pro-standings.json';
        const proSinglesUrl = 'https://mysqlvm.blob.core.windows.net/acl-standings/' + this.state.selectVal + '/acl-pro-standings-singles.json';
        let playerRankings = {};
        let topPlayers = [];
        var allPlayers = data.playerACLStandingsList;
        for (let i = 0; i < allPlayers.length; i++) {
          if (i < 350) {
            topPlayers.push(allPlayers[i]);
          }
        }

        // exclude any pro in top 100 singles
        fetch(proSinglesUrl)
          .then(results => results.json())
          .then(singlesData => {
            let top100SinglesPlayers = [];
            var allSinglesPlayers = singlesData.playerACLStandingsList;
            for (let i = 0; i < allSinglesPlayers.length; i++) {
              if (i < 100) {
                top100SinglesPlayers.push(allSinglesPlayers[i].playerID);
              }
              // console.log(allSinglesPlayers[i].rank);
              if (allSinglesPlayers[i].rank) {
                playerRankings[allSinglesPlayers[i].playerID] = {proSinglesRank: allSinglesPlayers[i].rank};
              }
            }
            topPlayers = topPlayers.filter(function(player) {
              return !(top100SinglesPlayers.includes(player.playerID));
            });
            // self.setState(prevState => ({
            //   playerRankings: playerRankings
            // }))


            // exclude any pro in top 50 doubles
            // exclude any pro in top 100 singles
            fetch(proDoublesUrl)
              .then(results => results.json())
              .then(doublesData => {
                let top50DoublesPlayers = [];
                var allDoublesPlayers = doublesData.proTeamsWithTotalPointsAndHistory;
                for (let i = 0; i < allDoublesPlayers.length; i++) {
                  if (i < 50) {
                    top50DoublesPlayers.push(allDoublesPlayers[i].proPlayer1ID);
                    top50DoublesPlayers.push(allDoublesPlayers[i].proPlayer2ID);
                  }
                  var proPlayer1ID = allDoublesPlayers[i].proPlayer1ID;
                  var proPlayer2ID = allDoublesPlayers[i].proPlayer2ID;
                  // var proPlayer1SinglesRank = playerRankings[allDoublesPlayers[i].proPlayer1ID].proSinglesRank[0];
                  // var proPlayer2SinglesRank = playerRankings[allDoublesPlayers[i].proPlayer2ID].proSinglesRank[0];
                  var proPlayer1DoublesRank = allDoublesPlayers[i].rank;
                  if (playerRankings[proPlayer1ID] !== undefined) {
                    playerRankings[proPlayer1ID].proDoublesRank = proPlayer1DoublesRank;
                  }
                  if (playerRankings[proPlayer2ID] !== undefined) {
                    playerRankings[proPlayer2ID].proDoublesRank = proPlayer1DoublesRank;
                  }
                }

                // self.setState(prevState => ({
                //   playerRankings: playerRankings
                // }))

                topPlayers = topPlayers.filter(function(player) {
                  return !(top50DoublesPlayers.includes(player.playerID));
                });

                // exclude any juniors not 1 and 2 overall
                fetch(juniorsUrl)
                  .then(results => results.json())
                  .then(juniorsData => {
                    let topJuniorsPlayers = [];
                    var allJuniorsPlayers = juniorsData.playerACLStandingsList;
                    for (let i = 0; i < allJuniorsPlayers.length; i++) {
                        if (allJuniorsPlayers[i].playerOverAllTotal > 1000) {
                          if (allJuniorsPlayers[i].playerFirstName !== 'Brayden' && allJuniorsPlayers[i].playerLastName !== 'Wilson') {
                            if (allJuniorsPlayers[i].playerFirstName !== 'Jayden' && allJuniorsPlayers[i].playerLastName !== 'Ellis') {
                              topJuniorsPlayers.push(allJuniorsPlayers[i].playerID);
                            }
                          }
                        }
                    }
                    topPlayers = topPlayers.filter(function(player) {
                      return !(topJuniorsPlayers.includes(player.playerID));
                    });
                    let completedTopPlayers = [];
                    for (let i = 0; i < topPlayers.length; i++) {
                      if (i < 75) {
                        completedTopPlayers.push(topPlayers[i])
                      }
                    }
                    self.setState(prevState => ({
                      topPlayers: completedTopPlayers,
                      playerRankings: playerRankings
                    }))
                  }).catch(err => console.log(err))

                self.setState(prevState => ({
                  topPlayers: topPlayers
                }))
              }).catch(err => console.log(err))

            self.setState(prevState => ({
              topPlayers: topPlayers
            }))
          }).catch(err => console.log(err))
      }).catch(err => console.log(err))
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectVal !== this.state.selectVal) {
      var self = this;
      fetch('https://mysqlvm.blob.core.windows.net/acl-standings/' + this.state.selectVal + '/acl-overall-standings.json')
        .then(results => results.json())
        .then(data => {
          const juniorsUrl = 'https://mysqlvm.blob.core.windows.net/acl-standings/' + this.state.selectVal + '/acl-juniors-standings.json';
          const proDoublesUrl = 'https://mysqlvm.blob.core.windows.net/acl-standings/' + this.state.selectVal + '/acl-pro-standings.json';
          const proSinglesUrl = 'https://mysqlvm.blob.core.windows.net/acl-standings/' + this.state.selectVal + '/acl-pro-standings-singles.json';
          let playerRankings = {};
          let topPlayers = [];
          var allPlayers = data.playerACLStandingsList;
          for (let i = 0; i < allPlayers.length; i++) {
            if (i < 350) {
              topPlayers.push(allPlayers[i]);
            }
          }

          // exclude any pro in top 100 singles
          fetch(proSinglesUrl)
            .then(results => results.json())
            .then(singlesData => {
              let top100SinglesPlayers = [];
              var allSinglesPlayers = singlesData.playerACLStandingsList;
              for (let i = 0; i < allSinglesPlayers.length; i++) {
                if (i < 100) {
                  top100SinglesPlayers.push(allSinglesPlayers[i].playerID);
                }
                // console.log(allSinglesPlayers[i].rank);
                if (allSinglesPlayers[i].rank) {
                  playerRankings[allSinglesPlayers[i].playerID] = {proSinglesRank: allSinglesPlayers[i].rank};
                }
              }
              topPlayers = topPlayers.filter(function(player) {
                return !(top100SinglesPlayers.includes(player.playerID));
              });
              // self.setState(prevState => ({
              //   playerRankings: playerRankings
              // }))


              // exclude any pro in top 50 doubles
              // exclude any pro in top 100 singles
              fetch(proDoublesUrl)
                .then(results => results.json())
                .then(doublesData => {
                  let top50DoublesPlayers = [];
                  var allDoublesPlayers = doublesData.proTeamsWithTotalPointsAndHistory;
                  for (let i = 0; i < allDoublesPlayers.length; i++) {
                    if (i < 50) {
                      top50DoublesPlayers.push(allDoublesPlayers[i].proPlayer1ID);
                      top50DoublesPlayers.push(allDoublesPlayers[i].proPlayer2ID);
                    }
                    var proPlayer1ID = allDoublesPlayers[i].proPlayer1ID;
                    var proPlayer2ID = allDoublesPlayers[i].proPlayer2ID;
                    // var proPlayer1SinglesRank = playerRankings[allDoublesPlayers[i].proPlayer1ID].proSinglesRank[0];
                    // var proPlayer2SinglesRank = playerRankings[allDoublesPlayers[i].proPlayer2ID].proSinglesRank[0];
                    var proPlayer1DoublesRank = allDoublesPlayers[i].rank;
                    if (playerRankings[proPlayer1ID] !== undefined) {
                      playerRankings[proPlayer1ID].proDoublesRank = proPlayer1DoublesRank;
                    }
                    if (playerRankings[proPlayer2ID] !== undefined) {
                      playerRankings[proPlayer2ID].proDoublesRank = proPlayer1DoublesRank;
                    }
                  }

                  // self.setState(prevState => ({
                  //   playerRankings: playerRankings
                  // }))

                  topPlayers = topPlayers.filter(function(player) {
                    return !(top50DoublesPlayers.includes(player.playerID));
                  });

                  // exclude any juniors not 1 and 2 overall
                  fetch(juniorsUrl)
                    .then(results => results.json())
                    .then(juniorsData => {
                      let topJuniorsPlayers = [];
                      var allJuniorsPlayers = juniorsData.playerACLStandingsList;
                      for (let i = 0; i < allJuniorsPlayers.length; i++) {
                        if (allJuniorsPlayers[i].playerOverAllTotal > 1000) {
                          if (allJuniorsPlayers[i].playerFirstName !== 'Brayden' && allJuniorsPlayers[i].playerLastName !== 'Wilson') {
                            if (allJuniorsPlayers[i].playerFirstName !== 'Jayden' && allJuniorsPlayers[i].playerLastName !== 'Ellis') {
                              topJuniorsPlayers.push(allJuniorsPlayers[i].playerID);
                            }
                          }
                        }
                      }
                      topPlayers = topPlayers.filter(function(player) {
                        return !(topJuniorsPlayers.includes(player.playerID));
                      });
                      let completedTopPlayers = [];
                      for (let i = 0; i < topPlayers.length; i++) {
                        if (i < 75) {
                          completedTopPlayers.push(topPlayers[i])
                        }
                      }
                      self.setState(prevState => ({
                        topPlayers: completedTopPlayers,
                        playerRankings: playerRankings
                      }))
                    }).catch(err => console.log(err))

                  self.setState(prevState => ({
                    topPlayers: topPlayers
                  }))
                }).catch(err => console.log(err))

              self.setState(prevState => ({
                topPlayers: topPlayers
              }))
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
    }
  }

  handleSelectChange = (event) => {
    this.setState({selectVal: event.target.value})
  }

  render() {
    if (this.state.topPlayers.length < 0 && this.state.playerRankings.length) {
      return;
    }

    const playerMarkup = this.state.topPlayers.map((data, index) =>
      <Accordion>
        <AccordionSummary
        expandIcon={<ExpandMoreIcon/>}
        aria-controls="panel1a-content"
        id="panel1a-header"
          >
          <Typography>{index + 1}. {data.playerFirstName} {data.playerLastName} ({data.playerOverAllTotal})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h4" gutterBottom>
            Pro Singles Rank
          </Typography>
          <div className={'stat'}>
            <Typography variant="h6" gutterBottom>
              {(this.state.playerRankings[data.playerID]) ? this.state.playerRankings[data.playerID].proSinglesRank : 'N/A'}
            </Typography>
          </div>

          <Typography variant="h4" gutterBottom>
            Pro Doubles Rank
          </Typography>

          <div className={'stat'}>
            <Typography variant="h6" gutterBottom>
              {(this.state.playerRankings[data.playerID]) ? this.state.playerRankings[data.playerID].proDoublesRank : 'N/A'}
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
              <MenuItem value={'2022-2023'}>2023</MenuItem>
              <MenuItem value={'2021-2022'}>2022</MenuItem>
              <MenuItem value={'2020-2021'}>2021</MenuItem>
            </Select>
          </FormControl>
          <div className={'on-schedule'}>
            On track to make pro
          </div>
          <div className={'accordion-wrapper'}>
            {playerMarkup}
          </div>
        </Box>
      </div>
    )
  }
}

const players = [
  '22427', '8601', '112559', '65605', '10128', '67020', '16352', '12961', '2210', '133165', '30447', '28608', '14445', '42804', '55203', '12288', '8244', '20327', '138535', '54009', '10771', '128346', '136646', '8870', '132205', '30178', '6595', '39249', '29527', '141237', '111679', '9007', '120573', '5309', '29736', '39066', '49634', '27656', '13876', '122250', '13750', '9520', '30181', '10634', '55544', '51130', '65784', '20037', '132175', '8703', '9609', '23834', '46212', '69319', '48029', '23711', '26883', '67639', '22232', '140894', '30388', '27058', '25619', '133075', '6016', '105465', '10190', '41341', '21430', '140136', '10974', '49635', '32515', '100572', '36148', '29142', '4519', '3992', '10377', '10167', '10755', '16252', '122914', '27526', '45011', '113520', '130983', '21997', '118285', '114909', '156261', '5831', '27791', '5988', '101711', '60923', '110790', '12287', '134242', '27790', '120113', '100828', '118444', '143590', '140876', '68759', '36108', '35292', '5394', '127518', '21875', '21241', '129590', '10757', '2274', '25616', '21656', '51131', '101841', '568', '42563', '65633', '42259', '100149', '110384', '130027', '67626', '56620', '48243', '68245', '125131', '58566', '59414', '142706', '55973', '119732', '130028', '125495', '101282', '156892', '114539', '100681', '116846', '107724', '129981', '67879', '7905', '68707', '46688', '16472', '54608', '132663', '22728', '133804', '9607', '66730', '9035', '105998', '46912', '47601', '47832', '102686', '33735', '100981', '5343', '47914', '63723', '114157', '123549', '27710', '41518', '112949', '53558', '4645', '44722', '140591', '116226', '68504', '25495', '9551', '111899', '131937', '26389', '114691', '23455', '40906', '52206', '44113', '151845', '109659', '6921', '103443', '126101', '62473', '109219', '115356', '117368', '64634', '161542', '21658', '67559', '124423', '122203', '121377', '14886', '112814', '12348', '22655', '46819', '135588', '1873', '7805', '30312', '27979', '46867', '110871', '27412', '44855', '158485', '45771', '135870', '19106', '118664', '122671', '124895', '25272', '35425', '124906', '69521', '100783', '122417', '137380', '43454', '10896', '134303', '10241', '5842', '119382', '24458', '52816', '8883', '2097', '51669', '101458', '124924', '47269', '14235', '105987', '50333', '29018'];
export default App;
