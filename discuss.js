var submitQuestionNode = document.getElementById("submitBtn");

var questionTitleNode = document.getElementById("subject");
var questionDescriptionNode = document.getElementById("question");
var allQuestionsListNode = document.getElementById("dataList");

submitQuestionNode.addEventListener("click", onQuestionSubmit);

var createQuestionFormNode = document.getElementById("toggleDisplay");

// After click on particular question to see details
var questionDetailContainerNode = document.getElementById("respondQue");
var resolveQuestionContainerNode = document.getElementById("resolveHolder");
var resolveQuestionNode = document.getElementById("resolveQuestion");
var responseContainerNode = document.getElementById("respondAns");
var commentContainerNode = document.getElementById("commentHolder");
var comentatorNameNode = document.getElementById("pickName");
var commentNode = document.getElementById("pickComment");
var submitCommentNode = document.getElementById("commentBtn");
var questionSearchNode = document.getElementById("questionSearch");

var upvote =document.getElementById("upvote");
var downvote =document.getElementById("downvote");
var resolveButtonNode = document.getElementById("resolveQuestion");

//listen to value change in question search 
questionSearchNode.addEventListener("change", function(event) {
            // show filtered result
            filterResult(event.target.value);
})

// filter result
function filterResult(query) {
    var allQuestions = getAllQuestions();

clearQuestionPanel(); //clear question panel before filtering the questions
    if(query)
    {
        var filteredQuestions = allQuestions.filter(function(question){
        
            if(question.title.includes(query))
            {
            
            return true;
            }

        });
        
        if(filteredQuestions.length)
        {
            filteredQuestions.forEach(function(question)
            {
                addQuestionToPanel(question);
            })
        }
        else{
          //print if no result is found
            printNoMatchFound();
        }
    }
    //if there is no query(value in search question ) then display all the questions
    else
    {

            allQuestions.forEach(function(question){
        
            addQuestionToPanel(question);
            
            })
        }
}

//
function clearQuestionPanel(){
    allQuestionsListNode.innerText= "";
}


// display All Existing Questions

function onLoad() {



    // get all Questions from storage
    var allQuestions = getAllQuestions();

    allQuestions = allQuestions.sort(function(currentQ,nextQ)
    {
      if(currentQ.isFav)
      {
        return -1;
      }

      return 1;
    })

    allQuestions.forEach(function(question){
        addQuestionToPanel(question);
    })
}

onLoad();
// listen for the submit button to create question
function onQuestionSubmit(){

    var question = {
        title: questionTitleNode.value,
        description: questionDescriptionNode.value,
        responses: [],
        upvotes: 0,
        downvotes: 0,
        createdAt: Date.now(),
        ifFav: false,
    }

    saveQuestion(question);
    addQuestionToPanel(question);
    clearQuestionForm();
}

// Save question to storage
function saveQuestion(question){

    // get all questions first and push the new question 
    // and then store again in storage
    // let allQuestions = localStorage.getItem("questions");

    // if(allQuestions){
    //     allQuestions = JSON.parse(allQuestions);
    // }
    // else
    // {
    //     allQuestions = [];
    // }
    var allQuestions = getAllQuestions();

    allQuestions.push(question);

    localStorage.setItem("questions", JSON.stringify(allQuestions));
}

// get all questions from storage
function getAllQuestions(){

    var allQuestions = localStorage.getItem("questions");
    
    if(allQuestions){
        allQuestions = JSON.parse(allQuestions);
    }
    else
    {
        allQuestions = [];
    }
    //allQuestions.push(questions);
    return allQuestions;
}

// append question to the left panel

