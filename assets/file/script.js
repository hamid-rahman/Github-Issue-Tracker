const manageSpinner = (status)=>{
    if(status===true){
        document.getElementById('spinner').classList.remove('hidden');
        document.getElementById('display-all-container').classList.add('hidden');
    }else{
        document.getElementById('spinner').classList.add('hidden');
        document.getElementById('display-all-container').classList.remove('hidden');
    }

}


let allIssueData = [];
const allIssues = async () => {
    manageSpinner(true);
    const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

    const res = await fetch(url);
    const data = await res.json();
    allIssueData = data.data;
    displayIssues(data.data);
    updateStatusLegend(data.data);
}


const loadIssueDetails = async(id) =>{
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;

    const res =await fetch(url);
    const details =await res.json();
    displayIssueDetails(details.data);
}

const displayIssueDetails = (details) =>{
    const displayDetails = document.getElementById('display-details');

    displayDetails.innerHTML = "";

    const newDetailBox = document.createElement('div');
    newDetailBox.innerHTML=`
          <div class="cursor-pointer max-w-2xl space-y-4 p-6">

  <h2 class="text-xl font-bold">${details.title}</h2>

  <div class="flex items-center gap-2 text-sm text-base-content/60">
    <span class="badge badge-success text-white">${details.status}</span>
    <span>• Opened by ${details.author} • ${new Date(details.createdAt).toLocaleDateString("en-GB")}</span>
  </div>

  <div class="flex gap-2">

    ${createLabels(details.labels)}
  </div>

  <p class="text-base-content/70">
    ${details.description}
  </p>

  <div class="bg-base-200 rounded-lg p-4 grid grid-cols-2 gap-4">
    <div>
      <p class="text-base-content/70">Assignee:</p>
      <p class="font-bold">${details.assignee || 'Not Found'} </p>
    </div>
    <div>
      <p class="text-base-content/70">Priority:</p>
      <span class="badge badge-error text-white mt-1 uppercase">${details.priority}</span>
    </div>
  </div>

</div>
    
    `;

    displayDetails.appendChild(newDetailBox);

    document.getElementById('my_modal_3').showModal();

}




const displayIssues = (issues) => {
    const totalIssuesCount = document.getElementById('total-issues-count');

    const displayAllContainer = document.getElementById('display-all-container');

    displayAllContainer.innerHTML = "";

    totalIssuesCount.innerText = `${issues.length} Issues`;

    issues.forEach(issue => {
        const newDiv = document.createElement('div');

        newDiv.innerHTML = `
              <div onclick="loadIssueDetails(${issue.id})" class="card bg-base-100 shadow-sm ${priorityBorder(issue.status)}">
        <div class="card-body">
          <div class="flex justify-between items-center">
              ${dynamicIcons(issue.priority)}
  
            ${priorityColor(issue.priority)}
          </div>
          <h2 class="card-title text-base">${issue.title}</h2>
          <p class="text-gray-500 text-sm">${issue.description}</p>
          <div class="flex gap-2 flex-wrap">
            ${createLabels(issue.labels)}
          </div>
        </div>
        <div class="border-t border-gray-200 p-4 text-sm text-gray-500">
          <p>${issue.author}</p>
          <p>${new Date(issue.createdAt).toDateString()}</p>
        </div>
      </div>
        
        `;
        displayAllContainer.appendChild(newDiv);
        manageSpinner(false);

    });
}






// Dynamic button filter

allIssues();



// Search result
const getSearchBtn = document.getElementById('btn-search');
getSearchBtn.addEventListener('click', ()=>{

    const input = document.getElementById('input-search');
      const searchValue = input.value.trim().toLowerCase().replace(/\s+/g, ' ');



    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues ")
    .then(res => res.json())
    .then(data => {
        const allData = data.data;
        const filterIssue = allData.filter((item) => item.title.toLowerCase().includes(searchValue));
        displayIssues(filterIssue);

        document.getElementById('search_result_title').innerHTML=`
          <h2 class="text-2xl text-center font-bold">Total Search result: ${filterIssue.length}</h2>

        `;
    })

  

  



displayIssues();

    

})








