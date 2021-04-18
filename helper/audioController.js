import TrackPlayer from 'react-native-track-player';
import {EventRegister} from "react-native-event-listeners";

module.exports = async function() {

    TrackPlayer.addEventListener('remote-play', () => {
        EventRegister.emit('AudioExTrackCotroller',{type: 'remote-play'});
        // TrackPlayer.getCurrentTrack().then(res=>{
        //     if(res){
        //         EventRegister.emit('AudioExTrackCotroller',{type: 'remote-pause'});
        //     }
        // });
    })

    TrackPlayer.addEventListener('remote-pause', () => {
        EventRegister.emit('AudioExTrackCotroller',{type: 'remote-pause'});
        // TrackPlayer.getCurrentTrack().then(res=>{
        //     if(res){
        //         EventRegister.emit('AudioExTrackCotroller',{type: 'remote-pause'});
        //     }
        // });
    });

};