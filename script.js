/*
-<!>Imediate<!>-
* rations calculator
* add wiki link for skills
--Future Plans--
* general config
* add faction and story reward picker
* add standalone skill picker
--End Game--
-Maybe you can do these if you're bored or the site gets attention-
* <!>Request help optimizing the website<!>
* add contact page
* add a way to see every item in the game (please for the love of everything holy AUTOMATE THIS)
* add quickslot config
* add equipment picker
*/

var skillTreePic = document.getElementById("skillTreeTemplate").cloneNode(true);
document.getElementById("skillTreeTemplate").remove()
var skillPic = document.getElementById("skillPicTemplate").cloneNode(true);
document.getElementById("skillPicTemplate").remove();
let skillTrees = {}
let chosenSkills = []
var estimatedCost = 0
var estimatedRations = 0
var estimatedBP = 0
var estimatedMedal = 0
const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`
function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function calculateRations(){
  /*
  Caldera: 3 (end game)
  Chersonese: 3
  Emerkar Forest: 3
  Abrassar: 4 (one way, so last place to go)
  Hallowed Marsh: 3
  Antique Plateau: 2-4 (also costs 200 silver)
  Chersonese 3 > Hallowed Marsh 6 > Chersonese 9 > Emerkar Forest 12 > Abrassar 16 > Antique Plateau 18-20 S200 > Emerkar Forest 20-24 S400 > Caldera 23-27 S400
  */
}

function buildSkillTreeUI(){
  for (let prop in skillTrees){
    tmp = skillTreePic.cloneNode(true);
    document.getElementById("skillTrees").appendChild(tmp)
    tmp.id = prop
    tmp.children[0].srcset = "assets/skillTrees/"+prop.replace(" ","")+"/Logo.webp"
    tmp.onclick = function(){
      document.getElementById("skillTreeDisplay").children[0].textContent = prop
      refillSkills(skillTrees[prop],prop)
      updateSkillDesc()
      document.getElementById("skillTreeDisplay").children[1].textContent = skillTrees[prop][0].region+" | "+skillTrees[prop][0].trainer+" | "+skillTrees[prop][0].DLC
    }
  }
}
function updateCosts(){
  document.getElementsByClassName("costEstimateText")[0].children[0].textContent = estimatedCost
  document.getElementsByClassName("costEstimateText")[1].children[0].textContent = estimatedBP
  document.getElementsByClassName("costEstimateText")[2].children[0].textContent = estimatedRations  
  document.getElementsByClassName("costEstimateText")[3].children[0].textContent = estimatedMedal  
}

function updateSkillDesc(title,desc,cst,SP,medal){
  if(title==undefined){
    document.getElementById("skillDescriptionTop").children[0].textContent = "Skill name here!"
    document.getElementById("skillDescription").children[0].textContent = "Skill description here!"
  }else{
    if(medal==undefined){
      document.getElementById("skillDescriptionTop").children[0].textContent = title+" | "+cst+" Silver | " + SP.toString()+" BP"
      document.getElementById("skillDescription").children[0].textContent = desc
    }else{
      document.getElementById("skillDescriptionTop").children[0].textContent = title+" | "+medal+" Medal"
      document.getElementById("skillDescription").children[0].textContent = desc
    }
  }
}

function refillSkills(newTree,treeName){
  document.getElementById("tierOne").innerHTML = ""
  document.getElementById("tierTwo").innerHTML = ""
  document.getElementById("tierThree").innerHTML = ""
  for (let prop in newTree){
    data = newTree[prop]
    name = data.name
    description = data.description
    cost = data.cost
    BP = data.BP
    wikiLink = data.wikiLink
    tier = data.tier
    tmp = skillPic.cloneNode(true)
    tmp.id = name
    tmp.onmouseover = function(){
      updateSkillDesc(newTree[prop].name,newTree[prop].description,newTree[prop].cost,newTree[prop].BP,newTree[prop].medal)
    }
    tmp.onclick = function() {
      card = document.getElementById(newTree[prop].name).children[2] //#c0392b disabled | #16a085 picked
      if(chosenSkills.includes(newTree[prop].name)){
        //turn off
        skillNotif = document.getElementById(treeName).children[2]
        removeItemOnce(chosenSkills,newTree[prop].name)
        estimatedCost-=parseInt(newTree[prop].cost)
        estimatedBP-=parseInt(newTree[prop].BP)
        if(newTree[prop].medal != undefined){estimatedMedal-=parseInt(newTree[prop].medal)}
        if (newTree[prop].tier == "2"){skillNotif.style.backgroundColor = "#617487"}
        card.style.borderColor = "#22303c"
        //enable now compatable cards
        if (newTree[prop].cancels != undefined){
          document.getElementById(newTree[prop].cancels).children[2].style.borderColor = "#22303c"
        }
        //update counter
        tn=parseInt(skillNotif.textContent)-1
        skillNotif.textContent = tn
        if (tn<=0){skillNotif.style.opacity = 0}else{skillNotif.style.opacity = 1}
        updateCosts()
        
      }else if (rgb2hex(card.style.borderColor) == "#c0392b") {
        //dont do any
        
      }else {
        skillNotif = document.getElementById(treeName).children[2]
        //turn on
        chosenSkills.push(newTree[prop].name)
        estimatedCost+=parseInt(newTree[prop].cost)
        estimatedBP+=parseInt(newTree[prop].BP)
        if(newTree[prop].medal != undefined){estimatedMedal+=parseInt(newTree[prop].medal)}
        if (newTree[prop].tier == "2"){card.style.borderColor = "#e67e22";skillNotif.style.backgroundColor = "#8e44ad";}else{card.style.borderColor = "#16a085"}
        //disable incompatable cards
        if (newTree[prop].cancels != undefined){
          document.getElementById(newTree[prop].cancels).children[2].style.borderColor = "#c0392b"
        }
        //update counter
        tn=parseInt(skillNotif.textContent)+1
        skillNotif.textContent = tn
        if (tn<=0){skillNotif.style.opacity = 0}else{skillNotif.style.opacity = 1}
        updateCosts()
      }
    }
    switch(tier) {
      case "1":
        document.getElementById("tierOne").appendChild(tmp)
        break;
      case "2":
        document.getElementById("tierTwo").appendChild(tmp)
        break;
      case "3":
        document.getElementById("tierThree").appendChild(tmp)
    }
    tmp.children[0].srcset = "assets/skillTrees/"+treeName.replace(" ","")+"/skills/"+name.replace("Rune: ","").replace(/ /g,"_")+".webp"
  }
  
  for (let prop in newTree) {
    data = newTree[prop]
    name = data.name
    if (chosenSkills.includes(name)){
      description = data.description
      cost = data.cost
      BP = data.BP
      wikiLink = data.wikiLink
      tier = data.tier
      tmp = document.getElementById(name)
      if (tier == "2"){
        tmp.children[2].style.borderColor = "#e67e22"
      }else{
        tmp.children[2].style.borderColor = "#16a085"
      }
      if (newTree[prop].cancels != undefined){
        document.getElementById(newTree[prop].cancels).children[2].style.borderColor = "#c0392b"
      }
    }
  }
}

let request = new Request("./data/skillTrees.json");
fetch(request)
  .then(function(resp){
    return resp.json();
  })
  .then(function(data){
    skillTrees = data;
    buildSkillTreeUI()
  })