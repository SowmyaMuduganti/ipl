const spinner = document.getElementById("spinner");

window.onload = function() {
      showSpinner();
      var xhttp = new XMLHttpRequest();
      var teamData;
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          teamData = JSON.parse(this.responseText);
          hideSpinner();
          createTeamsElements(teamData);
        } if(this.readyState==4 && this.status!=200) {
            hideSpinner();
            var err = document.querySelector('.error');
            err.classList.add('active');
        }
      }
      xhttp.open("GET", "https://ipl-t20.herokuapp.com/teams", true);
      xhttp.send();
};

function showSpinner() {
    spinner.className = "show";
}

 function hideSpinner() {
   spinner.className = spinner.className.replace("show", "");
 }

function createTeamsElements(teamData){
    for(var i=0;i<teamData.length;i++){
        
      var teamNode = document.createElement("li");
      teamNode.setAttribute("class",teamData[i].id);
        
      var logo = document.createElement("div");
      logo.setAttribute("class","team-logo");
        
      var name = document.createElement("a");
      name.appendChild(document.createTextNode(teamData[i].teamName));
      name.href = "#";
      name.setAttribute("class","nav-link");
      name.setAttribute("data-target",teamData[i].id);
      
      var wins = document.createElement("p");
      wins.setAttribute("class","wins");
      var years = teamData[i].winningYears;
      var info = "";
      for(var j=0;j<years.length;j++) {
        info = info + years[j] + "  ";
      }
      wins.appendChild(document.createTextNode(info));
      name.appendChild(wins);       
      teamNode.appendChild(logo);
      teamNode.appendChild(name);
        
      document.getElementById("ipl-teams").appendChild(teamNode);
        
      createPlayersElements(teamData[i].id);
   }
    app();    
}

function createPlayersElements(team){
  var xhttp = new XMLHttpRequest();
  var playerData;
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
          var data = JSON.parse(this.responseText);
          var playerData = data.players;
          var teamDiv = document.createElement("div");
          teamDiv.setAttribute("class","page");
          teamDiv.setAttribute("id",team);
          document.getElementsByTagName("main")[0].appendChild(teamDiv);
          for(i=0;i<playerData.length;i++){
              var playerNode = document.createElement("div");
              playerNode.setAttribute("class", "player-node");
              var img = document.createElement("img");
              img.src = playerData[i].image;
              playerNode.appendChild(img);
              var name = document.createElement("p");
              name.appendChild(document.createTextNode(playerData[i].name));
              name.setAttribute("class","player-name");
              playerNode.appendChild(name);
              var statistics = document.createElement("div");
              statistics.setAttribute("class","stats");
              var stats = playerData[i].stats;
              var matches = document.createElement("p");
              matches.appendChild(document.createTextNode("MATCHES: "+stats.matches));
              var runs = document.createElement("p");
              runs.appendChild(document.createTextNode("RUNS: "+stats.runs));
              var wickets = document.createElement("p");
              wickets.appendChild(document.createTextNode("WICKETS: "+stats.wickets));
              
              statistics.appendChild(matches);
              statistics.appendChild(runs);
              statistics.appendChild(wickets);

              playerNode.appendChild(statistics);
              teamDiv.appendChild(playerNode);
          }
    }
  };
  xhttp.open("GET", "https://ipl-t20.herokuapp.com/teams/"+team, true);
  xhttp.send();
}
function app() {
    document.querySelectorAll('.nav-link').forEach((link)=>{
        link.addEventListener('click', function(ev){
            ev.preventDefault();
            let currentPage = ev.target.getAttribute('data-target');
            document.querySelector('.active').classList.remove('active');
            document.getElementById(currentPage).classList.add('active');
            history.pushState({}, currentPage, `${currentPage}`);
        });
    })
    history.replaceState({}, 'Teams', '/teams');
    window.addEventListener('popstate', function(ev){
        let hash = location.pathname;
        document.querySelector('.active').classList.remove('active');
        document.getElementById(hash).classList.add('active');
    });
}
