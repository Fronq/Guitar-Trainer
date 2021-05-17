import {Typography, Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import chords from './chords/index.js'

import styles from './styles'
const useStyles = makeStyles(styles);

const Chord = ({mode,chordName,index, selectedIndex, isPortrait, isPhone, selectDisplayChord, chordList, selectChord, deselectChord}) => {
    const classes = useStyles()
    
    // Chords to be used when displaying the chord sequence
    if (mode === "display"){
        const handleClick = () =>{
            if (index === selectedIndex){
                selectDisplayChord("blank",-1)
            }
            else{
                selectDisplayChord(chordName, index)
            }      
        }
    
        const bgColor = index === selectedIndex ? {backgroundColor:"#28292d"} : {}
    
        // 4 rows of 6 columns for phone and tablet view
        if (isPortrait || isPhone){
            return(
                <Grid item xs={2}>
                    <Button className={classes.chord} onClick={handleClick} style={bgColor}>
                        <Grid container direction="column" alignItems="center">
                            <Typography style={{fontFamily:"Bebas Neue", color: "#747474", fontSize:"14px"}}>{chordName}</Typography>
                            <img src={chords[chordName]} alt="" style={{width: "100%"}}/>
                        </Grid>
                    </Button>
                </Grid>
            )
        }
    
        // 2 rows of 12 columns for desktop view
        return (
            <Grid item xs={1}>
                <Button className={classes.chord} onClick={handleClick} style={bgColor}>
                    <Grid container direction="column" alignItems="center">
                        <Typography style={{fontFamily:"Bebas Neue", color: "#747474", fontSize:"16px"}}>{chordName}</Typography>
                        <img src={chords[chordName]} alt="" style={{width: "100%"}}/>
                    </Grid>
                </Button>
            </Grid>
        )
    }

    // Chords to be shown in the settings
    else if (mode === "select"){
        const handleClick = () =>{
            if (chordList.includes(chordName) && chordList.length > 2){
                deselectChord(chordName)
            }
            else{
                selectChord(chordName)
            }      
        }

        const bgColor = chordList.includes(chordName) ? {backgroundColor:"#c4c4c4"} : {}

        return(
            <Grid item>
                <Button className={classes.chordSelect} onClick={handleClick} style={bgColor}>
                    <Grid container direction="column" alignItems="center">
                        <Typography style={{fontFamily:"Bebas Neue", color: "#747474", fontSize:"14px"}}>{chordName}</Typography>
                        <img src={chords[chordName]} alt="" style={{width: "50px"}}/>
                    </Grid>
                </Button>
            </Grid>
        )
    }
}

export default Chord

