class HttpServices {
    url = "http://KH2244.kitspl.com:8081/parse/logfile";
    search(criteria) {
        const dataInputs = {
            "className": criteria.className,
            "lastTimeInHours": criteria.time
        };
        return new Promise((resolve, reject) => {
            fetch(this.url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=UTF-8"
                },
                body: JSON.stringify(dataInputs)
            }).then(res => res.json()).then(result => {
                if (result.status !== 200 && Array.isArray(result.max) && Array.isArray(result.min)) {
                    resolve(result);
                } else {
                    alert('Looks like there was a problem: ' + result.message);
                }
            }).catch(function (error) {
                alert('Looks like there was a problem: ' + error);
            });
        });
    }
}

export default HttpServices;
