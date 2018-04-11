const allJobs = document.getElementById("all-jobs");
const latestTenJobs = document.getElementById("latest-jobs");



fetchStockholmJobs();


function fetchStockholmJobs(){

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
    
      
  
   let publishedJobList = "";
    for(const jobAdvert of jobAdverts.slice(0,10)){
  
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
let allJobList  = "";



for (let i = 0; i <  job.length; i++) {
  
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
</tr>
</table> `;
}

allJobs.innerHTML = allJobList;    
}

/* Save Working Ad */

let arrayOfSavedWorkingAd = []

function saveWorkingAd(workAd){
    arrayOfSavedWorkingAd.push(workAd);
    saveWorkingAdToLocalStorage();
}

function saveWorkingAdToLocalStorage(){
    let str = JSON.stringify(arrayOfSavedWorkingAd);
    localStorage.setItem("arrayOfSavedWorkingAd", str);
}

function getWorkingAdArrayFromLocalStorage(){
    let array = localStorage.getItem("arrayOfSavedWorkingAd");
    arrayOfSavedWorkingAd = JSON.parse(array);
    if (!arrayOfSavedWorkingAd){
        arrayOfSavedWorkingAd = [];
    }
}

getWorkingAdArrayFromLocalStorage();

console.log(arrayOfSavedWorkingAd);

let savedWorkAdOutput = document.getElementById('saved-work-ad-output');
let savedWorkAd = "<h3>Sparade annonser</h3>";

for(let i = 0; i < arrayOfSavedWorkingAd.length; i++){
savedWorkAd += `
    <p>${arrayOfSavedWorkingAd[i].title}</p>
    <p>${arrayOfSavedWorkingAd[i].id}</p>
`;
}

savedWorkAdOutput.innerHTML = savedWorkAd;

let saveWorkAdButton = document.getElementById('saveWorkAdButton')

saveWorkAdButton.addEventListener('click', function(){
    var workingAd = {
        title: this.name,
        id: this.dataset.id
    };
    saveWorkingAd(workingAd);
});

document.getElementById('clear').addEventListener('click', clearLocalStorage);
function clearLocalStorage() {
    localStorage.clear();
    location.reload();
    return false;
}
