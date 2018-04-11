const latestJobs = document.getElementById("latest-jobs");

fetchStockholmJobs();


function fetchStockholmJobs(){

fetch("http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?lanid=1&sida=1&antalrader=20")
  .then((response) => response.json())
  .then((jobs) => {
    displayJob(jobs)
   })

.catch((error) => {
  console.log(error)
});
}


function displayJob(jobs) {
  const job = jobs.matchningslista.matchningdata;
  const latestJobs = document.getElementById("latest-jobs");
let text = "";



for (let i = 0; i <  job.length; i++) {
console.log(job[i]);
text += `<table>
<tr>
<th>Titel</th>
<th><p>Kommun</th>
<th><p>Publicerad</th>    
</tr>
<tr>
<td>${job[i].annonsrubrik}</td>
<td>${job[i].kommunnamn}</td>
<td>${job[i].sista_ansokningsdag} </td> 
<td><button id="${job[i].annonsid}">Spara</button></td>
</tr>
</table> `;
}

document.getElementById("all-jobs").innerHTML = text;


      


}