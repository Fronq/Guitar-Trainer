const styles = {
    root: {
        '@media screen and (min-width: 1280px)':{
            display:"flex",
            height:"calc(100vh - 64px)",
            alignItems: "center",
            justify: "center",
        },
        '@media screen and (max-width: 719px) and (max-aspect-ratio: 9/16)':{
            display:"flex",
            height:"calc(100vh - 64px)",
            alignItems: "center",
            justify: "center",
        }
    },
    topbar: {
        backgroundColor: "#2f3136",
        boxShadow: "none",
    },
    topbarButtons: {
        backgroundColor:"white", 
        color:"#2f3136", 
        marginLeft: "0.5em",
        '&:hover': {
            backgroundColor:"#c4c4c4"
        },
    },
    listTitle:{
        textAlign:"center",
        fontFamily:"Bebas Neue",
        color:"#2f3136", 
        fontSize:"16px",
        letterSpacing:"0.5px"
    },
    listBody:{
        textAlign:"center",
        fontFamily:"Bebas Neue",
        color:"#747474", 
        fontSize:"16px",
        letterSpacing:"0.5px"
    },
    listList:{
        textAlign:"center",
        fontFamily:"Bebas Neue",
        color:"#747474", 
        fontSize:"16px",
        letterSpacing:"0.5px",
        width:"100%",
    },
    chord: {
        //use this for displaying a larger chord preview in desktop mode only
        minWidth:"25px",
        '&:hover': {
            backgroundColor:"#28292d"
        }
    },
    chordSelect: {
        //use this for displaying a larger chord preview in desktop mode only
        minWidth:"25px",
        '&:hover': {
            backgroundColor:"#c4c4c4"
        }
    },
    timer: {
        fontFamily:"Bebas Neue",
        color: "white",
        fontSize:"195px",
        letterSpacing:"15px",
        '@media screen and (min-width: 1280px) and (orientation:portrait)':{
            fontSize:"140px",
            letterSpacing:"8px",
        },
        '@media screen and (max-width: 1279px)':{
            fontSize:"140px",
            letterSpacing:"8px",
        },
        '@media screen and (max-width: 719px)':{
            fontSize:"80px",
            letterSpacing:"5px",
        },
    },
    timerButton: {
        backgroundColor:"white",
        color:"#2f3136", 
        height:"128px", 
        width:"128px",
        '&:hover': {
            backgroundColor:"#c4c4c4"
        },
        '@media screen and (min-width: 1280px) and (orientation:portrait)':{
            height:"80px", 
            width:"80px"
        },
        '@media screen and (max-width: 1279px)':{
            height:"80px", 
            width:"80px"
        },
        '@media screen and (max-width: 719px)':{
            height:"64px", 
            width:"64px"
        },
    },
    timerButtonIcon: {
        fontSize:"80px",
        '@media screen and (min-width: 1280px) and (orientation:portrait)':{
            fontSize:"50px"
        },
        '@media screen and (max-width: 1279px)':{
            fontSize:"50px"
        },
        '@media screen and (max-width: 719px)':{
            fontSize:"40px"
        },
    }
}
export default styles