function addQuestionToPanel(question) {

    var questionContainer = document.createElement("div");
        questionContainer.style.backgroundColor="grey";
        questionContainer.setAttribute("id",question.title);
        
    var newQuestionTitleNode = document.createElement("h5");
        newQuestionTitleNode.innerHTML = question.title;
        questionContainer.appendChild(newQuestionTitleNode);
        
    var newQuestionDescriptionNode = document.createElement("p");
        newQuestionDescriptionNode.innerHTML = question.description;
        questionContainer.appendChild(newQuestionDescriptionNode);
        

    var upvoteTextNode = document.createElement("p");
        upvoteTextNode.innerHTML = "upvote = "+ question.upvotes;
        questionContainer.appendChild(upvoteTextNode);
    
    var downvoteTextNode = document.createElement("p");
        downvoteTextNode.innerHTML = "downvote = "+ question.downvotes;
        questionContainer.appendChild(downvoteTextNode);

    var creationDateAndTimeNode = document.createElement("p");
        creationDateAndTimeNode.innerHTML = new Date(question.createdAt).toLocaleString();
        questionContainer.appendChild(creationDateAndTimeNode);
    
    var createdAtNode = document.createElement("p");
        createdAtNode.innerHTML= "Created: "+ convertDateToCreatedAtTime(question.createdAt) + " ago";
        questionContainer.appendChild(createdAtNode);

    // resfesh time every second
    //refreshSecond(question,createdAtNode);

        setInterval(function(){
        createdAtNode.innerHTML= "Created: "+ convertDateToCreatedAtTime(question.createdAt) + " ago";    
        },1000)

    var addToFavNode = document.createElement("button");
        
        addToFavNode.addEventListener("click",toggleFavQuestion(question));
        if(question.isFav)
        {
        addToFavNode.innerHTML = "Remove Fav";

        }
        else {
            addToFavNode.innerHTML = "Add Fav";
        }

        questionContainer.appendChild(addToFavNode);

        allQuestionsListNode.appendChild(questionContainer);


        questionContainer.addEventListener("click", onQuestionClick(question));
    // clearQuestionForm();
}

// toggle Favourite Question
function toggleFavQuestion(question)
{
    return function(event)
    {
         event.stopPropagation();
        question.isFav = !question.isFav;
        updateQuestion(question);   
        if(question.isFav)
        {
        event.target.innerHTML = "Remove Fav";

        }
        else {
            event.target.innerHTML = "Add Fav";
        } 
    }
}


//refresh Question
// function refreshSecond(question,elment)
// {
    
//     setInterval(function(){
//         question.forEach(function(question){
//         var time = question.createdAt;
//         elment.innerHTML= "Created: "+ convertDateToCreatedAtTime(time) + " ago";    
//     })
//     },1000)
// }

//convert date to hours ago like format
function convertDateToCreatedAtTime(date)
{
    var currentTime = Date.now();
    var timeLapsed = currentTime - new Date(date).getTime();

    var secondsDiff = Math.round(timeLapsed / 1000) ;
    var minutesDiff = Math.round(secondsDiff /60);
    var hourDiff =  Math.round(minutesDiff /60);

        secondsDiff = Math.round(secondsDiff%60);
        minutesDiff = Math.round(minutesDiff%60);
        hourDiff = Math.round(hourDiff%60);
        
        if(hourDiff>0)
        return hourDiff+ " hours ";
        else if (minutesDiff>0)
        return minutesDiff+ " minutes ";
        else if(secondsDiff>=0)
        return "a few seconds";

    //return hourDiff + " hours "+minutesDiff+" minutes "+secondsDiff+" seconds";
}




// clear Question Form
function clearQuestionForm(){
    questionTitleNode.value=""
    questionDescriptionNode.value = "";
}

// listen for click on the question in right panel 
function onQuestionClick(question){

    return function(){

        // clouser you can access question variable
        // hide question panel
        hideQuestionPanel();

        // clear last details 
        clearQuestionDetails();
        clearResponsePanel();


        //show clicked question
        showDetails();

        //create question details
        addQuestionToRight(question);

        //show all previous questions
        question.responses.forEach(function(response){
            addResponseInPanel(response);

        })

        // listen for response Submit
        //console.log("count");
        submitCommentNode.onclick = onResponseSubmit(question);

        upvote.onclick=upvoteQuestion(question);
        downvote.onclick= downvoteQuestion(question);
    
        resolveButtonNode.onclick = resolveQuestion(question);
    }
}

// upvotes higher order function(clousure closure gives you access to an outer function’s scope from an inner function )
function upvoteQuestion(question)
{
    return function(){
        question.upvotes++;
    updateQuestion(question);
    updateQuestionUI(question);
    }
}

//downvotes
function downvoteQuestion(question)
{
    return function(){
        question.downvotes++;
    updateQuestion(question);
    updateQuestionUI(question);
    }
}

//update Question UI
function updateQuestionUI(question)
{
    // get Question container from DOM
    var questionContainerNode = document.getElementById(question.title);

    questionContainerNode.childNodes[2].innerHTML = "upvote = "+question.upvotes;
    questionContainerNode.childNodes[3].innerHTML = "downvote = "+question.downvotes;
}


// listen for click on submit response button 

function onResponseSubmit(question){
return function(){

    console.log("hello");
    var response = {
        name: comentatorNameNode.value,
        description: commentNode.value,
        isFav:false,
    };

    saveResponse(question, response);
    addResponseInPanel(response);
    //addResponseInPanel(response);
}
}
// display response in response section

