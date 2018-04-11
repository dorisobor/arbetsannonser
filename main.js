const latestJobs = document.getElementById("latest-jobs");
fetchStockholmJobs();

function fetchStockholmJobs() {

    fetch("http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?lanid=1&sida=1&antalrader=20")
        .then((response) => response.json())
        .then((jobs) => {
            displayJob(jobs)
        })

        .catch((error) => {
            console.log(error)
        });
}

function fetchJobDetails(id) {
    console.log(id);
    fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/${id}`)
        .then(response => response.json())
        .then(jobs => displayJobDetails(jobs))
        .catch((error) => {
            console.log(error)
        });
}

let adIds = [];

function displayJob(jobs) {
    const job = jobs.matchningslista.matchningdata;
    const latestJobs = document.getElementById("latest-jobs");
    let text = "";

    for (let i = 0; i < job.length; i++) {

        text += `<table>
                <tr>
                <th>Titel</th>
                <th><p>Kommun</th>
                <th><p>Publicerad</th>    
                </tr>
                <tr>
                <td class="moreInfo" data-id="${job[i].annonsid}"">${job[i].annonsrubrik}</td>
                <td>${job[i].kommunnamn}</td>
                <td>${job[i].sista_ansokningsdag}</td> 
                <td></td>
                <td><button class="moreInfo" data-id="${job[i].annonsid}">läs mer</button></td>
                </tr>
                </table> `;
        adIds.push(job[i].annonsid);


    }

    document.getElementById("all-jobs").innerHTML = text;
    hej();

    return adIds;



}
function hej() {
    var moreInfo = document.getElementsByClassName('moreInfo');

    for (let more of moreInfo) {
        console.log('hifjhfjhk');
        more.addEventListener('click', function () {
            console.log('click');
            fetchJobDetails(this.dataset.id);
            displayJobDetails(jobs);
        });


    }
}


function displayJobDetails(jobs) {
    const job = jobs.platsannons.annons;
    const jobItem = document.getElementById("single-job");
    const text = "";

    console.log(job.annonstext)

    for (let i = 0; i < job.length; i++) {
        text += `
            <p>${job.annonstext}</p>
        `;
    }

    document.getElementById("single-job").innerHTML = text;

}





Add CommentCollapse 
Message Input

Message @jessica