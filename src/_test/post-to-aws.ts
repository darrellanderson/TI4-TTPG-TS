function postToAWS(json: string): void {
  const url: string = "https://50jynt9yrf.execute-api.us-east-1.amazonaws.com";
  const fetchOptions = {
    headers: { "Content-type": "application/json;charset=UTF-8" },
    body: json,
    method: "POST",
  };
  fetch(url, fetchOptions).then((response) => {
    if (response.ok) {
      console.log("postToAWS: posted successfully");
    } else {
      console.error("postToAWS error:", response.statusText);
    }
  });
}

postToAWS("foo");
