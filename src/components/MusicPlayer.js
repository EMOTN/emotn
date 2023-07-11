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
    };

    const handleGenreClick = (genre) => {
        setGenre(genre);
        setSubgenre('');
        setAudioFile('');
    };
    
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
  };

    if(option) {
        return (
            <div>
                <h2>What would you like to listen to?</h2>
                <button onClick={() => handleGenreClick('classical')}
                style={{ backgroundColor: genre === 'classical' ? '#556b2f' : '' }}> Classical </button>
                <button onClick={() => handleGenreClick('nature')}
                style={{ backgroundColor: genre === 'nature' ? '#556b2f' : '' }}> Nature </button>
                <button onClick={() => handleGenreClick('instrumental')}
                style={{ backgroundColor: genre === 'instrumental' ? '#556b2f' : '' }}> Instrumental </button>
                <button onClick={() => handleGenreClick('ambient/ethereal')}
                style={{ backgroundColor: genre === 'ambient/ethereal' ? '#556b2f' : '' }}> Ambient/Ethereal </button>
                <button onClick={() => handleGenreClick('background noise')}
                style={{ backgroundColor: genre === 'background noise' ? '#556b2f' : '' }}> Background Noise </button>
                {genre && (
                    <div>
                        {genre === 'classical' && (
                            <div>
                            <button onClick={() => handleSubgenreClick('subgenre1')}>S</button>
                            <button onClick={() => handleSubgenreClick('subgenre2')}>Sub-Genre 2</button>
                            <button onClick={() => handleSubgenreClick('subgenre1')}>Sub-Genre 1</button>
                            <button onClick={() => handleSubgenreClick('subgenre2')}>Sub-Genre 2</button>
                            </div>
                        )}
                        {genre === 'nature' && (
                            <div>
                            <button onClick={() => handleSubgenreClick('beach')}>Beach</button>
                            <button onClick={() => handleSubgenreClick('thunderstorm')}>Thunderstorm</button>
                            <button onClick={() => handleSubgenreClick('birds')}>Bird Songs</button>
                            <button onClick={() => handleSubgenreClick('campfire')}>Campfire</button>
                            </div>
                        )}
                        {genre === 'instrumental' && (
                            <div>
                            <button onClick={() => handleSubgenreClick('subgenre1')}>Sub-Genre 1</button>
                            <button onClick={() => handleSubgenreClick('subgenre2')}>Sub-Genre 2</button>
                            <button onClick={() => handleSubgenreClick('subgenre1')}>Sub-Genre 1</button>
                            <button onClick={() => handleSubgenreClick('subgenre2')}>Sub-Genre 2</button>
                            </div>
                        )}
                        {genre === 'ambient/ethereal' && (
                            <div>
                            <button onClick={() => handleSubgenreClick('subgenre1')}>Sub-Genre 1</button>
                            <button onClick={() => handleSubgenreClick('subgenre2')}>Sub-Genre 2</button>
                            <button onClick={() => handleSubgenreClick('subgenre1')}>Sub-Genre 1</button>
                            <button onClick={() => handleSubgenreClick('subgenre2')}>Sub-Genre 2</button>
                            </div>
                        )}
                        {genre === 'background noise' && (
                            <div>
                            <button onClick={() => handleSubgenreClick('subgenre1')}>Sub-Genre 1</button>
                            <button onClick={() => handleSubgenreClick('subgenre2')}>Sub-Genre 2</button>
                            <button onClick={() => handleSubgenreClick('subgenre1')}>Sub-Genre 1</button>
                            <button onClick={() => handleSubgenreClick('subgenre2')}>Sub-Genre 2</button>
                            </div>
                        )}
                    </div>
                )}
                {subgenre && (
                    <div>
                       <AudioPlayer
                            autoPlay
                            loop // Set the loop prop to true to play the audio on a loop
                            src={audioFile}
                        />
                    </div>
                )}
            </div>
        )
    }

    return (
        <div>
            <button onClick={handleMusicChoice} > ▶️ 🎧 Soundtrack your journaling 🎧 ▶️</button>
        </div>
    )
}

export default MusicPlayer; 