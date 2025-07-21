"use strict";
function postToAWS(json) {
    const url = "https://50jynt9yrf.execute-api.us-east-1.amazonaws.com/prod/game-data";
    const fetchOptions = {
        headers: { "Content-type": "application/json;charset=UTF-8" },
        body: json,
        method: "POST",
    };
    console.log("postToAWS: posting to", url);
    fetch(url, fetchOptions).then((response) => {
        console.log("postToAWS: response", JSON.stringify(response));
        if (response.ok) {
            console.log("postToAWS: posted successfully");
        }
        else {
            console.error("postToAWS error:", response.statusText);
        }
    });
}
setTimeout(() => {
    postToAWS(JSON.stringify({ foo: "bar" }));
}, 1000);
//# sourceMappingURL=post-to-aws.js.map