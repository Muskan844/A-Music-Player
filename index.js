let allMusic=[
    {
        name:"Mitwa",
        artist:"Shankar Mahadevan",
        imgs:"music-1",
        src:"music-1"
    },
    {
        name:"Jaadu Hai Nasha Hai",
        artist:"Shreya Ghosal",
        imgs:"music-2",
        src:"music-2"
    },
    {
        name:"Tera Hone Laga Hoon",
        artist:"Atif Aslam",
        imgs:"music-3",
        src:"music-3"
    },
    {
        name:"Akh Lad Jaave",
        artist:"Asees Kaur",
        imgs:"music-4",
        src:"music-4"
    },
    {
        name:"Attention",
        artist:"Charlie Puth",
        imgs:"music-5",
        src:"music-5"
    }
];

const wrapper=document.querySelector(".wrapper"),
musicName=wrapper.querySelector(".song-details .name"),
musicArtist=wrapper.querySelector(".song-details .artist"),
musicImg=wrapper.querySelector(".img-area img"),
mainAudio=wrapper.querySelector("#main-audio"),
playpausebtn=wrapper.querySelector(".play-pause"),
prevbtn=wrapper.querySelector("#prev"),
nextbtn=wrapper.querySelector("#next"),
progressarea=wrapper.querySelector(".progress-area"),
progressBar=progressarea.querySelector(".progress-bar"),
repeatBtn= wrapper.querySelector("#repeat"),
musicList= wrapper.querySelector(".music-list"),
moreMusicBtn= wrapper.querySelector("#more_songs"),
closeMoreMusic= musicList.querySelector("#close"),
ulTag=wrapper.querySelector("ul");

//load random music on page refresh
let musicIndex=Math.floor((Math.random()*allMusic.length)+1);

window.addEventListener("load", ()=>{
    loadmusic(musicIndex);
})

function loadmusic(indexnum){
    // musicArtist.innerText="kkM";
    musicName.innerText=allMusic[indexnum-1].name;
    musicArtist.innerText=allMusic[indexnum-1].artist;
    musicImg.src = `images/${allMusic[indexnum-1].imgs}.jpg`;
    mainAudio.src = `songs/${allMusic[indexnum-1].src}.mp3`;
    playingNow();
}
function pausemusic(){
    wrapper.classList.remove("paused");
    playpausebtn.querySelector("i").innerText="play_arrow"
    mainAudio.pause();
}
function playmusic(){
    wrapper.classList.add("paused");
    playpausebtn.querySelector("i").innerText="pause";
    mainAudio.play();
    
}
function nextmusic(){
    if(musicIndex==5){
        musicIndex=1;
    }else{
        musicIndex++;
    }
    loadmusic(musicIndex);
    playmusic();
}
function prevmusic(){
   if(musicIndex==1){
        musicIndex=5
   }else{
    musicIndex--;
   }
   loadmusic(musicIndex);
   playmusic();
}
playpausebtn.addEventListener("click",()=>{
   const isMusicPlayed= wrapper.classList.contains("paused");
    isMusicPlayed ? pausemusic() : playmusic();
})

prevbtn.addEventListener("click",()=>{
    prevmusic();
})

nextbtn.addEventListener("click",()=>{
    nextmusic();
})

//update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e)=>{
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;

    let progressWidth=(currentTime/duration)*100;
    progressBar.style.width=`${progressWidth}%`;

    let musicCurrentTime=wrapper.querySelector(".current-time"),
    musicDuration= wrapper.querySelector(".max-duration");

    mainAudio.addEventListener("loadeddata",()=>{
      
     //update music total duration  
       let audioDuration=mainAudio.duration;
       let totalMin= Math.floor(audioDuration/60);
       let totalSec=Math.floor(audioDuration%60);
       if(totalSec<10){
          totalSec=`0${totalSec}`;
       }
       musicDuration.innerText=`${totalMin}:${totalSec}`;
    })

     //update music current time
     let currentMin = Math.floor(currentTime/60);
     let currentSec = Math.floor(currentTime%60);
       if(currentSec<10){
        currentSec=`0${currentSec}`;
       }
       musicCurrentTime.innerText=`${currentMin}:${currentSec}`;
})
    //update song according to clicked width of progress bar 
    
