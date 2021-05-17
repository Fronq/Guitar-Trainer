import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Grid, Container, useMediaQuery, Popover, Divider, List, ListItem} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {Settings, Refresh, PlayArrow, Stop, Delete} from '@material-ui/icons';
import ListIcon from '@material-ui/icons/List';
import chords from './chords/index.js'

import styles from './styles'
import Chord from './Chord.js'
import logo from './logo_white.png'

const useStyles = makeStyles(styles)

function App() {
  const classes = useStyles()

  const [displayChord, setDisplayChord] = useState(chords.blank)
  const [selectedIndex, setSelectedIndex]= useState(-1)

  const [displayTime, setDisplayTime] = useState("00:00")
  const [timerOn, setTimerOn] = useState(false)
  const [time, setTime] = useState(0)
  const [timer, setTimer] = useState()

  const [chordSequence, setChordSequence] = useState([])
  const [history, setHistory] = useState([])
  const [chordData, setChordData] = useState([])
  const [chordChangeData, setChordChangeData] = useState([])

  const [chordList, setChordList] = useState(["A","Em","D","Gfolk"])

  const [anchorList, setAnchorList] = useState(null)
  const [anchorSettings, setAnchorSettings] = useState(null)

  const [analyze, setAnalyze] = useState(false)
  const [emptyData, setEmptyData] = useState(true)
  const [historyReverse, setHistoryReverse] = useState([])
  const [min, setMin] = useState()
  const [max, setMax] = useState()
  const [avg, setAvg] = useState()
  const [avg5, setAvg5] = useState()
  const [cmax, setCmax] = useState({})
  const [ccmax, setCcmax] = useState({})
  const [cper, setCper] = useState()
  const [ccper, setCcper] = useState()

  document.body.style = 'background: #2f3136;';
  

  const fullChordList = ["A", "A7", "Am", "Amaj7", "Amin7", "Asus2", "Asus4", "B7", "Bm", "C", "C7", "Cmaj7", "D", "D7", "Dm", "Dmaj7", "Dmin7", "Dsus2", "Dsus4", "E", "E7", "Em", "Emaj7", 
    "Emin7","Esus4", "F", "Fadd7", "Fmaj7", "G7", "Gfolk", "Gmaj7", "Grock"]

  const isPortrait = useMediaQuery('(orientation:portrait)')
  const isPhone = useMediaQuery('(max-width:720px)')

  // Show enlarged chord diagram
  const selectDisplayChord = (chordName, index) => {
    setDisplayChord(chords[chordName])
    setSelectedIndex(index)
  }

  // Select chord from settings
  const selectChord = (chordName) => {
    setChordList([...chordList,chordName])
  }

  // Deselect chord from settings
  const deselectChord = (chordName) => {
    const i = chordList.indexOf(chordName)
    let l = [...chordList]
    l.splice(i,1)
    setChordList(l)
  }

  // Reset chords from settings
  const resetChordList = () =>{
    setChordList(["A","Em","D","Gfolk"])
  }

  // const handleDelete = () => {
  //   if (history.length !== 0){
  //     let l = [...history]
  //     l.pop()
  //     setHistory(l)
  //   }
  //   setDisplayTime("00:00")
  // }

  // Generate 24 chords randomly from a given list, they cannot repeat
  const generateChordsBasic = () => {
    let list = []
    let lastChord = ""
    for (let i = 0; i < 24; i++){
      let randomChord = ""
      do {
        randomChord = chordList[Math.floor(Math.random() * chordList.length)];
      } while(randomChord === lastChord);
      list.push(randomChord)
      lastChord = randomChord;
    }
    return list;
  }

  // Generate 24 chords using user chord data
  const generateChordsUsingChordData = () => {
    
    // bubble sort to see chord time order lowest->highest
    let sortedChordList = [...chordList]
    for (let i = 0; i < sortedChordList.length-1; i++){
      for (let j = 0; j < sortedChordList.length-1-i; j++){
        let c1 = sortedChordList[j]
        let c2 = sortedChordList[j+1]
        if (chordData[c1].avgTime > chordData[c2].avgTime){
          sortedChordList[j] = c2
          sortedChordList[j+1] = c1
        }
      }
    }

    // Skews the list so that the fastest time is least likely to be shown -> slowest time is the most likely
    let skewedChordList = [...sortedChordList]
    for (let i = 0; i < sortedChordList.length; i++){
      for (let j = 0; j < i; j++){
        skewedChordList.push(sortedChordList[i])
      }
    }

    // Generate chord sequence using a skewed list
    let list = []
    let lastChord = ""
    for (let i = 0; i < 24; i++){
      let randomChord = ""
      do {
        randomChord = skewedChordList[Math.floor(Math.random() * skewedChordList.length)];
      } while(randomChord === lastChord);
      list.push(randomChord)
      lastChord = randomChord;
    }
    return list;
  }

  // Generate 24 chords using user chord and chord change data
  const generateChordsUsingChordChangeData= (chordChangeList) => {

    // bubble sort to see chord time order lowest->highest
    let sortedChordList = [...chordList]
    for (let i = 0; i < sortedChordList.length-1; i++){
      for (let j = 0; j < sortedChordList.length-1-i; j++){
        let c1 = sortedChordList[j]
        let c2 = sortedChordList[j+1]
        if (chordData[c1].avgTime > chordData[c2].avgTime){
          sortedChordList[j] = c2
          sortedChordList[j+1] = c1
        }
      }
    }

    // Skews the list so that the fastest time is less likely to be shown -> slowest time is the more likely
    let skewedChordList = [...sortedChordList]
    for (let i = 0; i < sortedChordList.length; i++){
      for (let j = 0; j < i; j++){
        skewedChordList.push(sortedChordList[i])
      }
    }

    // bubble sort to see chord change time order lowest->highest
    let sortedChordChangeList = [...chordChangeList]
    for (let i = 0; i < sortedChordChangeList.length-1; i++){
      for (let j = 0; j < sortedChordChangeList.length-1-i; j++){
        let c1 = sortedChordChangeList[j]
        let c2 = sortedChordChangeList[j+1]
        if (chordChangeData[c1].avgTime > chordChangeData[c2].avgTime){
          sortedChordChangeList[j] = c2
          sortedChordChangeList[j+1] = c1
        }
      }
    }

    // Generate chord sequence using a list skewed twice to factor in for chord and chord change data
    let list = []
    let lastChord = ""
    for (let i = 0; i < 24; i++){
      let randomChord = ""
      do {
        // Skews the list so that fast chord changes are less likely to be shown -> slow chord changes are more likely
        let moreSkewedChordList = [...skewedChordList]
        if (lastChord !== ""){
          for (let j = 0; j < chordList.length; j++){ //iterate through possible chord changes
            if (chordList[j] !== lastChord){
              let c = lastChord + "-" + chordList[j]
              let count = sortedChordChangeList.indexOf(c)
              for (let k = 0; k < count; k++){
                moreSkewedChordList.push(chordList[j])
              }
            }
          }
        }

        randomChord = moreSkewedChordList[Math.floor(Math.random() * moreSkewedChordList.length)];
      } while(randomChord === lastChord);
      list.push(randomChord)
      lastChord = randomChord;
    }
    return list;
  }

  // Determine which type of chord sequence generation to use
  const generateChords = () => {
    // Use chord change data generation least 50 data points for each chord change
    let useChordChangeData = true
    let chordChangeList = []
    for (let i = 0; i < chordList.length; i++){
      for (let j = 0; j < chordList.length; j++){
        let c1 = chordList[i]
        let c2 = chordList[j]
        if (c1 !== c2){
          let c = c1 + "-" + c2
          chordChangeList.push(c)
          // if entry exists
          if (c in chordChangeData){
            if (chordChangeData[c].frequency<50){
              useChordChangeData = false
            }
          }
          // if there is no entry
          else {
            useChordChangeData = false
          }
        }
      }
    }
    if (useChordChangeData){
      return generateChordsUsingChordChangeData(chordChangeList)
    }

    // Use chord data generation least 50 data points for each chord change
    let useChordData = true
    for (let i = 0; i < chordList.length; i++){
      let c = chordList[i]
      // if entry exists
      if (c in chordData){
        if (chordData[c].frequency<50){
          useChordData = false
        }
      }
      // if there is no entry
      else {
        useChordData = false
      }
    }

    if (useChordData){
      console.log("hello using chord data")
      return generateChordsUsingChordData()
    }
    else{
      return generateChordsBasic()
    }
  }

  // Store the amount of times a chord appears and its average time ex. -> {Grock: {frequency: 50, avgTime: 4.022}, Am: {frequency: 30, avgTime:3.032}}
  const collectChordData = () => {

    const avgTime = time/24

    // Store the amount of times each chord appears in the past submition (24 total chords)
    let chordCount = {}
    for (let i = 0; i < chordSequence.length; i++){
      let c = chordSequence[i]
      
      // if entry exists
      if (c in chordCount){
        chordCount[c] += 1
      }
      // if there is no entry
      else {
        chordCount[c] = 1
      }
    }

    // Store into master database
    let tempChordData = {...chordData}
    for (const c in chordCount){
      // if entry exists
      if (c in chordData){
        const f = chordData[c].frequency
        const a = chordData[c].avgTime

        const totalFrequency = f + chordCount[c]
        const totalAvgTime = ((a*f)+(avgTime*chordCount[c]))/totalFrequency // finding mean, sum/n

        tempChordData[c] = {frequency:totalFrequency, avgTime:totalAvgTime}
      }
      // if there is no entry
      else {
        tempChordData[c] = {frequency: chordCount[c], avgTime: avgTime}
      }
    }
    setChordData(tempChordData)

  }

  // store the amount of times a chord change appears and its average time ex. -> {GrockAm: {frequency:50, avgTime:6.203},  AmEm: {frequency:40. avgTime:5.302}}
  const collectChordChangeData = () => {

    const avgTime = time/23

    // Store the amount of times each chord appears in the past submition (23 total chord changes)
    let chordCount = {}
    for (let i = 0; i < chordSequence.length-1; i++){
      let c = chordSequence[i] + "-" + chordSequence[i+1]
      
      // if entry exists
      if (c in chordCount){
        chordCount[c] += 1
      }
      // if there is no entry
      else {
        chordCount[c] = 1
      }
    }

    // Store into master database
    let tempChordChangeData = {...chordChangeData}
    for (const c in chordCount){
      // if entry exists
      if (c in chordChangeData){
        const f = chordChangeData[c].frequency
        const a = chordChangeData[c].avgTime

        const totalFrequency = f + chordCount[c]
        const totalAvgTime = ((a*f)+(avgTime*chordCount[c]))/totalFrequency // finding mean, sum/n

        tempChordChangeData[c] = {frequency:totalFrequency, avgTime:totalAvgTime}
      }
      // if there is no entry
      else {
        tempChordChangeData[c] = {frequency: chordCount[c], avgTime: avgTime}
      }
    }
    setChordChangeData(tempChordChangeData)

  }

  // Format time in milliseconds to 00:00 format (minutes:seconds or seconds:centiseconds)
  const formatTime = (t) => {
    //less than 1 minute
    if (t < 59999){
      const centiseconds = ("0" + (Math.floor(t / 10) % 100)).slice(-2);
      const seconds = ("0" + (Math.floor(t / 1000) % 60)).slice(-2);
      return `${seconds}:${centiseconds}`
    }
    //less than 100 minutes
    else if (t < 5999999) {
      const seconds = ("0" + (Math.floor(t / 1000) % 60)).slice(-2);
      const minutes = ("0" + (Math.floor(t / 60000) % 60)).slice(-2);
      return `${minutes}:${seconds}`
    }
    else {
      return "99:99"
    }
  }

  // Format time in milliseconds to 00:00:00 format
  const formatListTime = (t) => {
    const centiseconds = ("0" + (Math.floor(t / 10) % 100)).slice(-2);
    const seconds = ("0" + (Math.floor(t / 1000) % 60)).slice(-2);
    const minutes = ("0" + (Math.floor(t / 60000) % 60)).slice(-2);
    return `${minutes}:${seconds}:${centiseconds}`
  }

  // Handle list button
  const handleList = (event) =>{
    setAnchorList(event.currentTarget)
  }
  const handleListClose = () => {
    setAnchorList(null)
  }

  // Handle refresh button
  const handleRefresh = () =>{
    setChordSequence(generateChords())
  }

  // Handle settings button
  const handleSettings = (event) =>{
    setAnchorSettings(event.currentTarget)
  }
  const handleSettingsClose = () =>{
    setAnchorSettings(null)
  }

  // Handle timer button click
  const handleTimerClick = () => {
    //Start timer
    if (!timerOn){
      setTimerOn(true)
      const startTime = Date.now()
      setTimer(setInterval(()=>{
        const t = Date.now()-startTime
        setTime(t)
        setDisplayTime(formatTime(t))
      },10))
    }

    //Stop timer
    else {
      clearInterval(timer)
      setHistory([...history,time])
      collectChordData()
      collectChordChangeData()
      setAnalyze(true)

      setTimerOn(false)
      setChordSequence(generateChords())
    }
  }

  // Generate inital chord sequence
  if (chordSequence.length === 0){
    setChordSequence(generateChords())
  }
  
  // Calculations using time, chord, and chord change data
  if (analyze){
    // Used to display all times in order of most recent -> least recent
    setHistoryReverse([...history].reverse())

    // Analyze time data
    setMin(Math.min(...history))
    setMax(Math.max(...history))
    let sum = 0;
    for (let i = 0; i < history.length; i++){
      sum += history[i]
    }
    setAvg(sum/history.length)

    if (history.length >= 0){
      let sum5 = 0;
      for (let i = history.length-5; i < history.length; i++){
        sum5 += history[i]
      }
      setAvg5(sum5/5)
    }

    // Analyze chord data
    let ctemp = {name:"", value: 0, frequency:0}; // chord with the highest avgTime
    let csum = 0;
    let csumCounter = 0;
    for (const c in chordData){
      let a = chordData[c].avgTime
      if (a > ctemp.value){
        ctemp.name = c;
        ctemp.value = a;
        ctemp.frequency = chordData[c].frequency
      }
      csum += a
      csumCounter++;
    }
    setCmax(ctemp)
    let cavg = csum/csumCounter // average avgTime values for all chords
    setCper(((ctemp.value - cavg)/cavg)*100) // percentage slower the max is from the average

    // Analyze chord change data
    let cctemp = {name:"", value: 0, frequency:0}; // chord change with the highest avgTime
    let ccsum = 0;
    let ccsumCounter = 0;
    for (const c in chordChangeData){
      let a = chordChangeData[c].avgTime
      if (a > cctemp.value){
        cctemp.name = c;
        cctemp.value = a;
        cctemp.frequency = chordChangeData[c].frequency
      }
      ccsum += a
      ccsumCounter++;
    }
    setCcmax(cctemp)
    let ccavg = ccsum/ccsumCounter // average avgTime values for all chord changes
    setCcper(((cctemp.value - ccavg)/ccavg)*100) // percentage slower the max is from the average

    setAnalyze(false)
    setEmptyData(false)
    
  }

  return (
    <div style={{minWidth:"360px"}}>
      {/* Header */}
      <AppBar className={classes.topbar} position="sticky">
        <Toolbar>
          <Grid container direction="row" justify="space-between">
            {/* Logo and Title */}
            <Grid item>
              <Grid container direction="row" alignItems="center">
                <img src={logo} alt="" width="30px" height="30px" style={{marginRight:"1em"}}/>
                {!isPhone && (<Typography style={{fontFamily: "Bebas Neue", fontSize:"24px", letterSpacing:"2px"}}>Guitar Trainer</Typography>)}
              </Grid>
            </Grid>
            <Grid item>
              {/* Test/Developer button */}
              {/* <IconButton className={classes.topbarButtons} size="small" 
                onClick={()=>{
                  console.log("Chord Data", chordData)
                  console.log("Chord Change Data", chordChangeData)
                }} 
              /> */}
              {/* Delete */}
              {/* <IconButton className={classes.topbarButtons} size="small" onClick={handleDelete}><Delete /></IconButton> */}
              {/* Refresh */}
              <IconButton className={classes.topbarButtons} size="small" onClick={handleRefresh}><Refresh /></IconButton>
              {/* List */}
              <IconButton className={classes.topbarButtons} size="small" onClick={handleList}><ListIcon /></IconButton>
              <Popover 
                open={Boolean(anchorList)}
                anchorEl={anchorList} 
                onClose={handleListClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                style={{marginTop:"1em"}}
              >
                {(!emptyData &&
                (<Grid container direction="column" alignItems="center" style={{padding:"1em", width:"200px"}}>
                  <Typography className={classes.listTitle}>All Times:</Typography>
                  <List style={{maxHeight: '120px', overflow: 'auto', width:"100%"}}>
                    {historyReverse.map((v, index)=>
                    (<ListItem style={{padding:"0em"}}>
                      <Grid container direction="row" justify="space-evenly">
                        <Typography className={classes.listTitle}>{historyReverse.length-index}:</Typography>
                        <Typography className={classes.listBody}>{formatListTime(v)}</Typography>
                      </Grid>
                    </ListItem>))}
                  </List>
                  <Divider style={{width:"100%", margin:"0.25em 0em 0.25em 0em"}}/>
                  <Grid container direction="row" justify="space-evenly">
                    <Typography className={classes.listTitle}>Average of 5:</Typography>
                    <Typography className={classes.listBody}>{history.length >= 5 ? formatListTime(avg5) : "N/A"}</Typography>
                  </Grid>
                  <Grid container direction="row" justify="space-evenly">
                    <Typography className={classes.listTitle}>Best time:</Typography>
                    <Typography className={classes.listBody}>{formatListTime(min)}</Typography>
                  </Grid>
                  <Grid container direction="row" justify="space-evenly">
                    <Typography className={classes.listTitle}>Worst time:</Typography>
                    <Typography className={classes.listBody}>{formatListTime(max)}</Typography>
                  </Grid>
                  <Grid container direction="row" justify="space-evenly">
                    <Typography className={classes.listTitle}>Total Average:</Typography>
                    <Typography className={classes.listBody}>{formatListTime(avg)}</Typography>
                  </Grid>
                  <Grid container direction="row" justify="space-evenly">
                    <Typography className={classes.listTitle}>Amount of times:</Typography>
                    <Typography className={classes.listBody}>{history.length}</Typography>
                  </Grid>
                  <Divider style={{width:"100%", margin:"0.25em 0em 0.25em 0em"}}/>
                  <Typography className={classes.listBody}>
                    You should focus more on <span className={classes.listTitle}>{cmax.name}</span> it is <span className={classes.listTitle}>{cper.toFixed(2)}%</span> slower than your average (<span className={classes.listTitle}>{cmax.frequency}</span> data points)
                  </Typography>
                  <Typography className={classes.listBody}>
                    Your <span className={classes.listTitle}>{ccmax.name}</span> transition is slower than your average by <span className={classes.listTitle}>{ccper.toFixed(2)}%</span> (<span className={classes.listTitle}>{ccmax.frequency}</span> data points)
                  </Typography>

                </Grid>)) || 
                // No times
                (<Grid container direction="column" alignItems="center" style={{padding:"1em", width:"200px"}}>
                  <Typography className={classes.listTitle}>No times available, please submit at least one time</Typography>
                </Grid>)}
              </Popover>
              {/* Settings */}
              <IconButton className={classes.topbarButtons} size="small" onClick={handleSettings}><Settings /></IconButton>
              <Popover 
                open={Boolean(anchorSettings)}
                anchorEl={anchorSettings} 
                onClose={handleSettingsClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                style={{marginTop:"1em"}}
              >
                <Grid container style={{padding:"1em", width:"100%"}} justify="center">
                  {fullChordList.map((v, index)=>(<Chord mode="select" chordName={v} chordList={chordList} selectChord={selectChord} deselectChord={deselectChord} key={index}/>))}
                  <IconButton onClick={resetChordList}><Refresh /></IconButton>
                </Grid>
              </Popover>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      {/* Body */}
      <div className={classes.root}>
        <Container maxWidth="md">
          <Grid container style={{padding:"0em 2em 0em 2em"}} direction="column" alignItems="center">
            
            {/* Chord Sequence */}
            <Grid container direction="row">
              {chordSequence.map((v, index)=>(<Chord mode="display" chordName={v} index={index} selectedIndex={selectedIndex} isPortrait={isPortrait} isPhone={isPhone} selectDisplayChord={selectDisplayChord} key={index}/>))}
            </Grid>

            {/* Enlarged chord and timer desktop view */}
            {!isPhone && !isPortrait &&
              (<Grid container direction="row" alignItems="center">
                <Grid item sm={2}>
                  <img src={displayChord} alt="" width="100%"/>
                </Grid>
                <Grid item sm={10}>
                  <Grid container direction="row"justify="flex-end" alignItems="center" spacing={2}>
                    <Grid item>
                      <Typography className={classes.timer}>{displayTime}</Typography>
                    </Grid>
                    <Grid item>
                      <IconButton className={classes.timerButton} onClick={handleTimerClick}>
                        {(!timerOn && (<PlayArrow className={classes.timerButtonIcon}/>)) || (<Stop className={classes.timerButtonIcon}/>)}
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>)}

              {/* Enlarged chord and timer tablet view */}
              {!isPhone && isPortrait &&
              (<Grid container direction="row" alignItems="center" style={{marginTop:"2em"}}>
                <Grid item sm={4}>
                  <img src={displayChord} alt="" width="100%"/>
                </Grid>
                <Grid item sm={8}>
                  <Grid container direction="row"justify="flex-end" alignItems="center" spacing={2}>
                    <Grid item>
                      <Typography className={classes.timer}>{displayTime}</Typography>
                    </Grid>
                    <Grid item>
                      <IconButton className={classes.timerButton} onClick={handleTimerClick}>
                        {(!timerOn && (<PlayArrow className={classes.timerButtonIcon}/>)) || (<Stop className={classes.timerButtonIcon}/>)}
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>)}

              {/* Enlarged chord and timer mobile view */}
              {isPhone &&
              (<Grid container direction="column" alignItems="center" style={{marginTop:"1em"}}>
                {selectedIndex !== -1 && (<Grid item xs={5}>
                  <img src={displayChord} alt="" style={{width:"100%"}}/>
                </Grid>)}
                <Grid item>
                  <Grid container direction="row" alignItems="center" spacing={2}>
                    <Grid item>
                      <Typography className={classes.timer}>{displayTime}</Typography>
                    </Grid>
                    <Grid item>
                      <IconButton className={classes.timerButton} onClick={handleTimerClick}>
                        {(!timerOn && (<PlayArrow className={classes.timerButtonIcon}/>)) || (<Stop className={classes.timerButtonIcon}/>)}
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>)}

          </Grid>
        </Container>
      </div>
      
    </div>
  );
}

export default App;
