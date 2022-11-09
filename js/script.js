//select required tags or elements
const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");


let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

//first action when screen open
window.addEventListener("load", ()=>{
    loadMusic(musicIndex);
    playingSong();
});

//load music function
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].src}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

//play music function
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

//pause music function
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow"; /*muda icon ai click*/
    mainAudio.pause();
}

//next music function
function nextMusic(){
    //plus index by 1
    musicIndex++;
    //limit music index by last music
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex;
    //reload
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

//prev music function
function prevMusic(){
    //minor index by 1
    musicIndex--;
    //limit music index by first music
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex;
    //reload
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

//events//
//play or pause music button event
playPauseBtn.addEventListener("click", ()=>{
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
    playingSong();
})

//next music btn event
nextBtn.addEventListener("click", ()=>{
    nextMusic();
})

//prev music btn event
prevBtn.addEventListener("click", ()=>{
    prevMusic();
})

//update progress bar by time
mainAudio.addEventListener("timeupdate", (e)=>{  
    //(e) -> to use e.target of mainAudio
    const currentTime = e.target.currentTime; 
    //get current time of song
    const duration = e.target.duration; 
    //get total duration of song
    let progressWidth = (currentTime / duration) * 100; 
    //defines progress percentage width
    progressBar.style.width = `${progressWidth}%`; 
    //"progressWidth"%
    let musicCurrentTime =  wrapper.querySelector(".current"),
    musicDuration =  wrapper.querySelector(".duration");
    //get current and total
    
    mainAudio.addEventListener("loadeddata", ()=>{
        //update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60); //to min
        let totalSec = Math.floor(audioDuration % 60); //to sec
        if(totalSec < 10){
            //begins with '0' if less than '10'
            totalSec = `0${totalSec}`;}
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

        //update playing song current time
        let currentMin = Math.floor(currentTime / 60); //extracts min
        let currentSec = Math.floor(currentTime % 60); //extracts sec
        if(currentSec < 10){
            //begins with '0' if less than '10'
            currentSec = `0${currentSec}`;}
        musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//update time according progress bar width
progressArea.addEventListener("click", (e)=>{
    //get width of progress bar
    let progressWidthval = progressArea.clientWidth; 
    //get offset x value clicked axis
    let clickedOffSetX = e.offsetX; 
    //get total duration
    let songDuration = mainAudio.duration; 
    //calc for progress-bar timer
    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
    //when paused, so plays
    playMusic();
    playingSong();
});

//repeat, repeat-one, shuffle
const repeatBtn = wrapper.querySelector("#repeat-plist");
//icon changer
repeatBtn.addEventListener("click", ()=>{
    let getText = repeatBtn.innerText; //get innerText icon
    //turn btn at click event
    switch(getText){
        case "repeat": //in "repeat" case turn to
        repeatBtn.innerText = "repeat_one";
        repeatBtn.setAttribute("title", "Song looped");
        break;
        case "repeat_one": //in "---" case
        repeatBtn.innerText = "shuffle";
        repeatBtn.setAttribute("title", "Playback shuffle");
        break;
        case "shuffle": //in "---" case
        repeatBtn.innerText = "repeat";
        repeatBtn.setAttribute("title", "Playlist looped");
        break;
    }
});

mainAudio.addEventListener("ended", ()=>{
    let getText = repeatBtn.innerText;
    switch(getText){
        case "repeat": //in "repeat" case turn to
        nextMusic();
        break;
        case "repeat_one": //in "---" case
        //resets song when ended
        mainAudio.currentTime = 0;
        loadMusic(musicIndex);
        playMusic();
        break;
        case "shuffle": //in "---" case
        //generate random indexs
        let randIndex = Math.floor((Math.random() *  allMusic.length)+1);
        do {
            randIndex = Math.floor((Math.random() *  allMusic.length)+1);
        } while (musicIndex == randIndex);
        //plays random songs
        musicIndex = randIndex;
        loadMusic(musicIndex);
        playMusic();
        playingSong();
        break;
    }
});

showMoreBtn.addEventListener("click", ()=>{
    //adding css-class 'show' to musicList OR removing if already there
    musicList.classList.toggle("show"); 
});

hideMusicBtn.addEventListener("click", ()=>{
    showMoreBtn.click(); //calls click event for toggle class, so closing
});

//add li to html by number of songs (submenu)
const ulTag = wrapper.querySelector("ul"); //select music list
for (let index = 0; index < allMusic.length; index++) {
    let liTag = //index+1 to match array
        `<li li-index="${index+1}">
            <div class="row">
                <span>${allMusic[index].name}</span>
                <p>${allMusic[index].artist}</p>
            </div>
            <audio class="${allMusic[index].src}" id="songs/${allMusic[index].src}" src="songs/${allMusic[index].src}.mp3"></audio>
            <span id="${allMusic[index].src}" class="audio-duration">0:00</span>
        </li>`; //html to add
    ulTag.insertAdjacentHTML("beforeend", liTag); //beforend style
    let liAudioDuration = ulTag.querySelector(`#${allMusic[index].src}`);//get span tags
    let liAudioTag = ulTag.querySelector(`.${allMusic[index].src}`);//get <audio>
    
    liAudioTag.addEventListener("loadeddata", ()=>{
        let audioDuration =  liAudioTag.duration; //get duration attribute from <audio>
        let totalMin = Math.floor(audioDuration / 60);//calc to min
        let totalSec = Math.floor(audioDuration % 60);//calc to sec
        if(totalSec<10){
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`; //add time to span inner
        //add song duration to new attribute
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    })
}

//features to particular song on musiclist click (playing status)
function playingSong(){
    const allLiTags = ulTag.querySelectorAll("li");

    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        //remove playing if already there
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            //redefine innertext to time duration like before using attribute already defined
            let adDuration = audioTag.getAttribute("t-duration"); //get value
            audioTag.innerText = adDuration;//define value
        }
        //add 'playing' class to current queue song
        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }
        //set onclick atribute in all li tags to becomes clickable (haven't for default)
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}

function clicked(element){ //"clicked(this)"
    //get li index of particular clicked li tag
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}