progressarea.addEventListener("click",(e)=>{
    let progresswidthVal= progressarea.clientWidth;// getting width of an progress-bar
    let clickedOffset = e.offsetX; //getting current position or offset x value
    let songDuration = mainAudio.duration;
     
    mainAudio.currentTime=(clickedOffset/progresswidthVal) * songDuration; //currentTime and duration are in-built properties 
    playmusic();
})

//repeat or shuffle music
repeatBtn.addEventListener("click", ()=>{
   let getText= repeatBtn.innerText;
   switch(getText){
    case "repeat":
        repeatBtn.innerText= "repeat_one";
        repeatBtn.setAttribute("title","Song looped");
        
        break;
    case "repeat_one":
        repeatBtn.innerText= "shuffle";
        repeatBtn.setAttribute("title", "Playback Shuffle");

        break;
    case "shuffle":
        repeatBtn.innerText= "repeat";
        repeatBtn.setAttribute("title","Playlist looped")

        break;
   }
})
//after the song has ended, song to be played according to repeat icon
  mainAudio.addEventListener("ended",()=>{
    let getText= repeatBtn.innerText;
   switch(getText){
    case "repeat":
        nextmusic();
        break;

    case "repeat_one":
        mainAudio.currentTime=0;
        playmusic();
        break;

    case "shuffle":
        let randIndex;
        do{
            randIndex = Math.floor((Math.random()* allMusic.length) + 1);
        }while(musicIndex == randIndex);
        
        musicIndex = randIndex;
        loadmusic(musicIndex);
        playmusic();
        break;
   }
  });

  //show music list on clicking moreMusicBtn
  moreMusicBtn.addEventListener("click",()=>{
    musicList.classList.toggle("show");
  });
   
  closeMoreMusic.addEventListener("click", ()=>{
    musicList.classList.remove("show");
  });

  //create li tag in musiclist according to array length 
  for(let i=0; i<allMusic.length; i++){
    let liTag=`<li li-index="${i+1}">
                    <div class="row">
                    <span>${allMusic[i].name}</span>
                    <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration">3:10</span>
                     </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioTag=ulTag.querySelector(`.${allMusic[i].src}`);
    let liAudioDuration=ulTag.querySelector(`#${allMusic[i].src}`);

    //updating total time of song in music list
    liAudioTag.addEventListener("loadeddata",()=>{ //loadeddata event is used to get audio total duration without playing it.
        let audioDuration=liAudioTag.duration;
        let totalMin= Math.floor(audioDuration/60);
        let totalSec=Math.floor(audioDuration%60);
        if(totalSec<10){
           totalSec=`0${totalSec}`;
        }
        liAudioDuration.innerText=`${totalMin}:${totalSec}`;
        //adding t-duration attribute which is used below
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
  }

  //play particular song on click in musiclist
  const allLiTags=ulTag.querySelectorAll("li");
  function playingNow(){
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        //removing playing class from all other li except the last one which is clicked
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            //getting audio duration value and pass to .audio-duration innertext
            let addDuration= audioTag.getAttribute("t-duration");
            audioTag.innerText= addDuration;
        }
        //using li-index,
        //if there is an li tag of which li-index == musicIndex,
        //then this music is playing
        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText= "Playing";
        }
        //adding onclick attribute attribute in all Li tags
        allLiTags[j].setAttribute("onclick","clicked(this)"); 
      }
  }

  //play song on li click
  function clicked(element){
    let getLiIndex= element.getAttribute("li-index");
    musicIndex=getLiIndex;
    loadmusic(musicIndex);
    playmusic();
    playingNow();
  }