//function addResponseInPanel(question){
function addResponseInPanel(response){

    var userNameNode = document.createElement("h5");
        userNameNode.innerHTML = response.name;

    var userCommentNode = document.createElement("p");
        userCommentNode.innerHTML = response.description;

    var respFavNode = document.createElement("button")
        if(response.isFav)
        {
            respFavNode.innerHTML = "Remove Fav";
        }
        else 
        {
            respFavNode.innerHTML = "Add Fav";
        }
        respFavNode.addEventListener("click",toggleFavResponse(response));
        

    var container = document.createElement("div");
        container.appendChild(userNameNode);
        container.appendChild(userCommentNode);
        container.appendChild(respFavNode);
    responseContainerNode.appendChild(container);
}

//toggle Response
function toggleFavResponse(response)
{
    return function(event)
    {
        response.isFav = !response.isFav;
        //saveResponse(question,response);
        if(question.isFav)
        {
        event.target.innerHTML = "Remove Fav";

        }
        else {
            event.target.innerHTML = "Add Fav";
        } 
    }
}


// hide question panel
function hideQuestionPanel(){

    createQuestionFormNode.style.display = "none";
}

// display Question Details
function showDetails(){

    questionDetailContainerNode.style.display= "block"; 
    resolveQuestionContainerNode.style.display= "block"; 
    responseContainerNode.style.display= "block"; 
    commentContainerNode.style.display= "block"; 


}

// show question 
function addQuestionToRight(question){

    var titleNode = document.createElement("h4");
    titleNode.innerHTML = question.title;

    var descriptionNode = document.createElement("p");
    descriptionNode.innerHTML = question.description;

    questionDetailContainerNode.appendChild(titleNode);
    questionDetailContainerNode.appendChild(descriptionNode);

    // var responseeName = document.createElement("h5");
    // responseeName.innerHTML = "question.allResponse.name";

    // var responseeComment = document.createElement("p")
    // responseeComment.innerHTML = "question.allResponse.name.comment";
    // responseContainerNode.appendChild(responseeName);
    // responseContainerNode.appendChild(responseeComment);
    //addResponseInPanel(question);
}

// update question
function updateQuestion(updatedQuestion) 
{
    var allQuestions = getAllQuestions();

    var revisedQuestions = allQuestions.map(function(question){
        if(updatedQuestion.title === question.title)
        {
            return updatedQuestion;
        }

        return question;
    })

    localStorage.setItem("questions", JSON.stringify(revisedQuestions));
}

// save responses
function saveResponse(updatedQuestion ,response){ 

    var allQuestions = getAllQuestions();

    var revisedQuestions = allQuestions.map(function(question){
        if(updatedQuestion.title === question.title)
        {

            // question.responses.push({
            //     name: comentatorNameNode.value,
            //     description: commentNode.value
            // })

            
            question.responses.push(response);

        }
        return question;
    })

    localStorage.setItem("questions", JSON.stringify(revisedQuestions));
}


// clearing question pannel
function clearQuestionDetails(){
    questionDetailContainerNode.innerHTML = "";
}

function clearResponsePanel(){

    responseContainerNode.innerHTML= "";
}



// creating response template
function createResponseTemplate(responseName , responseDescription){

    var responseeName = document.createElement("h5");
    var responseeComment = document.createElement("p");
    var container = document.createElement("div");


        responseeName.innerHTML = responseName;
        responseeComment.innerHTML = responseDescription;
        
            container.appendChild(responseeName);
            container.appendChild(responseeComment);

    responseContainerNode.appendChild(container);
}

// print NO MATCH FOUND
function printNoMatchFound(){
    var title = document.createElement("h1");
    title.innerHTML = "No Match Found";
    allQuestionsListNode.appendChild(title);
}


// resolve Question 
function resolveQuestion(question){


    return function(){
    var allQuestions = getAllQuestions();
    var questionContainerNode = document.getElementById(question.title);

        var indexOfQuestion = allQuestions.findIndex(a => a.title==question.title);

        allQuestions.splice(indexOfQuestion,1);

        localStorage.setItem("questions", JSON.stringify(allQuestions));

        console.log(allQuestions);

        showQuestionPanel();
        hideDetails();
        questionContainerNode.innerHTML="";

    }
}


// show question panel
function showQuestionPanel(){

    createQuestionFormNode.style.display = "block";
}

// hide Question Details
function hideDetails(){

    questionDetailContainerNode.style.display= "none"; 
    resolveQuestionContainerNode.style.display= "none"; 
    responseContainerNode.style.display= "none"; 
    commentContainerNode.style.display= "none"; 


}