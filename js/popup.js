//The first few lines of the code use the querySelector method to get references to various HTML elements on the page, such as text inputs and buttons, as well as some toast messages for success and error messages. 

let longUrlTxt = document.querySelector("#longUrl");
let createBtn = document.querySelector("#create");
let shortUrlTxt = document.querySelector("#shortUrl");
let longUrlErrorDiv = document.querySelector("#longUrldiv");
let longUrlErrorlbl = document.querySelector("#longUrlError");
let successMsgToast = document.querySelector("#successMsg");
let errorMsgToast = document.querySelector(".toast-error");
let loader = document.querySelector('.loading');

//The createBtn button has an event listener attached to it, which triggers when the button is clicked. The code inside this event listener checks if the longUrlTxt input has a value. If it does, the code proceeds to make a POST request to the T.ly API to generate a shortened URL. The request includes the longUrlTxt value, an API token stored locally, and a domain. 

createBtn.addEventListener('click', () => {
    if(longUrlTxt.value){
        longUrlErrorDiv.classList.remove('has-error');
        longUrlErrorlbl.classList.remove("d-visible");
        longUrlErrorlbl.classList.add("d-hide");
        errorMsgToast.classList.add("d-hide");
        successMsgToast.classList.add("d-hide");
        loader.classList.remove('d-hide');

        chrome.storage.local.get(['ApiToken'], function (result) {
        fetch(new URL("https://t.ly/api/v1/link/shorten"), {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ 
                "long_url": longUrlTxt.value,
                "domain": "https://t.ly/",
                "api_token": result.ApiToken
            })

// If the request is successful, the response is converted to JSON format using the json() method. The short URL returned by the API is then displayed in the shortUrlTxt input field, and the longUrlTxt input field is cleared. A success toast message is also displayed. 

        }).then(response => response.json()).then(json => {
            shortUrlTxt.classList.remove('d-hide');
            loader.classList.add('d-hide');                
            successMsgToast.classList.remove("d-hide");
            shortUrlTxt.value=json.short_url;
            longUrlTxt.value="";

//If the request fails for any reason, an error message is displayed in the error toast message, and the loader icon is hidden. 

        }).catch(error => {
            loader.classList.add('d-hide');
            errorMsgToast.classList.remove("d-hide");
            errorMsgToast.textContent = error;
            })
        })
    }
    else{
        longUrlErrorDiv.classList.add('has-error');
        longUrlErrorlbl.classList.remove("d-hide");
        longUrlErrorlbl.classList.add("d-visible");        
    }
});

//The shortUrlTxt input field also has an event listener attached to it, which triggers when the field is clicked. This event listener selects the text in the field and copies it to the clipboard using the execCommand method. 

shortUrlTxt.addEventListener('click', () => {
    shortUrlTxt.select();    
    document.execCommand("copy");
});
