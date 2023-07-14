import { useState, useRef } from 'react';
// import { storage } from "../config/firebase";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const MusicPlayer = () => {
    const [ option, setOption ] = useState(false)
    const [ genre, setGenre ] = useState('');
    const [ subgenre, setSubgenre ] = useState('');
    const [ audioFile, setAudioFile ] = useState('');

    const audioRef = useRef(null);

    const handleMusicChoice = () => {
        setOption(true)
        setTimeout (() => {
        const soundtrack = document.getElementById('soundtrack');
            if (soundtrack) {
            soundtrack.scrollIntoView({ behavior: 'smooth' });
        };
    }, 0)
    }

    const handleGenreClick = (genre) => {
        setGenre(genre);
        setSubgenre('');
        setAudioFile('');
        setTimeout(() => {
            const genreList = document.getElementById('genreList');
            if (genreList) {
              genreList.scrollIntoView({ behavior: 'smooth' });
            }
        }, 0);
    }
    
    const handleSubgenreClick = async (subgenre) => {
        setSubgenre(subgenre);

        const storage = getStorage();
        const musicFileRef = ref(storage, `gs://fir-7334a.appspot.com/Journaling Music/${subgenre}.mp3`);
        const downloadURL = await getDownloadURL(musicFileRef);

        setAudioFile(downloadURL);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.load();
          audioRef.current.play();
        }
        const musicPlayer = document.getElementById('musicPlayer');
            if (musicPlayer) {
            musicPlayer.scrollIntoView({ behavior: 'smooth' });
}
  };

    if(option) {
        return (
            <div id='soundtrack' style={{ textAlign: 'center', marginBottom: "7em" }}>
                <h2>What would you like to listen to?</h2>
                <button onClick={() => handleGenreClick('classical')}
                style={{ backgroundColor: genre === 'classical' ? '#F5A65B' : '' }}> Classical </button>
                <button onClick={() => handleGenreClick('nature')}
                style={{ backgroundColor: genre === 'nature' ? '#F5A65B' : '' }}> Nature </button>
                <button onClick={() => handleGenreClick('instrumental')}
                style={{ backgroundColor: genre === 'instrumental' ? '#F5A65B' : '' }}> Instrumental </button>
                <button onClick={() => handleGenreClick('ambient/ethereal')}
                style={{ backgroundColor: genre === 'ambient/ethereal' ? '#F5A65B' : '' }}> Ambient/Ethereal </button>
                <button onClick={() => handleGenreClick('background noise')}
                style={{ backgroundColor: genre === 'background noise' ? '#F5A65B' : '' }}> Background Noise </button>
                {genre && (
                    <div id='genreList' style={{ marginTop: '1rem' }} >
                        {genre === 'classical' && (
                            <div>
                            <button onClick={() => handleSubgenreClick('baroque')}>Baroque</button>
                            <button onClick={() => handleSubgenreClick('romantic')}>Romantic</button>
                            <button onClick={() => handleSubgenreClick('renaissance')}>Renaissance</button>
                            <button onClick={() => handleSubgenreClick('chamber')}>Chamber</button>
                            <button onClick={() => handleSubgenreClick('modern')}>Modern</button>
                            </div>
                        )}
                        {genre === 'nature' && (
                            <div>
                            <button onClick={() => handleSubgenreClick('beach')}>Beach</button>
                            <button onClick={() => handleSubgenreClick('thunderstorm')}>Thunderstorm</button>
                            <button onClick={() => handleSubgenreClick('birds')}>Bird Songs</button>
                            <button onClick={() => handleSubgenreClick('campfire')}>Campfire</button>
                            <button onClick={() => handleSubgenreClick('desert night')}>Desert Night</button>
                            </div>
                        )}
                        {genre === 'instrumental' && (
                            <div>
                            <button onClick={() => handleSubgenreClick('jazz')}>Jazz</button>
                            <button onClick={() => handleSubgenreClick('folk guitar')}>Folk Guitar</button>
                            <button onClick={() => handleSubgenreClick('lounge')}>Lounge</button>
                            <button onClick={() => handleSubgenreClick('reggae')}>Reggae</button>
                            <button onClick={() => handleSubgenreClick('soft electronic')}>Soft Electronic</button>
                            <button onClick={() => handleSubgenreClick('upbeat synth')}>Upbeat Synth</button>
                            </div>
                        )}
                        {genre === 'ambient/ethereal' && (
                            <div>
                            <button onClick={() => handleSubgenreClick('new age')}>New Age</button>
                            <button onClick={() => handleSubgenreClick('zen')}>Zen</button>
                            <button onClick={() => handleSubgenreClick('binaural')}>Binaural Vibrations</button>
                            <button onClick={() => handleSubgenreClick('minimalist')}>Minimalist</button>
                            <button onClick={() => handleSubgenreClick('drone')}>Drone</button>
                            </div>
                        )}
                        {genre === 'background noise' && (
                            <div>
                            <button onClick={() => handleSubgenreClick('airplane')}>Airplane</button>
                            <button onClick={() => handleSubgenreClick('train cabin')}>Train Cabin</button>
                            <button onClick={() => handleSubgenreClick('wind chimes')}>Wind Chimes</button>
                            <button onClick={() => handleSubgenreClick('white noise')}>White Noise</button>
                            <button onClick={() => handleSubgenreClick('brown noise')}>Brown Noise</button>
                            </div>
                        )}
                    </div>
                )}
                {subgenre && (
                    <div id='musicPlayer' style={{ margin: '1rem', borderRadius: '10px', overflow: 'hidden' }}>
                       <AudioPlayer
                            autoPlay
                            loop 
                            src={audioFile}
                        />
                    </div>
                )}
            </div>
        )
    }

    return (
        <div style={{ marginBottom: '10rem'}}>
            <button onClick={handleMusicChoice} > ▶️ 🎧 Soundtrack your journaling 🎧 ▶️</button>
        </div>
    )
}


export default MusicPlayer; 