//Fileter by button click
const allBtn = document.getElementById('all-btn');
const openBtn = document.getElementById('open-btn');
const closedBtn = document.getElementById('closed-btn');

// button active state

const activeButton = (btn) =>{
    allBtn.classList.remove('active');
    openBtn.classList.remove('active');
    closedBtn.classList.remove('active');   

    btn.classList.add('active');
}

allBtn.addEventListener('click', ()=>{
    activeButton(allBtn);
    displayIssues(allIssueData);
    updateStatusLegend(allIssueData);

});

openBtn.addEventListener('click', ()=>{
    const openIssues = allIssueData.filter(issue => issue.status === "open");
    activeButton(openBtn);
    displayIssues(openIssues);
    updateStatusLegend(openIssues);

})


closedBtn.addEventListener('click', ()=>{
    const closedIssues = allIssueData.filter(issue => issue.status === "closed");
    activeButton(closedBtn);
    displayIssues(closedIssues);
    updateStatusLegend(closedIssues);

})






// update Status Legend
const updateStatusLegend = (issues) => {

    const statusLegend = document.getElementById("status-legend");

    statusLegend.innerHTML = "";

    let open = false;
    let closed = false;

    issues.forEach(issue => {

        if (issue.status === "open") {
            open = true;
        }

        if (issue.status === "closed") {
            closed = true;
        }

    });

    if (open) {
        statusLegend.innerHTML += `
            <p class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-green-500"></span>
                Open
            </p>
        `;
    }

    if (closed) {
        statusLegend.innerHTML += `
            <p class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-purple-500"></span>
                Closed
            </p>
        `;
    }
};












// tag / category dynamic color apply
const createLabels = (labels) =>{
    return labels.map(label => {
        if(label === "bug"){
            return `<span class="badge badge-error badge-outline badge-sm uppercase"><i class="fa-solid fa-bug"></i> ${label}</span>`;
        }
        if(label === "help wanted"){
            return `<span class="badge badge-warning badge-outline badge-sm uppercase"><i class="fa-regular fa-life-ring"></i> ${label}</span>`;
        }
        if(label === "enhancement"){
            return `<span class="badge badge-info badge-outline badge-sm uppercase"><i class="fa-solid fa-lightbulb"></i> ${label}</span>`;
        }
        return `<span class="badge badge-error badge-outline badge-sm uppercase"><i class="fa-solid fa-bug"></i> ${label}</span>`;
    }).join(" ");

}





// status high|low|medium dynamic color apply
const priorityColor = (pr) => {
    if(pr === "high"){
        return `<span class="badge bg-[#FEECEC] text-[#B42318] uppercase"> ${pr}</span>`;
    }else if(pr === "medium"){
        return `<span class="badge bg-[#FFF6D1] text-[#F59E0B] uppercase"> ${pr}</span>`;
    }else if(pr === "low"){
        return `<span class="badge bg-[#EEEFF2] text-[#9CA3AF] uppercase"> ${pr}</span>`;
    }else{
        return `<span class="badge bg-gray-200 text-gray-700 uppercase"> ${pr}</span>`;
    }
}



// dynamic icon and color apply   
const dynamicIcons = (icon) =>{
    if(icon === "high" || icon === "medium"){
        return `
            <div class="bg-[#CBFADB]  rounded-full w-8 h-8 flex items-center justify-center">
             <i class="fa-regular fa-circle"></i>
            </div>
        `;
    }else if(icon === "low"){
        return `
            <div class="bg-[#F0E2FF] rounded-full w-8 h-8 flex items-center justify-center">
             <i class="fa-regular fa-circle-check"></i>
            </div>
        
        `;
    }else{
        return "";
    }

}


// card top border color dynamic apply
// const priorityBorder = (priority) =>{
//     if(priority === "high" || priority === "medium"){
//         return "border-t-4 border-green-500";
//     }else if(priority === "low"){
//         return "border-t-4 border-purple-500";
//     }
// }

const priorityBorder = (status) =>{
    if(status === "open"){
        return "border-t-4 border-green-500";
    }else if(status === "closed"){
        return "border-t-4 border-purple-500";
    }
}




