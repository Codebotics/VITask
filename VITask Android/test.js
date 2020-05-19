fetch('https://us-central1-node-func.cloudfunctions.net/app/checkversion', {method:'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'version': 8})}).then(res => {
      return res.json()
    }).then(res => {
      console.log(res);
      
    });