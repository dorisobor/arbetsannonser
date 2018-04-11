const latestJobs = document.getElementById("latest-jobs");
const allJobs = document.getElementById("all-jobs");
const latestTenJobs = document.getElementById("latest-jobs");



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


function sortAllJobs(jobs) {
  const jobAdverts = jobs.matchningslista.matchningdata;

  jobAdverts.sort(function (a, b) {
    var x = a.publiceraddatum;
    var y = b.publiceraddatum;
    if (x < y) {
      return 1;
    }
    if (x > y) {
      return -1;
    }
    return 0;
  });

  displayTenLatestJobs(jobs);

  function displayTenLatestJobs(jobs) {



    let publishedJobList = "";
    for (const jobAdvert of jobAdverts.slice(0, 10)) {

      publishedJobList += `
                <table>
                <tr>
                <th>Titel</th>
                <th><p>Kommun</th>
                <th><p>Publicerad</th>    
                </tr>
                <tr>
                <td>${jobAdvert.annonsrubrik}</td>
                <td>${jobAdvert.kommunnamn}</td>
                <td>${jobAdvert.publiceraddatum} </td> 
                </tr>
                </table>
        `;

    }
    latestTenJobs.innerHTML = publishedJobList;

  }
}
/* All jobs part */

function displayJob(jobs) {
  const job = jobs.matchningslista.matchningdata;
  let allJobList = "";



  for (let i = 0; i < job.length; i++) {

    allJobList += `<table>

<tr>
<th>Titel</th>
<th><p>Kommun</th>
<th><p>Publicerad</th>    
</tr>
<tr>
<td>${job[i].annonsrubrik}</td>
<td>${job[i].kommunnamn}</td>
<td>${job[i].sista_ansokningsdag} </td> 
<td><button class="moreInfo" data-id="${job[i].annonsid}">läs mer</button></td>
</tr>
</table> `;

  }
  allJobs.innerHTML = allJobList;
  hej();
}

function hej(jobs) {
  var moreInfo = document.getElementsByClassName('moreInfo');

  for (let more of moreInfo) {
    more.addEventListener('click', function () {
      fetchJobDetails(this.dataset.id);
    });
  }
}


function displayJobDetails(jobs) {
  // const job = jobs.platsannons.annons;
  let annonsText = "";

  annonsText += `
            <p>${jobs.platsannons.annons.annonstext}</p>
            <button data-id="${jobs.platsannons.annons.annonsid}" id="saveWorkAdButton" name="${jobs.platsannons.annons.annonsrubrik}">Save</button>
        `;

  document.getElementById("single-job").innerHTML = annonsText;

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

getWorkingAdArrayFromLocalStorage();
displaySavedWorkAds()

function displaySavedWorkAds() {
  let savedWorkAdOutput = document.getElementById('saved-work-ad-output');
  let savedWorkAd = "<h3>Sparade annonser</h3>";

  for (let i = 0; i < arrayOfSavedWorkingAd.length; i++) {
    savedWorkAd += `
    <p>${arrayOfSavedWorkingAd[i].title}</p>
    <p>${arrayOfSavedWorkingAd[i].id}</p>
`;
  }

  savedWorkAdOutput.innerHTML = savedWorkAd;
}

document.getElementById('clear').addEventListener('click', clearLocalStorage);

function clearLocalStorage() {
  localStorage.clear();
  location.reload();
  return false;
}