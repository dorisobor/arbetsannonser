const latestJobs = document.getElementById("latest-jobs");
const allJobs = document.getElementById("all-jobs");
const latestTenJobs = document.getElementById("latest-jobs");

const mainView = document.getElementById('main-view');
const singleJobView = document.getElementById('single-job-view');

fetchStockholmJobs();

function fetchStockholmJobs() {
  fetch("http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?lanid=1&sida=1&antalrader=20")
    .then((response) => response.json())
    .then((jobs) => {
      displayJob(jobs)
      sortAllJobs(jobs)
    })
    .catch((error) => {
      console.log(error)
    });
}

function fetchJobDetails(id) {
  fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/${id}`)
    .then(response => response.json())
    .then(jobs => displayJobDetails(jobs))
    .catch((error) => {
      console.log(error)
    });
}

/* The 10 latest jobs */

function sortAllJobs(jobs){
const jobAdverts = jobs.matchningslista.matchningdata;
    
    jobAdverts.sort(function(a, b){
        var x = a.publiceraddatum;
        var y = b.publiceraddatum;
        if (x < y) {return 1;}
        if (x > y) {return -1;}
        return 0;
    });
    
    displayTenLatestJobs(jobs);
    
    function displayTenLatestJobs(jobs) {
  
   let publishedJobList = `
    <table>
        <tr>
        <th>Titel</th>
        <th>Yrkesbenämning</th>
        <th>Arbetsplats</th>
        <th>Anställningstyp</th>
        <th>Kommun</th>
        <th>Jobblänk</th> 
        <th>Sista ansökningsdatum</th> 
    </tr>
    `;
    for(const jobAdvert of jobAdverts.slice(0,10)){
  
 	 publishedJobList += `     
        <tr>
        <td>
         ${jobAdvert.annonsrubrik}
         </td>
        <td>${jobAdvert.yrkesbenamning} </td>
        <td>${jobAdvert.arbetsplatsnamn} </td>
        <td>${jobAdvert.anstallningstyp} </td>
        <td>${jobAdvert.kommunnamn}</td>
        <td><a href="${jobAdvert.annonsurl}">Gå till annonsen</a> </td> 
        <td>${jobAdvert.sista_ansokningsdag} </td> 
        </tr>
        `;
    }
        publishedJobList += "</table>";
    latestTenJobs.innerHTML = publishedJobList;

  }
}
/* All jobs part */

function displayJob(jobs) {
  const job = jobs.matchningslista.matchningdata;
  let allJobList = `
    <table>
    <tr>
        <th>Titel</th>
        <th>Yrkesbenämning</th>
        <th>Arbetsplats</th>
        <th>Anställningstyp</th>
        <th>Kommun</th>
        <th>Jobblänk</th> 
        <th>Sista ansökningsdatum</th> 
    </tr>
`;


  for (let i = 0; i < job.length; i++) {

    allJobList += ` 
        <tr>
            <td>
             ${job[i].annonsrubrik}
             </td>
            <td>${job[i].yrkesbenamning} </td>
            <td>${job[i].arbetsplatsnamn} </td>
            <td>${job[i].anstallningstyp} </td>
            <td>${job[i].kommunnamn}</td>
            <td><a href="${job[i].annonsurl}">Gå till annonsen</a> </td> 
            <td>${job[i].sista_ansokningsdag} </td> 
        </tr>
 `;

  }
    allJobList += "</table>";
  allJobs.innerHTML = allJobList;
  hej();
}

function hej(jobs) {
  var moreInfo = document.getElementsByClassName('moreInfo');

  for (let more of moreInfo) {
    more.addEventListener('click', function () {
      fetchJobDetails(this.dataset.id);
      singleJobView.classList.remove("hidden");
      mainView.classList.add("hidden");
    });
  }
}

function displayJobDetails(jobs) {
    let annonsDetaljer = "";
    job = jobs.platsannons.annons;
    conditions = jobs.platsannons.villkor;
    apply = jobs.platsannons.ansokan;
    workplace = jobs.platsannons.arbetsplats;

    /* following values will return undefined if value is empty: 
    conditions.tilltrade
    apply.epostadress */

    annonsDetaljer += `
            <h2>${job.annonsrubrik}</h2>
            <p>Sökes: ${job.yrkesbenamning}</p>
            <p>Anställningstyp: ${job.anstallningstyp}</p>

            <p>Varaktighet: ${conditions.varaktighet}</p>
            <p>Arbetstid: ${conditions.arbetstid}</p>
            <p>Tillträde: ${conditions.tilltrade}</p> 
            <p>Lönetyp: ${conditions.lonetyp}</p>
            <p>Löneform: ${conditions.loneform}</p>

            <p>webbplats: ${apply.webbplats}</p>
            <p>epostadress: ${apply.epostadress}</p>
            <p>sista ansökning: ${apply.sista_ansokningsdag}</p>
            <p>övrigt: ${apply.ovrigt_om_ansokan}</p>

            <p>arbetsplats: ${workplace.arbetsplatsnamn}</p>
            <p>adress: ${workplace.postadress}</p>
            <p>besöksadress: ${workplace.besoksadress}</p>
            <p>arbetsplats: ${workplace.arbetsplatsnamn}</p>

            <p>${job.annonstext}</p>

            <button data-id="${jobs.platsannons.annons.annonsid}" id="saveWorkAdButton" name="${jobs.platsannons.annons.annonsrubrik}">Save</button>

        `;

    document.getElementById("annonsdetaljer").innerHTML = annonsDetaljer;

    const backToListButton = document.getElementById("back");

    backToListButton.addEventListener('click', function(){
       mainView.classList.remove("hidden");
       singleJobView.classList.add("hidden");
    });

    const shareUrlButton = document.getElementById("share-url-button");
    const urlDropdown = document.getElementById("url-dropdown");

    shareUrlButton.addEventListener('click', function(){
        if(urlDropdown.classList.contains("hidden")){
            urlDropdown.classList.remove("hidden")
        }
        else {
            urlDropdown.classList.add("hidden");
        }
    });

    adUrl = document.getElementById('ad-url');
    adUrl.innerHTML = job.platsannonsUrl;
    adUrl.href = job.platsannonsUrl;
    adUrl.target = "_blank";
    urlDropdown.appendChild(adUrl);

  let saveWorkAdButton = document.getElementById('saveWorkAdButton')

  saveWorkAdButton.addEventListener('click', function () {
    var workingAd = {
      title: this.name,
      id: this.dataset.id
    };
    saveWorkingAd(workingAd);
  });
}

/* Save Working Ad */
let arrayOfSavedWorkingAd = []

function saveWorkingAd(workAd) {
  arrayOfSavedWorkingAd.push(workAd);
  displaySavedWorkAds()
  scroll(0, 0)
  saveWorkingAdToLocalStorage();
}

function saveWorkingAdToLocalStorage() {
  let str = JSON.stringify(arrayOfSavedWorkingAd);
  localStorage.setItem("arrayOfSavedWorkingAd", str);
}

function getWorkingAdArrayFromLocalStorage() {
  let array = localStorage.getItem("arrayOfSavedWorkingAd");
  arrayOfSavedWorkingAd = JSON.parse(array);
  if (!arrayOfSavedWorkingAd) {
    arrayOfSavedWorkingAd = [];
  }
}

function displaySavedWorkAds() {
  let savedWorkAdOutput = document.getElementById('saved-work-ad-output');
  let savedWorkAd = "<h3>Sparade annonser</h3>";

  for (let i = 0; i < arrayOfSavedWorkingAd.length; i++) {
    savedWorkAd += `
    <p data-id="${arrayOfSavedWorkingAd[i].id}" class="showSavedWorkAd">${arrayOfSavedWorkingAd[i].title}</p>
`;
  }
  savedWorkAdOutput.innerHTML = savedWorkAd;

addEventlistenerToSavedWorkAdTitle(); 
}

function addEventlistenerToSavedWorkAdTitle(){
    let showSavedWorkAds = document.getElementsByClassName('showSavedWorkAd');
        for (let showSavedWorkAd of showSavedWorkAds) {
            showSavedWorkAd.addEventListener('click', function(){
            fetchJobDetails(this.dataset.id);
            singleJobView.classList.remove("hidden");
            mainView.classList.add("hidden");
        })
    }
}

document.getElementById('clear').addEventListener('click', clearLocalStorage);
function clearLocalStorage() {
  localStorage.clear();
  location.reload();
  return false;
}

getWorkingAdArrayFromLocalStorage();
displaySavedWorkAds();