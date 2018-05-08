class FetchController {
    fetchStockholmJobs(rows = 10, countyId = 1) {
        fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?nyckelord=sverige&sida=1&antalrader=1000`)
            .then((response) => response.json())
            .then((jobs) => {
                new DOM().displayJob(jobs);
                new Controller().filterJob(jobs);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    fetchJobDetails(id) {
        return fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/${id}`)
            .then(response => response.json())
            .then(jobs => {
                new DOM().displayJobDetails(jobs);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    fetchSearchedJobs(searchedInput) {
        fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrken/${searchedInput}`)
            .then(response => response.json())
            .then(jobs => {
                new DOM().displaySearchedJobsByOccupationalTile(jobs);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    fetchJobsByOccupationalId(id) {
        return fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?yrkesid=${id}&sida=1&antalrader=1000`)
            .then(response => response.json())
            .then(jobs => {
                const newJobs = {
                    "matchningslista": {
                        "antal_platsannonser": jobs.matchningslista.antal_platsannonser_exakta,
                        "antal_platsannonser_exakta": jobs.matchningslista.antal_platsannonser_exakta,
                        "antal_platsannonser_narliggande": jobs.matchningslista.antal_platsannonser_narliggande,
                        "antal_platserTotal": jobs.matchningslista.antal_platserTotal,
                        "antal_sidor": jobs.matchningslista.antal_sidor,
                        "matchningdata": []
                    }
                };

                for (let i = 0; i < jobs.matchningslista.antal_platsannonser_exakta; i++) {
                    newJobs.matchningslista.matchningdata.push(jobs.matchningslista.matchningdata[i]);
                };
                
                new DOM().displayJob(newJobs);
                new Controller().filterJob(newJobs);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    fetchCategories() {
        fetch("http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrkesomraden")
            .then((response) => response.json())
            .then((categories) => {
                new DOM().displayCategoriesDOM(categories);
            })
            .catch((error) => {
                console.log(error)
            });
    }
    fetchJobsByCategories(id) {
        fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?yrkesomradeid=${id}&sida=1&antalrader=1000`)
            .then(response => response.json())
            .then(jobsByCategories => {
                new DOM().displayJob(jobsByCategories);
                new Controller().filterJob(jobsByCategories);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    fetchCounty(){
        fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/lan2`)
            .then(response => response.json())
            .then(county => {
                new DOM().displayOptionlan(county);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    fetchCommune(countyId){
        fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/kommuner?lanid=${countyId}`)
            .then(response => response.json())
            .then(commune => {
                new DOM().displayOptionCommune(commune);
            })
            .catch((error) => {
                console.log(error)
            });
    }
}

class DOM {
    displayJob(jobs, amount = 10) {
        paginations(amount, jobs);

        function paginations(perPage, jobs) {
            const totalNumberOfJobs = jobs.matchningslista.antal_platsannonser;
            const thingarray = jobs.matchningslista.matchningdata;
            let list = thingarray;
            let pageList = new Array();
            let currentPage = 1;
            let numberPerPage = perPage;
            let numberOfPages = 0;

            function paginationEventlisteners() {
                const next = document.getElementById("next")
                next.addEventListener("click", function () {
                    currentPage += 1;
                    loadList();
                });

                const previous = document.getElementById("previous")
                previous.addEventListener("click", function () {
                    currentPage -= 1;
                    loadList();
                });

                const first = document.getElementById("first")
                first.addEventListener("click", function () {
                    currentPage = 1;
                    loadList();
                });

                const last = document.getElementById("last")
                last.addEventListener("click", function () {
                    currentPage = numberOfPages;
                    loadList();
                });
            }

            function loadList() {
                const begin = ((currentPage - 1) * +numberPerPage);
                const end = begin + +numberPerPage;
                pageList = list.slice(begin, end);
                drawList();
                check();
            }

            function drawList() {
                numberOfPages = Math.ceil(list.length / +numberPerPage);
                const allJobs = document.getElementById("all-jobs");

                function filterDate(date) {
                    if (date === undefined) {
                        return "Datum saknas";
                    }
                    else {
                        return date.slice(0, 10);
                    }
                }

                let allJobList = `<h2>Antal lediga jobb: ${totalNumberOfJobs}</h2><div class="containerJobs">`;
                for (let i = 0; i < pageList.length; i++) {
                    allJobList += ` 
                        <div class="jobCard">
                            <h4>${pageList[i].annonsrubrik}</h4>
                            <p>${pageList[i].arbetsplatsnamn}, ${pageList[i].kommunnamn}</p>
                            <p>${pageList[i].yrkesbenamning}, ${pageList[i].anstallningstyp}</p>
                            <p>Sista ansökningsdatum: ${filterDate(pageList[i].sista_ansokningsdag)}</p>
                            <a href="#/annons/${pageList[i].annonsid}"><button class="blue-button" id="read-more">Läs mer</button></a>
                            <a href="${pageList[i].annonsurl}" target="_blank"><button class="blue-button">Arbetsförmedlingen</button></a> 
                        </div>
                    `;
                }

                allJobList += `
                    </div>
                    <div class="pagination">
                        <button class="pagination-link" id="first"><i class="fa fa-angle-double-left"></i> Första</button>
                        <button class="pagination-link" id="previous"><i class="fa fa-angle-left"></i> Föregånde</button>
                        ${currentPage}
                        <button class="pagination-link" id="next">Nästa <i class="fa fa-angle-right"></i></button>
                        <button class="pagination-link" id="last">Sista <i class="fa fa-angle-double-right"></i></button>
                    </div> 
                `;

                allJobs.innerHTML =  "<div id=\"copy-url-button-search\"></div>" + allJobList;
                new DOM().createCopyUrlButton("copy-url-button-search");
                paginationEventlisteners();
            }

            function check() {
                document.getElementById("next").disabled = currentPage == numberOfPages ? true : false;
                document.getElementById("previous").disabled = currentPage == 1 ? true : false;
                document.getElementById("first").disabled = currentPage == 1 ? true : false;
                document.getElementById("last").disabled = currentPage == numberOfPages ? true : false;
            }

            loadList();
        }
    }

    displayJobDetails(jobs) {
        let annonsDetaljer = "";
        const job = jobs.platsannons.annons;
        const villkor = jobs.platsannons.villkor;
        const ansokan = jobs.platsannons.ansokan;
        const arbetsplats = jobs.platsannons.arbetsplats;

        const sistaAnsokningsdag = ansokan.sista_ansokningsdag.substring(0, 10);
        // replaces /n/r with linebreaks
        const formatedAnnonstext = job.annonstext.replace(/(?:\r\n|\r|\n)/g, "<br />");

        annonsDetaljer += `
                <h2>${job.annonsrubrik}</h2>
                <h3>Om tjänsten</h3>
                ${job.yrkesbenamning && `<p>Sökes: ${job.yrkesbenamning}</p>`}
                ${job.anstallningstyp && `<p>Anställningstyp: ${job.anstallningstyp}</p>`}
                <h3>Om arbetsplatsen</h3>
                ${arbetsplats.arbetsplatsnamn && `<p>${arbetsplats.arbetsplatsnamn}</p>`}
                ${arbetsplats.besoksadress && `<p>${arbetsplats.besoksadress}</p>`}
                <h3>Villkor</h3>
                ${villkor.varaktighet && `<p>Varaktighet: ${villkor.varaktighet}</p>`}
                ${villkor.arbetstid && `<p>Arbetstid: ${villkor.arbetstid}</p>`}
                ${villkor.arbetstid && `<p>Löneform: ${villkor.loneform}</p>`}
                <h3>Ansökan</h3>
                ${ansokan.webbplats && `<a target="_blank" href="${ansokan.webbplats}">Ansök via företagets hemsida</a>`}
                ${sistaAnsokningsdag && `<p>Sista ansökning: ${sistaAnsokningsdag}</p>`}
                ${ansokan.ovrigt_om_ansokan && `<p>övrigt: ${ansokan.ovrigt_om_ansokan}</p>`}
                <h3>Om tjänsten</h3>
                ${job.annonstext && `<p>${formatedAnnonstext}</p>`}
                <button class="blue-button" data-id="${jobs.platsannons.annons.annonsid}" id="saveJobAdButton" name="${jobs.platsannons.annons.annonsrubrik}">Save</button>
            `;

        document.getElementById("annonsdetaljer").innerHTML = annonsDetaljer;

        const backToListButton = document.getElementById("back");
        backToListButton.addEventListener("click", function () {
            new DOM().showMainView();
            window.location.hash = "";
        });

        new DOM().createCopyUrlButton("copy-ad-url");

        const saveJobAdButton = document.getElementById("saveJobAdButton")
        saveJobAdButton.addEventListener("click", function () {
            const jobAd = {
                title: this.name,
                id: this.dataset.id
            };

            new Utility().saveJobAd(jobAd);
        });
    }
    displaySavedJobAds() {
        let savedJobAdOutput = document.getElementById("saved-job-ad-output");
        let savedJobAd = "<h3>Sparade annonser</h3>";

        for (let i = 0; i < arrayOfSavedJobAd.length; i++) {
            savedJobAd += `
                <p data-id="${arrayOfSavedJobAd[i].id}" class="showSavedJobAd">
                    ${arrayOfSavedJobAd[i].title}
                </p>`;
        }

        savedJobAdOutput.innerHTML = savedJobAd;
        new Controller().addEventlistenerToSavedJobAdTitle();
    }
    displaySearchedJobsByOccupationalTile(searchedJobsarray) {
        let outputSearchedJobs = document.getElementById("output-searched-jobs");
        let searchedJobs = searchedJobsarray.soklista.sokdata;
        let searchedJobList = "";

        for (let i = 0; i < searchedJobs.length; i++) {
            if (searchedJobs[i].antal_platsannonser != 0) {
                searchedJobList += `
                <a href="#/sokresultat/${searchedJobs[i].namn}/${searchedJobs[i].id}" data-id="${searchedJobs[i].id}" class="searchOccupationalTile" >
                    ${searchedJobs[i].namn} (${searchedJobs[i].antal_platsannonser})
                </a>`;
            }
        }

        outputSearchedJobs.innerHTML = searchedJobList;
        new Controller().addEventlisterToSearchJobResult();
    }
    displayCategoriesDOM(categories) {
        let categoryOutput = document.getElementById("categoryUl");
        const category = categories.soklista.sokdata;
        let categoryList = "";

        for (let i = 0; i < category.length; i++) {
            categoryList += `
           <li> 
                <a href="#/kategori/${category[i].namn}/${category[i].id}" 
                data-id="${category[i].id}" class="categoryListObject">${category[i].namn}</a>
           </li>`;
        }

        categoryOutput.innerHTML = categoryList;
        new Controller().addEventlisterToCategories();
    }
    showMainView() {
        const mainView = document.getElementById("main-view");
        const singleView = document.getElementById("single-view");
        mainView.classList.remove("hidden");
        singleView.classList.add("hidden");
    }
    showSingleView() {
        const mainView = document.getElementById("main-view");
        const singleView = document.getElementById("single-view");
        singleView.classList.remove("hidden");
        mainView.classList.add("hidden");
    }
    createCopyUrlButton(containerId) {
        const container = document.getElementById(containerId);
        const div = document.createElement("div");

        div.innerHTML = `
            <details class="copy-url-button">
                <summary class="blue-button">Dela</summary>
                <div class="details-inner-container">
                    <input class="ad-url" readonly="readonly">
                    <button class="copy-url blue-button no-margin">Kopiera</button>
                </div>
            </details>
        `;

        const copyButton = div.querySelector(".copy-url");
        const url = div.querySelector(".ad-url");
        url.value = window.location.href;

        copyButton.addEventListener("click", function () {
            url.select();
            document.execCommand("Copy");

            url.value = "kopierad";

            setTimeout(function () {
                url.value = window.location.href;
            }, 1000);
        });
        
        container.innerHTML = "";
        container.appendChild(div);
    }
    displayOptionlan(county){
        const countyJobs = document.getElementById("county-jobs");
        let options = `<option data-placeholder="true"></option>`;

        for(let i = 0; i < county.soklista.sokdata.length; i++){
            options += `
            <option value="${county.soklista.sokdata[i].id}">${county.soklista.sokdata[i].namn}</option>`; 
        }

        countyJobs.innerHTML = options;
    }
    displayOptionCommune(commune){
        let communeDiv = document.getElementById("commune");
        let options = `<label for="commune">Kommun:</label>
                       <select id="communeFilter">
                       <option data-placeholder="true"></option>`;

        for(let i = 0; i < commune.soklista.sokdata.length; i++){
            options += `
            <option value="${commune.soklista.sokdata[i].id}">
                ${commune.soklista.sokdata[i].namn}
            </option>`; 
        }

        options += `</select>`;
        communeDiv.innerHTML = options;

        new SlimSelect({
            select: "#communeFilter",
            placeholder: "Filtrera kommun",
            allowDeselect: true,
            showSearch: false,
        });
    }
}

class Controller {
    routeUrl() {
        /* if href contains #/annons its a url to a specific ad so we fetch
        the ad-details and switch to single view */
        if (window.location.hash.startsWith(`#/annons`)) {
            const adId = window.location.hash.split(`/`).pop();
            new FetchController().fetchJobDetails(adId);
            new DOM().showSingleView();
        /* if href contains #/sokresultat its a url to ads when user has used
        the searchfield */
        } else if (window.location.hash.startsWith(`#/sokresultat`)) {
            const occupationalId = window.location.hash.split(`/`).pop();
            new FetchController().fetchJobsByOccupationalId(occupationalId);
        /* if href contains #/kategori its a url to ads when user has clicked
        the categories in sidebar */
        } else if (window.location.hash.startsWith(`#/kategori`)) {
            const categoryId = window.location.hash.split(`/`).pop();
            new FetchController().fetchJobsByCategories(categoryId);
            new DOM().showMainView();
        } else {
            window.location.hash = "";
            new FetchController().fetchStockholmJobs();
            new DOM().showMainView();
        }
    }
    addEventlistenerToSavedJobAdTitle() {
        const showSavedJobAds = document.getElementsByClassName("showSavedJobAd");
        for (let showSavedJobAd of showSavedJobAds) {
            showSavedJobAd.addEventListener("click", function () {
                new FetchController().fetchJobDetails(this.dataset.id);
                new DOM().showSingleView();
            });
        }
    }
    addEventListenerClearSavedJob() {
        document.getElementById("clear").addEventListener("click", function () {
            new Utility().clearLocalStorage();
        });
    }
    addEventlistenerToSearchJob() {
        // when user enters at least 3 chars sh/e gets searchsuggestions
        const autocomplete = document.getElementById("searchJobInput");
        autocomplete.addEventListener("keyup", function(){
            const searchJobInput = document.getElementById("searchJobInput").value;

            if (searchJobInput.length >= 3){
                new FetchController().fetchSearchedJobs(searchJobInput);
            } else {
                let outputSearchedJobs = document.getElementById("output-searched-jobs")
                outputSearchedJobs.innerHTML = "";
            }
        });

        // when user writes in input AND submits
        const searchJobButton = document.getElementById("searchJobButton");
        searchJobButton.addEventListener("click", function () {
          let searchJobInput = document.getElementById("searchJobInput").value;
          new FetchController().fetchSearchedJobs(searchJobInput);
        });
    }
    addEventlisterToSearchJobResult() {
        const searchResultTitles = document.getElementsByClassName("searchOccupationalTile");
        for (let searchResultTitle of searchResultTitles) {
            searchResultTitle.addEventListener("click", function () {
                const id = this.dataset.id;
                new FetchController().fetchJobsByOccupationalId(id)
            });
        }
    }
    addEventlisterToCategories() {
        const jobCategories = document.getElementsByClassName("categoryListObject");
        for (let jobCategory of jobCategories) {
            jobCategory.addEventListener("click", function () {
                const id = this.dataset.id;
                new FetchController().fetchJobsByCategories(id)
            });
        }
    }
    filterJob(jobs) {
        const amountOfJobsPlaceholder = "";
        const filteredArray = {
            "matchningslista": {
                "antal_platsannonser": amountOfJobsPlaceholder,
                "antal_platsannonser_exakta": jobs.matchningslista.antal_platsannonser_exakta,
                "antal_platsannonser_narliggande": jobs.matchningslista.antal_platsannonser_narliggande,
                "antal_platserTotal": jobs.matchningslista.antal_platserTotal,
                "antal_sidor": jobs.matchningslista.antal_sidor,
                "matchningdata": []
            }
        };

        const submitNumberButton = document.getElementById("submit-number");
        submitNumberButton.addEventListener("click", function () {
            let numberValue = document.getElementById("number-jobs").value;
            let countyValue = document.getElementById("county-jobs").value;

            if (countyValue !== "") {
                const communeValue = document.getElementById("communeFilter").value;

                for (let i = 0; i < jobs.matchningslista.matchningdata.length; i++) {
                    if (communeValue !== ""){
                        if (jobs.matchningslista.matchningdata[i].lanid === countyValue 
                            && jobs.matchningslista.matchningdata[i].kommunkod === communeValue) {
                            filteredArray.matchningslista.matchningdata.push(jobs.matchningslista.matchningdata[i]);
                        }
                    } else {
                        if (jobs.matchningslista.matchningdata[i].lanid === countyValue) {
                            filteredArray.matchningslista.matchningdata.push(jobs.matchningslista.matchningdata[i]);
                        }
                    }
                }

                if (numberValue === "") {
                    numberValue = 10
                }

                filteredArray.matchningslista.antal_platsannonser = filteredArray.matchningslista.matchningdata.length
                new DOM().displayJob(filteredArray, numberValue);
                filteredArray.matchningslista.matchningdata = [];
            } else {
                if (numberValue === ""){
                    numberValue = 10;
                    new DOM().displayJob(jobs, numberValue);
                }
                new DOM().displayJob(jobs, numberValue);
            }
        });
    }
    sidebarDisplay() {
        const openSidebarButton = document.getElementById("openSidebarButton");
        openSidebarButton.addEventListener("click", function () {
            document.getElementById("aside").style.zIndex = "0";
        });

        const closeSidebarButton = document.getElementById("closeSidebarButton");
        closeSidebarButton.addEventListener("click", function () {
            document.getElementById("aside").style.zIndex = "-2";
        });
    }
    categoriesShowHide() {
        const categoriesButton = document.getElementById("categoriesButton");
        categoriesButton.addEventListener("click", function () {
            const categoryUl = document.getElementById("categoryUl");

            if (categoryUl.style.display === "block") {
                categoryUl.style.display = "none";
                categoriesButton.innerHTML = "Kategorier <i class=\"fa fa-chevron-down\" aria-hidden=\"true\"></i>";
            } else {
                categoryUl.style.display = "block";
                categoriesButton.innerHTML = "Kategorier <i class=\"fa fa-chevron-up\" aria-hidden=\"true\"></i>";
            }
        });
    }
    checkCountyChange(){
        const county = document.getElementById("county-jobs");
        county.addEventListener("change", function(){
            new FetchController().fetchCommune(county.value);
        });
    }
}

class Utility {
    saveJobAd(jobAd) {
        arrayOfSavedJobAd.push(jobAd);
        new DOM().displaySavedJobAds();
        scroll(0, 0);
        this.saveJobAdToLocalStorage();
    }
    saveJobAdToLocalStorage() {
        let str = JSON.stringify(arrayOfSavedJobAd);
        localStorage.setItem("arrayOfSavedJobAd", str);
    }
    getJobAdArrayFromLocalStorage() {
        let array = localStorage.getItem("arrayOfSavedJobAd");
        arrayOfSavedJobAd = JSON.parse(array);

        if (!arrayOfSavedJobAd) {
            arrayOfSavedJobAd = [];
        }
    }
    clearLocalStorage() {
        localStorage.clear();
        location.reload();
    }
}

// jQuery for styling of selects menus
new SlimSelect({
    select: "#number-jobs",
    placeholder: "Antal per sida",
    allowDeselect: true,
    showSearch: false,
});

new SlimSelect({
    select: "#county-jobs",
    placeholder: "Filtrera Län",
    allowDeselect: true,
    showSearch: false,
});

// init state when app opens
arrayOfSavedJobAd = [];

const fetchController = new FetchController();
fetchController.fetchCategories();
fetchController.fetchCounty();

const utility = new Utility();
utility.getJobAdArrayFromLocalStorage();

const dom = new DOM();
dom.displaySavedJobAds();

const controller = new Controller();
controller.routeUrl();
controller.sidebarDisplay();
controller.categoriesShowHide();
controller.checkCountyChange();
controller.addEventListenerClearSavedJob();
controller.addEventlistenerToSearchJob();

/* looks for changes in window url and routes depending on 
what the url contains */
window.addEventListener("hashchange", event => {
    controller.routeUrl();
});